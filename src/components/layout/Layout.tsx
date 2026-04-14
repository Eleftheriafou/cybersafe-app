import { type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 flex flex-col">
      <header className="w-full px-6 py-4 flex items-center gap-3 border-b border-white/10">
        <span className="text-2xl">🛡️</span>
        <span className="text-white font-semibold tracking-wide text-lg">
          CyberSafe Challenge
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">{children}</div>
      </main>

      <footer className="px-6 py-3 text-center text-xs text-white/30">
        Internal Security Awareness Program &mdash; Not for distribution
      </footer>
    </div>
  );
}
