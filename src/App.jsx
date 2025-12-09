import React from 'react';
import Dashboard from './components/Dashboard';
import { Terminal, Sparkles } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen relative">
      {/* Dynamic Background */}
      <div className="bg-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>
      <div className="fixed inset-0 grid-overlay -z-10"></div>

      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 border-b border-glass-border bg-slate-900/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-500">
              <Terminal size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-glow transition-all duration-300">
                Data Weaver
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold group-hover:text-primary transition-colors">
                AI For Bharat
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary-glow flex items-center gap-1.5 animate-pulse-slow">
              <Sparkles size={12} />
              <span>Week 3 Challenge Entry</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 relative z-10">
        <Dashboard />
      </main>

      {/* Footer */}
      <footer className="border-t border-glass-border bg-slate-900/40 backdrop-blur-sm text-center py-6 text-slate-500 text-sm relative z-10">
        <p className="flex items-center justify-center gap-2">
          Designed By :- <span className="white-red-500">Aditya Banerjee</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
