'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Terminal, Mail, Sparkles, User, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // OAuth Simulation States
  const [oauthProvider, setOauthProvider] = useState<'github' | 'google' | null>(null);
  const [oauthStep, setOauthStep] = useState(0);

  const oauthSteps = [
    { text: 'Establishing secure OAuth 2.0 handshake...', delay: 800 },
    { text: 'Verifying application callback authorizations...', delay: 1600 },
    { text: 'Retrieving API user context and token grants...', delay: 2400 },
    { text: 'Handshake complete! Redirecting to LaunchLens...', delay: 3200 },
  ];

  useEffect(() => {
    if (!oauthProvider) return;

    // Run simulated steps
    const timers = oauthSteps.map((step, idx) => {
      return setTimeout(() => {
        setOauthStep(idx + 1);
        if (idx === oauthSteps.length - 1) {
          // Trigger actual login
          const mockEmail = oauthProvider === 'github' ? 'git-hacker@github.com' : 'cloud-architect@gmail.com';
          const mockName = oauthProvider === 'github' ? 'GitHub Developer' : 'Google Cloud Engineer';
          login(mockEmail, mockName);
        }
      }, step.delay);
    });

    return () => timers.forEach(clearTimeout);
  }, [oauthProvider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    
    try {
      await login(email, name || 'Developer Account');
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setSubmitting(false);
    }
  };

  const handleOAuthClick = (provider: 'github' | 'google') => {
    setOauthStep(0);
    setOauthProvider(provider);
  };

  return (
    <div className="flex-1 min-h-screen bg-black flex flex-col justify-center items-center p-6 relative overflow-hidden select-none grid-pattern">
      {/* Visual background gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-20 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-emerald-500/30 via-transparent to-transparent z-0 animate-pulse-slow" />

      {/* Main Login Card */}
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2.5">
          <Link href="/" className="inline-flex items-center gap-2 group mx-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 active:scale-95 transition-all duration-160 ease-out">
              <Terminal className="w-4.5 h-4.5 text-black stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              LaunchLens
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight pt-2">Sign in to your account</h1>
          <p className="text-xs text-zinc-500">Enter credentials or connect your provider to get started.</p>
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-[#09090b]/80 p-8 shadow-sm space-y-6 backdrop-blur-md">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 font-semibold">
              {error}
            </div>
          )}

          {/* Social Sign-In Buttons */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* GitHub Button */}
            <button
              onClick={() => handleOAuthClick('github')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-850 py-3 text-xs font-semibold shadow-md active:scale-[0.97] transition-all duration-160 ease-out"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>

            {/* Google Button */}
            <button
              onClick={() => handleOAuthClick('google')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-850 py-3 text-xs font-semibold shadow-md active:scale-[0.97] transition-all duration-160 ease-out"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google
            </button>
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-900" />
            </div>
            <span className="relative bg-[#09090b] px-3.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Or email credentials</span>
          </div>

          {/* Local Email Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Display Name (Optional)</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950/40 border border-zinc-900 focus:border-zinc-800 text-zinc-100 pl-10 pr-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 transition-colors" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="email" 
                  placeholder="dev@launchlens.io" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950/40 border border-zinc-900 focus:border-zinc-800 text-zinc-100 pl-10 pr-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 transition-colors" 
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 font-bold py-3 text-sm shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-[0.97] duration-160 ease-out"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="border-t border-zinc-900 pt-5 text-center">
            <span className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Demo accounts auto-verify without passwords
            </span>
          </div>
        </div>
      </div>

      {/* OAuth Handshake Simulation Modal */}
      {oauthProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-850 bg-[#09090b]/90 p-8 shadow-2xl space-y-6 text-center animate-float">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              {oauthStep < oauthSteps.length ? (
                <>
                  <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping" />
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                </>
              ) : (
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
              )}
            </div>

            <div className="space-y-2.5">
              <h2 className="text-base font-bold text-white tracking-tight capitalize">
                {oauthProvider} Authentication
              </h2>
              <div className="space-y-1">
                {oauthSteps.map((step, idx) => {
                  let color = 'text-zinc-600';
                  if (idx === oauthStep) {
                    color = 'text-emerald-400 font-medium';
                  } else if (idx < oauthStep) {
                    color = 'text-zinc-400';
                  }
                  return (
                    <p key={idx} className={`text-xs transition-colors duration-200 ${color}`}>
                      {idx < oauthStep ? '✓ ' : idx === oauthStep ? '❯ ' : '○ '}
                      {step.text}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
