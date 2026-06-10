'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  FolderGit2, 
  Settings, 
  Terminal,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';

interface NavigationShellProps {
  children: React.ReactNode;
}

export default function NavigationShell({ children }: NavigationShellProps) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Diagnosis', href: '/diagnosis', icon: PlusCircle },
    { name: 'Sessions', href: '/sessions', icon: History },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (isLanding) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-300">
        {/* Landing Nav Header */}
        <header className="sticky top-0 z-40 border-b border-zinc-900 bg-black/80 backdrop-blur-md transition-all duration-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 active:scale-95 transition-all duration-160 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <Terminal className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                LaunchLens
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              <Link href="#docs" className="hover:text-white transition-colors">Docs</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] duration-160 ease-out"
              >
                Sign In
              </Link>
              <Link 
                href="/diagnosis" 
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 font-semibold px-4 py-2 text-sm shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.97] duration-160 ease-out"
              >
                Start Free Diagnosis
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* App Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-900 bg-[#09090b] flex flex-col fixed inset-y-0 left-0 z-20">
        {/* Brand */}
        <div className="h-16 px-6 border-b border-zinc-900 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/15">
              <Terminal className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              LaunchLens
            </span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-160 active:scale-[0.98] ease-out group ${
                  isActive
                    ? 'bg-zinc-900 text-white border border-zinc-800'
                    : 'text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'
                }`} />
                <span>{item.name}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer profile */}
        <div className="p-4 border-t border-zinc-900 bg-[#0c0c0e]">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <User className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">Developer Account</p>
              <p className="text-[10px] text-zinc-500 truncate">dev@launchlens.io</p>
            </div>
            <button 
              className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-md hover:bg-zinc-900 active:scale-90 transition-all duration-160 ease-out"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content pane */}
      <div className="pl-64 flex-1 flex flex-col min-w-0">
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
