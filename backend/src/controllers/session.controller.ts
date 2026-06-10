import { Request, Response, NextFunction } from 'express';
import { diagnosisService } from '../services/diagnosis.service.js';

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId, platform, framework, environment, title } = req.body;
    
    // Stub implementation returning a mock UUID
    res.status(201).json({
      id: 'sess_' + Math.random().toString(36).substr(2, 9),
      status: 'draft',
    });
  } catch (error) {
    next(error);
  }
}

export async function submitInput(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { rawLogs, questionnaire } = req.body;

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
    const { platform, framework, rawLogs, questionnaire } = req.body;

    const result = await diagnosisService.analyzeLogs({
      platform,
      framework,
      rawLogs,
      questionnaire,
    });

    res.status(200).json({
      sessionId: id,
      summary: {
        headline: result.headline,
        topCategory: result.topCategory,
        confidence: result.confidence,
      },
      findings: result.findings,
    });
  } catch (error) {
    next(error);
  }
}
