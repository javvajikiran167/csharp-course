import type { ReactNode } from 'react';
import { TopNav } from './TopNav';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-hairline mt-24">
        <div className="container-page py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-caption text-ink-400">
          <span>C# Course · crafted by Kiran Javvaji</span>
          <span>A self-paced course</span>
        </div>
      </footer>
    </div>
  );
}
