export type Platform = 'vercel' | 'netlify' | 'railway' | 'firebase' | 'cloudflare' | 'node';
export type Framework = 'nextjs' | 'react' | 'node' | 'express' | 'other';
export type SessionStatus = 'draft' | 'analyzed' | 'resolved' | 'archived';
export type IssueType = 'auth' | 'env' | 'db' | 'build' | 'dns' | 'api' | 'other';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

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
  createdAt: Date;
}
