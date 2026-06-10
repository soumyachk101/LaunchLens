'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  ShieldAlert, 
  KeyRound, 
  Database,
  Terminal as TerminalIcon,
  Play,
  CheckCircle,
  AlertTriangle,
  Flame
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [terminalState, setTerminalState] = useState<'idle' | 'running' | 'done'>('idle');

  const logLines = [
    { text: 'yarn run build v1.22.19', type: 'info' },
    { text: '$ next build', type: 'info' },
    { text: '▲ Next.js 15.0.3', type: 'info' },
    { text: 'Creating an optimized production build...', type: 'info' },
    { text: 'Failed to compile.', type: 'error' },
    { text: 'PrismaClientInitializationError: Can\'t reach database server at `postgres.railway.internal`:5432', type: 'error' },
    { text: '  at PrismaClient._request (/app/node_modules/.prisma/client/runtime/index.js:52)', type: 'error' },
    { text: '  at async Page (/app/.next/server/pages/index.js:14)', type: 'error' },
    { text: 'Error: database connection timeout after 15000ms', type: 'error' },
    { text: '---------------------------------------------------', type: 'info' },
    { text: '🔍 LaunchLens Engine: Scanning logs for pattern match...', type: 'scan' },
    { text: '✨ Rule matched: DB_CONNECT_TIMEOUT (Confidence: 94%)', type: 'match' },
    { text: '💡 Fix Generated: Switch database reference to public TCP gateway URL.', type: 'success' },
  ];

  useEffect(() => {
    if (terminalState !== 'running') return;

    const interval = setInterval(() => {
      setActiveLogIndex((prev) => {
        if (prev >= logLines.length - 1) {
          clearInterval(interval);
          setTerminalState('done');
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [terminalState, logLines.length]);

  const handleStartSim = () => {
    setActiveLogIndex(0);
    setTerminalState('running');
  };

  const features = [
    {
      icon: ShieldAlert,
      title: 'Automated Log Parsing',
      description: 'Paste raw, confusing build logs from Vercel, Netlify, or Railway. Our rules engine highlights the exact failure pattern instantly.',
    },
    {
      icon: KeyRound,
      title: 'Environment Variable Checklists',
      description: 'Automatically detects missing or misconfigured keys (like NEXTAUTH_URL or DATABASE_URL) and generates custom setup checklists.',
    },
    {
      icon: Database,
      title: 'Database & Auth Diagnostics',
      description: 'Identifies connection timeouts, migration blockages, and OAuth callback redirect mismatches in plain English.',
    },
    {
      icon: Cpu,
      title: 'Confidence Scoring & Fix Steps',
      description: 'Gives confidence-ranked suggestions mapped to step-by-step remediation plans so you fix issues without searching documentation.',
    },
  ];

  const platforms = [
    { name: 'Vercel', color: 'from-zinc-200 to-zinc-400' },
    { name: 'Netlify', color: 'from-teal-400 to-emerald-400' },
    { name: 'Railway', color: 'from-purple-400 to-indigo-400' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden relative grid-pattern select-none">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/40 via-transparent to-transparent z-0 animate-pulse-slow" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] pointer-events-none opacity-10 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-teal-500/30 via-transparent to-transparent z-0" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-8 backdrop-blur-sm shadow-inner shadow-emerald-500/5 hover:border-emerald-500/30 transition-colors duration-160">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time rules engine is online</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12] bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
          Fix failed deployments in <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent font-black">under 10 minutes</span>
        </h1>

        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mt-6 leading-relaxed">
          LaunchLens decodes obscure deployment logs and environment variables into structured, ranked hypotheses with platform-specific validation checklists.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center w-full max-w-sm">
          <Link
            href="/diagnosis"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-6 py-3.5 text-sm shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.97] duration-160 ease-out"
          >
            Start Diagnosis
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-all active:scale-[0.97] duration-160 ease-out"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-all active:scale-[0.97] duration-160 ease-out"
            >
              Sign In
            </Link>
          )}
        </div>
      </section>

      {/* Cinematic Animated Log Terminal */}
      <section className="relative z-10 max-w-4xl mx-auto w-full px-6 pb-24 animate-float">
        <div className="rounded-2xl border border-zinc-800/80 bg-[#09090b]/90 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Terminal Title Bar */}
          <div className="bg-[#0c0c0f] border-b border-zinc-900 px-4.5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-zinc-500 font-mono text-[11px] ml-2 select-none">deploy-diagnose.log</span>
            </div>
            {terminalState === 'idle' && (
              <button 
                onClick={handleStartSim}
                className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg hover:bg-emerald-500/15 hover:border-emerald-500/30 active:scale-95 transition-all duration-160"
              >
                <Play className="w-3 h-3 fill-emerald-400" />
                Scan Log Sample
              </button>
            )}
            {terminalState === 'running' && (
              <span className="text-xs text-amber-500 flex items-center gap-1.5 animate-pulse font-semibold">
                <Cpu className="w-3 h-3 animate-spin" />
                Diagnosing...
              </span>
            )}
            {terminalState === 'done' && (
              <button 
                onClick={handleStartSim}
                className="text-xs text-zinc-400 hover:text-white transition-colors border border-zinc-800 px-3 py-1 rounded-lg"
              >
                Reset Demo
              </button>
            )}
          </div>

          {/* Terminal Console Area */}
          <div className="p-6 font-mono text-xs text-zinc-400 min-h-[220px] max-h-[320px] overflow-y-auto space-y-2 select-text bg-[#030303]">
            {terminalState === 'idle' ? (
              <div className="h-[200px] flex flex-col items-center justify-center text-center text-zinc-600 gap-2">
                <TerminalIcon className="w-8 h-8 text-zinc-700" />
                <p>Click &quot;Scan Log Sample&quot; to see LaunchLens parsing in real time.</p>
              </div>
            ) : (
              logLines.slice(0, activeLogIndex + 1).map((line, idx) => {
                let color = 'text-zinc-400';
                let icon = null;

                if (line.type === 'error') {
                  color = 'text-red-400 font-semibold';
                  icon = <AlertTriangle className="w-3.5 h-3.5 text-red-500 inline mr-1.5 shrink-0" />;
                } else if (line.type === 'scan') {
                  color = 'text-emerald-400 font-bold';
                  icon = <Cpu className="w-3.5 h-3.5 text-emerald-400 inline mr-1.5 shrink-0 animate-spin" />;
                } else if (line.type === 'match') {
                  color = 'text-teal-400 font-bold';
                  icon = <Flame className="w-3.5 h-3.5 text-teal-400 inline mr-1.5 shrink-0" />;
                } else if (line.type === 'success') {
                  color = 'text-emerald-300 font-bold bg-emerald-950/20 p-2 border border-emerald-900/30 rounded-lg block mt-2';
                  icon = <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline mr-1.5 shrink-0" />;
                }

                return (
                  <div key={idx} className={`leading-relaxed flex items-start ${color}`}>
                    {icon}
                    <span>{line.text}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Supported Platforms Strip */}
      <section className="relative z-10 border-t border-zinc-950 bg-black pt-8 pb-12 w-full text-center">
        <p className="text-xs font-bold tracking-wider text-zinc-600 uppercase">Integrates with major platform runtimes</p>
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-6">
          {platforms.map((platform) => (
            <div 
              key={platform.name}
              className="flex items-center gap-2 text-zinc-400 font-bold text-base hover:text-white transition-colors duration-160"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400" />
              <span className={`bg-gradient-to-r ${platform.color} bg-clip-text text-transparent`}>
                {platform.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 border-t border-zinc-900 bg-zinc-950/20 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Developer-First Troubleshooting
            </h2>
            <p className="text-zinc-400 mt-3 text-sm">
              We focus on plain-English explanations rather than raw stack traces.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative rounded-2xl border border-zinc-900 bg-[#09090b]/40 p-6 shadow-sm transition-all hover:border-zinc-800/80 hover:bg-zinc-900/10 active:scale-[0.98] duration-200 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform duration-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-zinc-100 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 border-t border-zinc-900 py-24 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              How LaunchLens Works
            </h2>
          </div>

          <div className="space-y-12">
            {[
              {
                step: '01',
                title: 'Input logs or complete form',
                description: 'Either paste your failed Vercel/Railway build logs or complete our guided environment variables and auth provider questions.',
              },
              {
                step: '02',
                title: 'Secrets auto-redacted & rule matches',
                description: 'Our regex rules engine normalizes variables, strips sensitive API keys, and maps logs against active deployment rules.',
              },
              {
                step: '03',
                title: 'Get validation checklist',
                description: 'DeployFix provides ranked hypotheses showing why it broke, how to configure the fix, and verification links.',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start group">
                <span className="font-mono text-3xl font-extrabold bg-gradient-to-b from-emerald-450 to-emerald-700 bg-clip-text text-transparent leading-none">
                  {step.step}
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-650 mt-auto bg-black relative z-10">
        <p>© 2026 LaunchLens. Built for developers, hackers, and students.</p>
      </footer>
    </div>
  );
}
