import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/store/auth';
import { useProgress } from '@/store/progress';
import { Login } from '@/pages/Login';

// Top-level auth boundary. While we resolve the session we show a calm splash;
// with no session we show the Login screen; once signed in we render the app.
export function AuthGate({ children }: { children: ReactNode }) {
  const status = useAuth((s) => s.status);
  const userId = useAuth((s) => s.userId);
  const init = useAuth((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  // Load this account's progress from Supabase on sign-in; wipe it on sign-out
  // so progress is per-account, never per-browser.
  useEffect(() => {
    if (status === 'signedIn' && userId) {
      void useProgress.getState().hydrate(userId);
    } else if (status === 'signedOut') {
      useProgress.getState().clear();
    }
  }, [status, userId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen grid place-items-center bg-cream">
        <div className="flex flex-col items-center gap-3 text-ink-400">
          <span className="inline-flex h-9 w-9 animate-pulse items-center justify-center bg-amber-600 font-serif text-base font-bold text-white">
            C
          </span>
          <span className="text-caption">Loading…</span>
        </div>
      </div>
    );
  }

  if (status === 'signedOut') return <Login />;

  return <>{children}</>;
}
