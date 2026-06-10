'use client';

import React, { useState, useEffect } from 'react';
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
  GitBranch,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface DBStatCategory {
  name: string;
  count: number;
}

interface DBStats {
  totalRuns: number;
  resolvedCount: number;
  activeCount: number;
  avgScanSpeed: string;
  categories: DBStatCategory[];
}

interface DBSession {
  id: string;
  title: string;
  environment: string;
  status: string;
  createdAt: string;
  project?: {
    name: string;
    platform: string;
    framework: string;
  };
}

const CATEGORY_MAP: Record<string, string> = {
  auth_config: 'Authentication & Redirects',
  db_conn: 'Database Connectivity',
  env_var: 'Environment Variables',
  api_cors: 'CORS & Base URL Config',
  build_err: 'Build Dependency / NPM',
  dns_ssl: 'Domain, SSL, DNS',
  general: 'General Config',
};

const CATEGORY_COLORS: Record<string, string> = {
  auth_config: 'bg-teal-500',
  db_conn: 'bg-blue-500',
  env_var: 'bg-emerald-500',
  api_cors: 'bg-amber-500',
  build_err: 'bg-red-500',
  dns_ssl: 'bg-purple-500',
  general: 'bg-zinc-650',
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DBStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<DBSession[]>([]);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, sessionsRes] = await Promise.all([
        apiClient.get<DBStats>('/sessions/stats'),
        apiClient.get<DBSession[]>('/sessions'),
      ]);
      setStats(statsRes);
      // Limit recent to 5 entries
      setRecentSessions(sessionsRes.slice(0, 5));
      setError('');
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Connection to diagnosis service failed. Retrying in background...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#09090b]">
        {/* Skeleton Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-6">
          <div className="space-y-2.5">
            <div className="h-8 w-48 rounded bg-zinc-900 animate-pulse" />
            <div className="h-4 w-96 rounded bg-zinc-900 animate-pulse" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-zinc-900 animate-pulse" />
        </div>

        {/* Skeleton Grid Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-900 bg-[#09090b]/80 p-6 h-32 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-3 w-28 rounded bg-zinc-900 animate-pulse" />
                <div className="h-4 w-4 rounded bg-zinc-900 animate-pulse" />
              </div>
              <div className="h-6 w-16 rounded bg-zinc-900 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Skeleton Main Panels */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-zinc-900 bg-[#09090b] p-6 h-96 animate-pulse" />
          <div className="rounded-xl border border-zinc-900 bg-[#09090b] p-6 h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  // Map stats values cleanly
  const totalRuns = stats?.totalRuns || 0;
  const resolvedCount = stats?.resolvedCount || 0;
  const activeCount = stats?.activeCount || 0;
  const avgSpeed = stats?.avgScanSpeed || '1.4s';
  const resolutionRate = totalRuns > 0 ? ((resolvedCount / totalRuns) * 100).toFixed(0) + '%' : '0%';

  const statsCards = [
    { label: 'Total Diagnostic Runs', value: totalRuns, description: 'All database scans', icon: Terminal, color: 'text-emerald-400' },
    { label: 'Resolved Issues', value: resolvedCount, description: `${resolutionRate} resolution rate`, icon: CheckCircle2, color: 'text-teal-400' },
    { label: 'Active Alerts', value: activeCount, description: 'Requires validation', icon: AlertCircle, color: 'text-amber-500' },
    { label: 'Avg. Scan Speed', value: avgSpeed, description: 'Rule engine match time', icon: Zap, color: 'text-blue-400' },
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

      {error && (
        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs p-3 font-semibold flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          {error}
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, idx) => {
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
      {totalRuns === 0 ? (
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-16 text-center select-none space-y-4">
          <AlertCircle className="w-10 h-10 text-zinc-650 mx-auto" />
          <h2 className="text-lg font-bold text-white">No diagnostic runs yet</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Your postgres rules engine is seeded and ready! Provide your build outputs to troubleshoot your domain redirects, Prisma connections, and configuration files.
          </p>
          <Link
            href="/diagnosis"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-black px-5 py-2.5 text-xs font-bold shadow-lg shadow-emerald-500/10 hover:bg-emerald-450 transition-all duration-160 active:scale-95"
          >
            Start First Scan
          </Link>
        </div>
      ) : (
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
                      <span className="capitalize font-medium">{session.project?.platform || 'vercel'}</span>
                      <span>•</span>
                      <span className="capitalize">{session.environment || 'production'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="w-3 h-3 text-zinc-650" />
                        {new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                      session.status === 'resolved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Issue breakdown */}
          <div className="rounded-xl border border-zinc-900 bg-[#09090b] p-6 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-lg font-bold text-white">Issue breakdown</h2>
              </div>
              <div className="space-y-4">
                {(stats?.categories || []).map((cat, idx) => {
                  const label = CATEGORY_MAP[cat.name] || cat.name;
                  const pct = totalRuns > 0 ? ((cat.count / totalRuns) * 100).toFixed(0) + '%' : '0%';
                  const colorClass = CATEGORY_COLORS[cat.name] || 'bg-zinc-600';
                  
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-400">{label}</span>
                        <span className="text-zinc-500">{cat.count} ({pct})</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                        <div className={`h-full ${colorClass}`} style={{ width: pct }} />
                      </div>
                    </div>
                  );
                })}
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
      )}
    </div>
  );
}
