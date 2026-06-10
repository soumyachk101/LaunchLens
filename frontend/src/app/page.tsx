import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  ShieldAlert, 
  KeyRound, 
  Database
} from 'lucide-react';

export default function Home() {
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
    <div className="flex-1 flex flex-col bg-black overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent z-0" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-8 backdrop-blur-sm shadow-inner shadow-emerald-500/5 hover:border-emerald-500/30 transition-colors duration-160">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Polished Hackathon MVP Release</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15] bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
          Fix failed deployments in <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">under 10 minutes</span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mt-6 leading-relaxed">
          LaunchLens decodes obscure deployment logs and configuration variables into structured, ranked hypotheses with platform-specific validation checklists.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center w-full max-w-sm">
          <Link
            href="/diagnosis"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-6 py-3.5 text-sm shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.97] duration-160 ease-out"
          >
            Start Diagnosis
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-all active:scale-[0.97] duration-160 ease-out"
          >
            Open Dashboard
          </Link>
        </div>

        {/* Supported Platforms Strip */}
        <div className="mt-20 border-t border-zinc-900 pt-10 w-full">
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Supported Platforms</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-6">
            {platforms.map((platform) => (
              <div 
                key={platform.name}
                className="flex items-center gap-2 text-zinc-400 font-bold text-lg hover:text-white transition-colors duration-160"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400" />
                <span className={`bg-gradient-to-r ${platform.color} bg-clip-text text-transparent`}>
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 border-t border-zinc-900 bg-zinc-950/30 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Developer-First Troubleshooting
            </h2>
            <p className="text-zinc-400 mt-3">
              We focus on plain-English explanations rather than raw stack traces.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative rounded-2xl border border-zinc-900 bg-[#09090b]/40 p-6 shadow-sm transition-all hover:border-zinc-800 hover:bg-zinc-900/10 active:scale-[0.98] duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform duration-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-zinc-100 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 border-t border-zinc-900 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
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
                <span className="font-mono text-3xl font-bold bg-gradient-to-b from-emerald-400 to-emerald-700 bg-clip-text text-transparent leading-none">
                  {step.step}
                </span>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-600 mt-auto bg-black">
        <p>© 2026 LaunchLens. Built for developers, hackers, and students.</p>
      </footer>
    </div>
  );
}
