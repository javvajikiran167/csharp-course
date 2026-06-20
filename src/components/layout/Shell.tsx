import type { ReactNode } from 'react';
import { TopNav } from './TopNav';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:bg-amber-700 focus:text-white focus:px-4 focus:py-2">Skip to content</a>
      <TopNav />
      <main id="main-content" className="flex-1">{children}</main>
      <footer className="border-t border-hairline mt-24">
        <div className="container-page py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-caption text-ink-400">
          <span>C# Course · crafted by Kiran Javvaji</span>
          <span>A self-paced course</span>
        </div>
      </footer>
    </div>
  );
}
