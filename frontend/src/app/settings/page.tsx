import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="border-b pb-5">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal profile, workspace details, and rule preferences.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-semibold border-b pb-2">Workspace Settings</h2>
          <form className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Workspace Name</label>
              <input 
                type="text" 
                defaultValue="Default Workspace"
                className="w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500" 
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
