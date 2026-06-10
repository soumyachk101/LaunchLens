export type Platform = 'vercel' | 'netlify' | 'railway' | 'firebase' | 'cloudflare' | 'node';
export type Framework = 'nextjs' | 'react' | 'node' | 'express' | 'other';
export type SessionStatus = 'draft' | 'analyzed' | 'resolved' | 'archived';
export type IssueType = 'auth' | 'env' | 'db' | 'build' | 'dns' | 'api' | 'other';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  platform: Platform;
  framework: Framework;
  repoUrl?: string;
  productionUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosisSession {
  id: string;
  projectId: string;
  createdBy: string;
  title: string;
  status: SessionStatus;
  environment: string;
  issueType: IssueType;
  topCategory?: string;
  topConfidence?: number;
  summaryHeadline?: string;
  rawLogExcerpt?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface SessionInput {
  id: string;
  sessionId: string;
  rawLogs?: string;
  questionnaireJson?: Record<string, unknown>;
  parsedMetadataJson?: Record<string, unknown>;
  createdAt: string;
}

export interface Finding {
  id: string;
  sessionId: string;
  ruleId?: string;
  category: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: number;
  evidenceJson: string[];
  rankOrder: number;
  createdAt: string;
  recommendations?: Recommendation[];
}

export interface Recommendation {
  id: string;
  findingId: string;
  stepOrder: number;
  content: string;
  stepType: 'fix' | 'verify' | 'learn';
  createdAt: string;
}

export interface Rule {
  id: string;
  key: string;
  title: string;
  category: string;
  severity: Severity;
  platformsJson: Platform[];
  frameworksJson: Framework[];
  patternsJson: string[];
  negativePatternsJson: string[];
  recommendationsJson: string[];
  validationJson: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  sessionId: string;
  findingId?: string;
  userId: string;
  wasHelpful: boolean;
  resolutionStatus: 'fixed' | 'partially_fixed' | 'not_fixed';
  note?: string;
  createdAt: string;
}
