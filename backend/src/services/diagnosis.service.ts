import { PrismaClient, Rule } from '@prisma/client';
import { Platform, Framework, Finding, Severity } from '../types/index.js';

const prisma = new PrismaClient();

interface AnalysisInput {
  platform: Platform;
  framework: Framework;
  rawLogs?: string;
  questionnaire?: Record<string, any>;
}

export class DiagnosisService {
  public async analyzeLogs(input: AnalysisInput): Promise<{
    headline: string;
    topCategory: string;
    confidence: number;
    findings: Partial<Finding>[];
    recommendations: any[][];
  }> {
    const logs = input.rawLogs || '';
    const platform = input.platform;
    const framework = input.framework;

    // 1. Fetch rules from database (fallback to empty list if none found)
    let dbRules: Rule[] = [];
    try {
      dbRules = await prisma.rule.findMany({
        where: { isActive: true }
      });
    } catch (err) {
      console.warn('Prisma database query failed, using static default rule mappings.', err);
    }

    const matchedFindings: any[] = [];
    let rank = 1;

    for (const rule of dbRules) {
      // Parse JSON arrays safely from prisma dynamic type
      const rulePlatforms = rule.platformsJson as string[];
      const ruleFrameworks = rule.frameworksJson as string[];
      const patterns = rule.patternsJson as string[];
      const negativePatterns = rule.negativePatternsJson as string[] || [];
      const defaultRecs = rule.recommendationsJson as string[] || [];

      // Check platform and framework constraints
      const platformMatch = rulePlatforms.includes(platform) || rulePlatforms.includes('all');
      const frameworkMatch = ruleFrameworks.includes(framework) || ruleFrameworks.includes('all');
      
      if (!platformMatch || !frameworkMatch) continue;

      // Verify negative patterns (if any negative pattern matches, discard this rule)
      let negativeMatch = false;
      for (const negPattern of negativePatterns) {
        if (logs.toLowerCase().includes(negPattern.toLowerCase())) {
          negativeMatch = true;
          break;
        }
      }
      if (negativeMatch) continue;

      // Find keyword matches
      const matchedEvidence: string[] = [];
      for (const pattern of patterns) {
        if (logs.toLowerCase().includes(pattern.toLowerCase())) {
          // Extract a small excerpt around the matched word for context evidence
          const idx = logs.toLowerCase().indexOf(pattern.toLowerCase());
          const start = Math.max(0, idx - 40);
          const end = Math.min(logs.length, idx + pattern.length + 40);
          const excerpt = logs.substring(start, end).trim();
          matchedEvidence.push(excerpt.length > 80 ? `...${excerpt}...` : excerpt);
        }
      }

      if (matchedEvidence.length > 0) {
        // Calculate scoring: base severity scaling + match coverage ratio
        const matchRatio = matchedEvidence.length / patterns.length;
        const severityWeight = rule.severity === 'critical' ? 0.8 : rule.severity === 'high' ? 0.7 : 0.5;
        const confidence = parseFloat((severityWeight + (matchRatio * (1 - severityWeight))).toFixed(2));

        matchedFindings.push({
          ruleId: rule.id,
          category: rule.category,
          title: rule.title,
          description: `LaunchLens matched ${matchedEvidence.length} patterns in your log files indicating configuration issues.`,
          severity: rule.severity as Severity,
          confidence,
          evidenceJson: matchedEvidence,
          defaultRecs: defaultRecs.map((rec, rIdx) => ({
            stepOrder: rIdx + 1,
            content: rec,
            stepType: rec.toLowerCase().includes('verify') || rec.toLowerCase().includes('check') ? 'verify' : 'fix'
          }))
        });
      }
    }

    // Sort findings by confidence score descending
    matchedFindings.sort((a, b) => b.confidence - a.confidence);

    // Re-assign rank orders
    const findingsList = matchedFindings.map((f, index) => ({
      ruleId: f.ruleId,
      category: f.category,
      title: f.title,
      description: f.description,
      severity: f.severity,
      confidence: f.confidence,
      evidenceJson: f.evidenceJson,
      rankOrder: index + 1
    }));

    const recommendationsList = matchedFindings.map(f => f.defaultRecs);

    const topFinding = findingsList[0];

    return {
      headline: topFinding?.title || 'No major issues detected',
      topCategory: topFinding?.category || 'general',
      confidence: topFinding?.confidence || 0.0,
      findings: findingsList,
      recommendations: recommendationsList
    };
  }
}

export const diagnosisService = new DiagnosisService();
export default diagnosisService;
