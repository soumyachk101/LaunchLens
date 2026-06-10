import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { diagnosisService } from '../services/diagnosis.service.js';

const prisma = new PrismaClient();

/**
 * Helper to ensure at least one default User, Workspace, and Project exists
 * so that foreign-key constraint checks pass on a freshly provisioned database.
 */
async function ensureDefaultWorkspaceAndProject() {
  // 1. Check/create default user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Developer Account',
        email: 'dev@launchlens.io',
        authProvider: 'local',
      },
    });
  }

  // 2. Check/create default workspace
  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: 'Default Workspace',
        ownerId: user.id,
      },
    });
    // Create member mapping
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: 'owner',
      },
    });
  }

  // 3. Check/create default project
  let project = await prisma.project.findFirst();
  if (!project) {
    project = await prisma.project.create({
      data: {
        workspaceId: workspace.id,
        name: 'Default Project',
        platform: 'vercel',
        framework: 'nextjs',
        createdBy: user.id,
      },
    });
  }

  return { user, project };
}

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { platform, framework, environment, title } = req.body;
    
    // Bootstrap database constraints dynamically
    const { user, project } = await ensureDefaultWorkspaceAndProject();

    const session = await prisma.diagnosisSession.create({
      data: {
        projectId: project.id,
        createdBy: user.id,
        title: title || `Diagnosis Run for ${project.name}`,
        status: 'draft',
        environment: environment || 'production',
        issueType: 'env',
      },
    });

    res.status(201).json({
      id: session.id,
      status: session.status,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitInput(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { rawLogs, questionnaire } = req.body;

    const sessionId = id as string;

    // Verify session exists
    const session = await prisma.diagnosisSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      res.status(404).json({
        error: { code: 'SESSION_NOT_FOUND', message: 'Session ID not found.' }
      });
      return;
    }

    // Insert input logs
    await prisma.sessionInput.create({
      data: {
        sessionId: session.id,
        rawLogs: rawLogs || '',
        questionnaireJson: questionnaire || {},
      },
    });

    res.status(200).json({
      success: true,
      message: 'Logs and questionnaire inputs submitted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

export async function analyzeSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const sessionId = id as string;

    // 1. Retrieve the session and its logs input
    const session = await prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
      include: { project: true }
    });

    if (!session) {
      res.status(404).json({
        error: { code: 'SESSION_NOT_FOUND', message: 'Session ID not found.' }
      });
      return;
    }

    const input = await prisma.sessionInput.findFirst({
      where: { sessionId: sessionId },
      orderBy: { createdAt: 'desc' },
    });

    const rawLogs = input?.rawLogs || '';
    const questionnaire = (input?.questionnaireJson as Record<string, any>) || {};

    const typedSession = session as any;

    // 2. Perform the matching analysis
    const analysis = await diagnosisService.analyzeLogs({
      platform: typedSession.project.platform,
      framework: typedSession.project.framework,
      rawLogs,
      questionnaire,
    });

    // 3. Clear any existing findings to support running analyses repeatedly
    await prisma.finding.deleteMany({
      where: { sessionId: sessionId }
    });

    // 4. Save findings and recommendations inside transactional scopes
    const savedFindings: any[] = [];

    for (let idx = 0; idx < analysis.findings.length; idx++) {
      const findingData = analysis.findings[idx];
      const recs = analysis.recommendations[idx] || [];

      const dbFinding = await prisma.finding.create({
        data: {
          sessionId: sessionId,
          ruleId: findingData.ruleId,
          category: findingData.category || 'general',
          title: findingData.title || '',
          description: findingData.description || '',
          severity: findingData.severity || 'medium',
          confidence: findingData.confidence || 0.0,
          evidenceJson: findingData.evidenceJson || [],
          rankOrder: findingData.rankOrder || 1,
        },
      });

      // Save related recommendations
      const savedRecs: any[] = [];
      for (const rec of recs) {
        const dbRec = await prisma.recommendation.create({
          data: {
            findingId: dbFinding.id,
            stepOrder: rec.stepOrder,
            content: rec.content,
            stepType: rec.stepType,
          },
        });
        savedRecs.push(dbRec);
      }

      savedFindings.push({
        ...dbFinding,
        recommendations: savedRecs,
      });
    }

    // 5. Update parent Diagnosis Session state parameters
    await prisma.diagnosisSession.update({
      where: { id: sessionId },
      data: {
        status: 'analyzed',
        topCategory: analysis.topCategory,
        topConfidence: analysis.confidence,
        summaryHeadline: analysis.headline,
        rawLogExcerpt: rawLogs.substring(0, 100),
      },
    });

    res.status(200).json({
      sessionId: sessionId,
      summary: {
        headline: analysis.headline,
        topCategory: analysis.topCategory,
        confidence: analysis.confidence,
      },
      findings: savedFindings,
    });
  } catch (error) {
    next(error);
  }
}
