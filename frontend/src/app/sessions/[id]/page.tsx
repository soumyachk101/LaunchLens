'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Finding, Severity } from '@/types';
import { 
  CheckCircle2, 
  Terminal as TerminalIcon, 
  Copy, 
  Check, 
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';

interface SessionDetailPageProps {
  params: Promise<{ id: string }>;
}

interface AnalysisResult {
  sessionId: string;
  summary: {
    headline: string;
    topCategory: string;
    confidence: number;
  };
  findings: Finding[];
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isMock = searchParams.get('mock') === 'true';
  const paramPlatform = searchParams.get('platform') || 'vercel';
  const paramFramework = searchParams.get('framework') || 'nextjs';

  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  // Findings data states
  const [headline, setHeadline] = useState('Analyzing issue...');
  const [confidence, setConfidence] = useState(0.0);
  const [findings, setFindings] = useState<Finding[]>([]);

  // Moved and wrapped in useCallback to stabilize dependencies
  const generateMockDiagnostics = useCallback(() => {
    setLoading(true);
    // Generate tailored diagnostic results based on platform and framework
    setTimeout(() => {
      if (paramPlatform === 'vercel' && paramFramework === 'nextjs') {
        setHeadline('NextAuth config domain mismatch');
        setConfidence(0.92);
        setFindings([
          {
            id: 'find_auth_1',
            sessionId: id,
            category: 'auth_config',
            title: 'NEXTAUTH_URL is missing or misconfigured',
            description: 'Your NextAuth endpoints are returning callback URL errors because the host environment does not match the configured domain callback rules.',
            severity: 'high' as Severity,
            confidence: 0.92,
            evidenceJson: [
              '[next-auth][error][CLIENT_FETCH_ERROR] https://nextjs.org/docs/messages/client-fetch-error',
              'Error: NEXTAUTH_URL environment variable is missing in production deployment.',
              'OAuthCallbackError: redirect_uri_mismatch'
            ],
            rankOrder: 1,
            createdAt: new Date().toISOString(),
            recommendations: [
              { id: 'rec_1', findingId: 'find_auth_1', stepOrder: 1, content: 'Log in to your Vercel Dashboard, select your project, and click "Settings" > "Environment Variables".', stepType: 'fix', createdAt: new Date().toISOString() },
              { id: 'rec_2', findingId: 'find_auth_1', stepOrder: 2, content: 'Add a new variable: NEXTAUTH_URL set to your deployment domain (e.g., https://launchlens.vercel.app).', stepType: 'fix', createdAt: new Date().toISOString() },
              { id: 'rec_3', findingId: 'find_auth_1', stepOrder: 3, content: 'In the Github Developer settings, update your OAuth App homepage and redirect Callback URL to match your domain (e.g. https://launchlens.vercel.app/api/auth/callback/github).', stepType: 'fix', createdAt: new Date().toISOString() },
              { id: 'rec_4', findingId: 'find_auth_1', stepOrder: 4, content: 'Trigger a new redeploy on Vercel to propagate settings.', stepType: 'verify', createdAt: new Date().toISOString() }
            ]
          }
        ]);
      } else if (paramPlatform === 'railway') {
        setHeadline('PostgreSQL prisma connect failure');
        setConfidence(0.85);
        setFindings([
          {
            id: 'find_db_1',
            sessionId: id,
            category: 'db_conn',
            title: 'PostgreSQL Database URL or Network Timeout',
            description: 'Prisma Client cannot connect to the Postgres database because the network address is unreachable or the connection string is malformed.',
            severity: 'critical' as Severity,
            confidence: 0.85,
            evidenceJson: [
              'PrismaClientInitializationError: Can\'t reach database server at `postgres.railway.internal`:5432',
              'Connection timed out after 15000ms',
              'Invalid value for DATABASE_URL'
            ],
            rankOrder: 1,
            createdAt: new Date().toISOString(),
            recommendations: [
              { id: 'rec_db_1', findingId: 'find_db_1', stepOrder: 1, content: 'Confirm that your Railway database service is running and not suspended.', stepType: 'verify', createdAt: new Date().toISOString() },
              { id: 'rec_db_2', findingId: 'find_db_1', stepOrder: 2, content: 'Check if you are using private internal networking (e.g. postgres.railway.internal) from outside the Railway private VPC network. If so, switch to the public TCP reference address.', stepType: 'fix', createdAt: new Date().toISOString() },
              { id: 'rec_db_3', findingId: 'find_db_1', stepOrder: 3, content: 'Ensure the DATABASE_URL connection string is updated in your active Railway variables panel.', stepType: 'fix', createdAt: new Date().toISOString() }
            ]
          }
        ]);
      } else {
        setHeadline('CORS network fetch blocked');
        setConfidence(0.78);
        setFindings([
          {
            id: 'find_cors_1',
            sessionId: id,
            category: 'api_cors',
            title: 'Cross-Origin Resource Sharing (CORS) Policy Mismatch',
            description: 'Your API server is rejecting frontend client fetches because your production origins are not whitelisted in the CORS middleware configs.',
            severity: 'medium' as Severity,
            confidence: 0.78,
            evidenceJson: [
              'Access to fetch at "https://api.launchlens.io/data" from origin "https://launchlens.netlify.app" has been blocked by CORS policy',
              'No \'Access-Control-Allow-Origin\' header is present on the requested resource.'
            ],
            rankOrder: 1,
            createdAt: new Date().toISOString(),
            recommendations: [
              { id: 'rec_c_1', findingId: 'find_cors_1', stepOrder: 1, content: 'Check your API server\'s CORS middleware configs (e.g. cors() options in Express).', stepType: 'fix', createdAt: new Date().toISOString() },
              { id: 'rec_c_2', findingId: 'find_cors_1', stepOrder: 2, content: 'Whitelist your Netlify deployed origin URL in the CORS origin array.', stepType: 'fix', createdAt: new Date().toISOString() }
            ]
          }
        ]);
      }
      setLoading(false);
    }, 1500);
  }, [id, paramPlatform, paramFramework]);

  useEffect(() => {
    async function loadSession() {
      try {
        if (isMock) {
          throw new Error('Using mock fallback');
        }

        // Try hitting live backend
        const analysis = await apiClient.post<AnalysisResult>(`/sessions/${id}/analyze`, {});
        setHeadline(analysis.summary.headline);
        setConfidence(analysis.summary.confidence);
        setFindings(analysis.findings || []);
        setLoading(false);
      } catch (err) {
        console.warn('API error or mock fallback triggered, generating simulation...', err);
        generateMockDiagnostics();
      }
    }
    loadSession();
  }, [id, isMock, generateMockDiagnostics]);

  const handleToggleStep = (stepId: string) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handleCopySummary = () => {
    if (findings.length === 0) return;
    const topFinding = findings[0];
    const recsList = topFinding.recommendations?.map(r => `${r.stepOrder}. [${r.stepType.toUpperCase()}] ${r.content}`).join('\n') || '';
    
    const summaryText = `### LaunchLens Diagnosis Report\n\n**Issue Title:** ${topFinding.title}\n**Confidence Score:** ${(topFinding.confidence * 100).toFixed(0)}%\n**Severity:** ${topFinding.severity.toUpperCase()}\n\n**Description:** ${topFinding.description}\n\n**Fix Checklist:**\n${recsList}`;
    
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResolve = () => {
    setResolved(true);
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md space-y-6">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white tracking-tight">Fetching diagnosis results</h2>
          <p className="text-xs text-zinc-500 font-mono">Parsing findings for {id}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#09090b]">
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/sessions" className="text-xs font-semibold text-zinc-500 hover:text-zinc-300">
              ← Sessions History
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-2 flex items-center gap-2.5">
            {headline}
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
              resolved 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}>
              {resolved ? 'Resolved' : 'Active'}
            </span>
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Session ID: {id} {isMock && '(Simulated)'}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopySummary}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:text-white transition-all active:scale-[0.97] duration-160 ease-out"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Summary!' : 'Copy Summary'}
          </button>
          {!resolved && (
            <button 
              onClick={handleResolve}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4.5 py-2.5 text-xs shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.97] duration-160 ease-out"
            >
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              Mark Resolved
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left main pane: Findings and Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {findings.map((finding) => (
            <div key={finding.id} className="space-y-6">
              {/* Finding Info Card */}
              <div className="rounded-2xl border border-zinc-900 bg-[#09090b] p-6 shadow-sm space-y-4">
                <div className="flex items-start gap-4 justify-between border-b border-zinc-900 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{finding.category}</span>
                    <h2 className="text-xl font-bold text-white tracking-tight">{finding.title}</h2>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    finding.severity === 'critical' || finding.severity === 'high' 
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}>
                    {finding.severity} Severity
                  </span>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  {finding.description}
                </p>
              </div>

              {/* Fix Recommendations Checklist */}
              <div className="rounded-2xl border border-zinc-900 bg-[#09090b] p-6 shadow-sm space-y-5">
                <div className="border-b border-zinc-900 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Recommended Fixes Checklist
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">Complete these action items in order to resolve the config failure.</p>
                </div>

                <div className="space-y-3.5">
                  {finding.recommendations?.map((rec) => {
                    const isChecked = !!checkedSteps[rec.id];
                    return (
                      <div 
                        key={rec.id} 
                        onClick={() => handleToggleStep(rec.id)}
                        className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all active:scale-[0.99] duration-160 ${
                          isChecked 
                            ? 'border-emerald-500/20 bg-emerald-500/5 opacity-70' 
                            : 'border-zinc-900 bg-zinc-950/20 hover:border-zinc-800'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-colors ${
                          isChecked 
                            ? 'bg-emerald-500 border-emerald-500 text-black' 
                            : 'border-zinc-800 bg-zinc-950/60'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] font-bold text-zinc-500 tracking-wider uppercase">Step {rec.stepOrder}</span>
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              rec.stepType === 'fix' 
                                ? 'bg-amber-500/10 text-amber-500' 
                                : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {rec.stepType}
                            </span>
                          </div>
                          <p className={`text-sm leading-relaxed ${
                            isChecked ? 'text-zinc-400 line-through' : 'text-zinc-200'
                          }`}>
                            {rec.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Raw Log Evidence matched */}
              <div className="rounded-2xl border border-zinc-900 bg-[#09090b] p-6 shadow-sm space-y-4">
                <div className="border-b border-zinc-900 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-emerald-400" />
                    Matched Log Evidence
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">Highlighted output phrases matching this diagnosis.</p>
                </div>

                <div className="space-y-2.5">
                  {finding.evidenceJson.map((evidence, idx) => (
                    <div key={idx} className="rounded-lg bg-black border border-zinc-900/60 p-3.5 font-mono text-xs text-zinc-400 overflow-x-auto leading-relaxed whitespace-pre">
                      <span className="text-emerald-500 select-none font-bold mr-2">›</span>
                      {evidence}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Info Rail */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="rounded-2xl border border-zinc-900 bg-[#09090b] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-3">Session Metadata</h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500 font-semibold">Diagnosis Accuracy</span>
                <span className="font-bold text-emerald-400">{(confidence * 100).toFixed(0)}% Match</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500 font-semibold">Environment</span>
                <span className="font-bold text-zinc-200 capitalize">Production</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500 font-semibold">Target Stack</span>
                <span className="font-bold text-zinc-200 capitalize">{paramFramework}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-semibold">Deployment Platform</span>
                <span className="font-bold text-zinc-200 capitalize">{paramPlatform}</span>
              </div>
            </div>
          </div>

          {/* Quick Info Alerts */}
          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Info className="w-4.5 h-4.5" />
              <h4 className="text-xs font-bold tracking-wide uppercase">DeployFix Tips</h4>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              If redeployment fails after editing environment variables, verify that you triggered a build from the correct branch and didn&apos;t hit provider deployment limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
