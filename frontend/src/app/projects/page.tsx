import React from 'react';

export default function ProjectsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your apps and environments configured for diagnostics.
          </p>
        </div>
        <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-sm">
          Create Project
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="text-sm text-muted-foreground py-12 text-center">
          No projects configured. Create a project to start grouping your deployment diagnostic sessions.
        </div>
      </div>
    </div>
  );
}
