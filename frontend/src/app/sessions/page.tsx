'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  History, 
  Search, 
  Terminal, 
  AlertCircle, 
  ChevronRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

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

export default function SessionsPage() {
  const [sessions, setSessions] = useState<DBSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<DBSession[]>('/sessions');
      setSessions(data);
      setError('');
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setError('Could not retrieve sessions from rules engine.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.title.toLowerCase().includes(search.toLowerCase()) || 
      (session.project?.name || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesPlatform = platformFilter 
      ? session.project?.platform === platformFilter 
      : true;
      
    const matchesStatus = statusFilter 
      ? session.status === statusFilter 
      : true;
      
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#09090b] flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-450" />
        <p className="text-zinc-500 font-mono text-xs">Loading sessions history...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#09090b]">
      {/* Sessions Header */}
      <div className="border-b border-zinc-900 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <History className="w-8 h-8 text-emerald-400" />
          Diagnosis Sessions
        </h1>
        <p className="text-zinc-400 mt-1.5 text-sm">
          Review and audit past diagnosis logs and resolution actions.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 font-semibold">
          {error}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-zinc-950/20 border border-zinc-900 p-4 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search sessions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-black border border-zinc-900 focus:border-zinc-800 text-zinc-300 pl-10 pr-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 transition-colors" 
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs font-semibold text-zinc-400">Filters:</span>
          </div>

          <select 
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="rounded-lg bg-black border border-zinc-900 text-zinc-400 hover:text-zinc-300 px-3 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
          >
            <option value="">All Platforms</option>
            <option value="vercel">Vercel</option>
            <option value="netlify">Netlify</option>
            <option value="railway">Railway</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg bg-black border border-zinc-900 text-zinc-400 hover:text-zinc-300 px-3 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="analyzed">Analyzed</option>
            <option value="resolved">Resolved</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="rounded-2xl border border-zinc-900 bg-[#09090b] overflow-hidden shadow-sm">
        {filteredSessions.length > 0 ? (
          <div className="divide-y divide-zinc-900">
            {filteredSessions.map((session) => (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className="flex items-center justify-between p-5 hover:bg-zinc-950/30 transition-colors group select-none"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform duration-200">
                    <Terminal className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">
                      {session.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="font-medium text-zinc-400">{session.project?.name || 'Default Project'}</span>
                      <span>•</span>
                      <span className="capitalize">{session.project?.platform || 'vercel'}</span>
                      <span>•</span>
                      <span className="capitalize">{session.environment}</span>
                      <span>•</span>
                      <span>{new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                    session.status === 'resolved' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {session.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-650 group-hover:text-zinc-450 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-sm text-zinc-500 py-16 text-center select-none space-y-3">
            <AlertCircle className="w-8 h-8 text-zinc-650 mx-auto" />
            <p className="font-medium">No sessions match your search criteria.</p>
            <p className="text-xs text-zinc-650">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
