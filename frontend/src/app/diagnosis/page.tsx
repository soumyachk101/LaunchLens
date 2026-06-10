'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Platform, Framework, IssueType } from '@/types';
import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  Cpu, 
  Lock, 
  Check
} from 'lucide-react';

export default function DiagnosisPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Reading logs...');

  // Form States
  const [projectName, setProjectName] = useState('My Web App');
  const [platform, setPlatform] = useState<Platform>('vercel');
  const [framework, setFramework] = useState<Framework>('nextjs');
  const [environment] = useState('production');
  
  const [inputMethod, setInputMethod] = useState<'logs' | 'form' | 'both'>('logs');
  const [rawLogs, setRawLogs] = useState('');
  
  // Questionnaire States
  const [workedLocally, setWorkedLocally] = useState<boolean | null>(null);
  const [issueType, setIssueType] = useState<IssueType>('env');
  const [recentChanges, setRecentChanges] = useState<string[]>([]);

  // Simulated Scanning Animation Messages
  useEffect(() => {
    if (!loading) return;

    const timers = [
      setTimeout(() => setLoadingMessage('Detecting credentials to redact...'), 1200),
      setTimeout(() => setLoadingMessage('Matching logs against rule library...'), 2400),
      setTimeout(() => setLoadingMessage('Calculating confidence values...'), 3600),
      setTimeout(() => setLoadingMessage('Assembling fix checklist...'), 4800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const toggleChange = (val: string) => {
    setRecentChanges(prev => 
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleStartAnalysis = async () => {
    setLoading(true);
    try {
      // 1. Create session
      const createRes = await apiClient.post<{ id: string }>('/sessions', {
        projectName,
        platform,
        framework,
        environment,
        title: `Diagnosis for ${projectName} on ${platform}`,
      });

      const sessionId = createRes.id;

      // 2. Submit logs/questionnaire input
      await apiClient.post(`/sessions/${sessionId}/input`, {
        rawLogs,
        questionnaire: {
          workedLocally,
          issueType,
          recentChanges,
        },
      });

      // 3. Analyze session
      await apiClient.post(`/sessions/${sessionId}/analyze`, {
        platform,
        framework,
        rawLogs,
        questionnaire: {
          workedLocally,
          issueType,
          recentChanges,
        },
      });

      // Redirect to the dynamic details view
      router.push(`/sessions/${sessionId}`);
    } catch (err) {
      console.error(err);
      // Fail gracefully: redirect to a mock session ID if backend connection fails
      const mockSessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
      setTimeout(() => {
        router.push(`/sessions/${mockSessionId}?mock=true&platform=${platform}&framework=${framework}`);
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md space-y-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 animate-ping" />
            <div className="relative w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Cpu className="w-8 h-8 animate-spin duration-1000" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Analyzing deployment issues</h2>
            <p className="text-sm text-zinc-400 font-medium font-mono min-h-[20px] transition-all duration-300">
              {loadingMessage}
            </p>
          </div>

          <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse w-full transition-all duration-1000" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 bg-[#09090b]">
      {/* Wizard Header */}
      <div className="border-b border-zinc-900 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">New Diagnosis</h1>
        <p className="text-zinc-400 mt-1.5 text-sm">
          Run your application deployment logs through the LaunchLens analysis pipeline.
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 select-none">
        {['Project details', 'Input method', 'Provide logs', 'Review'].map((name, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
              step > idx + 1 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                : step === idx + 1 
                  ? 'bg-zinc-800 border-zinc-700 text-white' 
                  : 'border-zinc-900'
            }`}>
              {step > idx + 1 ? <Check className="w-3 h-3 stroke-[2.5]" /> : idx + 1}
            </span>
            <span className={step === idx + 1 ? 'text-zinc-300 font-bold' : 'hidden md:inline'}>{name}</span>
            {idx < 3 && <span className="text-zinc-800">/</span>}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-900 bg-[#09090b]/80 p-8 shadow-sm space-y-6">
        {/* Step 1: Project Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Project context</h2>
              <p className="text-xs text-zinc-500 mt-1">Specify your current hosting target and framework details.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Project Name</label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950/40 border border-zinc-800 focus:border-zinc-700 text-zinc-100 px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 transition-colors" 
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Target Platform</label>
                  <select 
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-full rounded-lg bg-zinc-950/40 border border-zinc-800 focus:border-zinc-700 text-zinc-100 px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 transition-colors"
                  >
                    <option value="vercel">Vercel</option>
                    <option value="netlify">Netlify</option>
                    <option value="railway">Railway</option>
                    <option value="other">Other / Custom Server</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Framework</label>
                  <select 
                    value={framework}
                    onChange={(e) => setFramework(e.target.value as Framework)}
                    className="w-full rounded-lg bg-zinc-950/40 border border-zinc-800 focus:border-zinc-700 text-zinc-100 px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 transition-colors"
                  >
                    <option value="nextjs">Next.js</option>
                    <option value="react">React / Vite</option>
                    <option value="node">Node.js API / Express</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="button" 
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 px-4.5 py-2.5 text-sm font-semibold text-zinc-200 transition-all active:scale-[0.97] duration-160 ease-out"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Input Method */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Choose analysis inputs</h2>
              <p className="text-xs text-zinc-500 mt-1">Select how you want to provide deployment debug logs.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {([
                { id: 'logs', title: 'Paste Logs', desc: 'Copy build/server log outputs directly.' },
                { id: 'form', title: 'Guided Questionnaire', desc: 'Answer directed config queries.' },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setInputMethod(m.id)}
                  className={`text-left p-5 rounded-xl border ${
                    inputMethod === m.id 
                      ? 'border-emerald-500/40 bg-emerald-500/5' 
                      : 'border-zinc-900 bg-zinc-950/20 hover:border-zinc-800'
                  } transition-all active:scale-[0.98] duration-160 ease-out`}
                >
                  <h3 className="font-bold text-sm text-zinc-100">{m.title}</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{m.desc}</p>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button 
                type="button" 
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950/20 border border-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-all active:scale-[0.97] duration-160 ease-out"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button 
                type="button" 
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 px-4.5 py-2.5 text-sm font-semibold text-zinc-200 transition-all active:scale-[0.97] duration-160 ease-out"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Provide Logs / Questionnaire */}
        {step === 3 && (
          <div className="space-y-6">
            {inputMethod === 'logs' ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Paste logs output</h2>
                  <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    Sensitive API tokens, passwords, and private values are redacted automatically.
                  </p>
                </div>

                <div className="relative">
                  <textarea 
                    value={rawLogs}
                    onChange={(e) => setRawLogs(e.target.value)}
                    placeholder="Error: NEXTAUTH_URL environment variable is missing... or database connection timeout..."
                    rows={12}
                    className="w-full rounded-xl bg-zinc-950/60 border border-zinc-900 focus:border-zinc-800 font-mono text-xs text-zinc-300 p-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50 resize-y"
                  />
                  {rawLogs.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-zinc-600 space-y-2">
                      <Upload className="w-6 h-6 stroke-[1.5]" />
                      <span className="text-[10px] font-semibold tracking-wider uppercase">Logs Empty</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Guided Troubleshooting</h2>
                  <p className="text-xs text-zinc-500 mt-1">Answer these configurations questions to narrow down matches.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Did it work locally?</label>
                    <div className="flex gap-4">
                      {[
                        { val: true, label: 'Yes' },
                        { val: false, label: 'No' },
                      ].map((o) => (
                        <button
                          key={o.label}
                          type="button"
                          onClick={() => setWorkedLocally(o.val)}
                          className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all active:scale-95 duration-160 ${
                            workedLocally === o.val 
                              ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400' 
                              : 'border-zinc-900 text-zinc-400 hover:border-zinc-800'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">What broke?</label>
                    <select 
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value as IssueType)}
                      className="w-full rounded-lg bg-zinc-950/40 border border-zinc-800 text-zinc-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                    >
                      <option value="env">Missing Environment Variables</option>
                      <option value="auth">OAuth / NextAuth callback URLs</option>
                      <option value="db">Prisma / Postgres connection failures</option>
                      <option value="build">Build dependencies / NPM package issues</option>
                      <option value="dns">Domain, SSL, DNS settings</option>
                      <option value="api">CORS errors, fetch failure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Recent Changes</label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { key: 'env_vars', label: 'Updated env variables' },
                        { key: 'domain', label: 'Changed custom domain' },
                        { key: 'auth_provider', label: 'Updated OAuth credentials' },
                        { key: 'db_setup', label: 'Modified database/schemas' },
                      ].map((c) => {
                        const active = recentChanges.includes(c.key);
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => toggleChange(c.key)}
                            className={`text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-all duration-160 active:scale-[0.98] ${
                              active 
                                ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400' 
                                : 'border-zinc-900 text-zinc-400 hover:border-zinc-800'
                            }`}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button 
                type="button" 
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950/20 border border-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-all active:scale-[0.97] duration-160 ease-out"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button 
                type="button" 
                onClick={handleNext}
                disabled={inputMethod === 'logs' && !rawLogs.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 px-4.5 py-2.5 text-sm font-semibold text-zinc-200 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-[0.97] duration-160 ease-out"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review Input */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Review diagnostic parameters</h2>
              <p className="text-xs text-zinc-500 mt-1">Review the details before running the analysis engine.</p>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-5 space-y-3.5 text-sm">
              <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                <span className="text-zinc-500 font-semibold">Project</span>
                <span className="text-zinc-200 font-bold">{projectName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                <span className="text-zinc-500 font-semibold">Stack</span>
                <span className="text-zinc-200 font-medium capitalize">{framework} on {platform}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                <span className="text-zinc-500 font-semibold">Input Type</span>
                <span className="text-zinc-200 font-medium capitalize">{inputMethod}</span>
              </div>
              {inputMethod === 'logs' && (
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-semibold">Log Bytes</span>
                  <span className="text-zinc-200 font-mono text-xs">{rawLogs.length} chars</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button 
                type="button" 
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950/20 border border-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-all active:scale-[0.97] duration-160 ease-out"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button 
                type="button" 
                onClick={handleStartAnalysis}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-5 py-2.5 text-sm transition-all active:scale-[0.97] duration-160 ease-out"
              >
                <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
                Run Engine Scan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
