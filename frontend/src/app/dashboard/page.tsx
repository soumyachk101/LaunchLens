'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Zap,
  TrendingUp,
  ArrowUpRight,
  GitBranch
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Diagnostic Runs', value: '14', description: '+2 this week', icon: Terminal, color: 'text-emerald-400' },
    { label: 'Resolved Issues', value: '11', description: '78.5% resolution rate', icon: CheckCircle2, color: 'text-teal-400' },
    { label: 'Active Alerts', value: '3', description: 'Require validation', icon: AlertCircle, color: 'text-amber-500' },
    { label: 'Avg. Scan Speed', value: '1.4s', description: 'Rule engine match time', icon: Zap, color: 'text-blue-400' },
  ];

  const recentSessions = [
    { id: 'sess_nextauth_mismatch', title: 'NextAuth callback mismatch', platform: 'Vercel', env: 'production', time: '2 hours ago', status: 'active', category: 'auth_config' },
    { id: 'sess_prisma_connect', title: 'Prisma DB connection timeout', platform: 'Railway', env: 'preview', time: '1 day ago', status: 'resolved', category: 'db_conn' },
    { id: 'sess_missing_aws', title: 'Missing AWS S3 variables', platform: 'Netlify', env: 'production', time: '3 days ago', status: 'resolved', category: 'env_var' },
    { id: 'sess_cors_fetch', title: 'CORS API fetch blocked', platform: 'Vercel', env: 'preview', time: '4 days ago', status: 'resolved', category: 'api_cors' },
  ];

  const commonCategories = [
    { name: 'Environment Variables', count: 6, percentage: '43%', color: 'bg-emerald-500' },
    { name: 'Authentication & Redirects', count: 4, percentage: '28%', color: 'bg-teal-500' },
    { name: 'Database Connectivity', count: 3, percentage: '21%', color: 'bg-blue-500' },
    { name: 'CORS & Base URL Config', count: 1, percentage: '8%', color: 'bg-zinc-600' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#09090b]">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-1.5 text-sm">
            Monitor deployments and diagnose configuration errors from Vercel, Netlify, and Railway.
          </p>
        </div>
        <Link 
          href="/diagnosis" 
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4.5 py-2.5 text-sm shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.97] duration-160 ease-out"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          New Diagnosis
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-xl border border-zinc-900 bg-[#09090b]/80 p-6 shadow-sm flex flex-col justify-between hover:border-zinc-800 transition-all duration-160 active:scale-[0.99] ease-out">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Sessions */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-900 bg-[#09090b] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <h2 className="text-lg font-bold text-white">Recent Sessions</h2>
            <Link href="/sessions" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5">
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-900">
            {recentSessions.map((session) => (
              <div key={session.id} className="py-3.5 flex items-center justify-between group hover:bg-zinc-950/20 px-2 rounded-lg transition-colors duration-160">
                <div className="space-y-1">
                  <Link href={`/sessions/${session.id}`} className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors hover:underline">
                    {session.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="capitalize font-medium">{session.platform}</span>
                    <span>•</span>
                    <span className="capitalize">{session.env}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      {session.time}
                    </span>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                    session.status === 'active' 
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Common Issues & Actions */}
        <div className="rounded-xl border border-zinc-900 bg-[#09090b] p-6 shadow-sm flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="border-b border-zinc-900 pb-3">
              <h2 className="text-lg font-bold text-white">Issue breakdown</h2>
            </div>
            <div className="space-y-4">
              {commonCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">{cat.name}</span>
                    <span className="text-zinc-500">{cat.count} ({cat.percentage})</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                    <div className={`h-full ${cat.color}`} style={{ width: cat.percentage }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-5 space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Quick Actions</h3>
            <div className="grid gap-2">
              <Link 
                href="/diagnosis" 
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-xs font-semibold text-zinc-300 hover:text-white transition-all active:scale-[0.98] duration-160 ease-out"
              >
                <GitBranch className="w-4 h-4 text-emerald-400" />
                Diagnose Local Environment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
