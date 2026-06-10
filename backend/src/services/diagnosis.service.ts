import { Platform, Framework, Finding, Severity } from '../types/index.js';

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
  }> {
    const findings: Partial<Finding>[] = [];
    const logs = input.rawLogs || '';

    // A simple mock matcher rule for testing compilation/pipeline
    if (logs.includes('NEXTAUTH_URL') || logs.includes('Invalid URL')) {
      findings.push({
        id: 'find_mock_1',
        category: 'auth_config',
        title: 'NEXTAUTH_URL or callback URL mismatch',
        description: 'NextAuth detects a mismatch between your environment variable configurations and the domain requesting auth.',
        severity: 'high' as Severity,
        confidence: 0.87,
        evidenceJson: ['NEXTAUTH_URL', 'Invalid URL'],
        rankOrder: 1,
      });
    }

    const topFinding = findings[0];

    return {
      headline: topFinding?.title || 'No issues detected',
      topCategory: topFinding?.category || 'general',
      confidence: topFinding?.confidence || 0.0,
      findings,
    };
  }
}

export const diagnosisService = new DiagnosisService();
export default diagnosisService;
