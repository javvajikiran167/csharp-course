import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, ShieldCheck, LogOut } from 'lucide-react';
import { usePrefs } from '@/store/prefs';
import { useAuth } from '@/store/auth';
import { cn } from '@/lib/cn';

// Deliberately minimal: just enough to get home, never enough to distract.
export function TopNav() {
  const location = useLocation();
  const isLessonPage =
    /^\/topic\/[^/]+\/[^/]+/.test(location.pathname);
  const teacherMode = usePrefs((s) => s.teacherMode);
  const toggleTeacherMode = usePrefs((s) => s.toggleTeacherMode);

  const username = useAuth((s) => s.username);
  const displayName = useAuth((s) => s.displayName);
  const isAdmin = useAuth((s) => s.isAdmin);
  const signOut = useAuth((s) => s.signOut);

  return (
    <header
      className={[
        'sticky top-0 z-30 border-b border-hairline transition-colors',
        isLessonPage ? 'bg-cream/95 backdrop-blur' : 'bg-cream/80 backdrop-blur',
      ].join(' ')}
    >
      <div className="container-page flex h-12 items-center justify-between gap-3">
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          aria-label="Back to home"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center bg-amber-600 font-serif font-bold text-white text-[13px] leading-none">
            C
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-serif font-semibold text-[15px] text-ink group-hover:text-amber-700 transition-colors">
              C# Course
            </span>
            <span className="hidden sm:inline text-eyebrow text-ink-400">
              crafted by Kiran Javvaji
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Instructor-only console link */}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                'inline-flex items-center gap-1.5 border px-3 py-2 sm:px-2.5 sm:py-1 min-h-[40px] sm:min-h-0 text-eyebrow font-semibold uppercase transition-colors',
                location.pathname === '/admin'
                  ? 'border-amber-400 bg-amber-100 text-amber-800'
                  : 'border-hairline bg-white text-ink-500 hover:border-amber-400 hover:text-amber-700',
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Console</span>
            </Link>
          )}

          {/* Teacher mode toggle (reveals teaching notes) — instructors only,
              so students can never surface the instructor-facing notes. */}
          {isAdmin && (
            <button
              type="button"
              onClick={toggleTeacherMode}
              aria-pressed={teacherMode}
              aria-label={teacherMode ? 'Teacher mode on, hide teaching notes' : 'Teacher mode off, show teaching notes'}
              title={
                teacherMode
                  ? 'Teacher mode on — teaching notes are visible. Click to hide.'
                  : 'Teacher mode off — teaching notes are hidden. Click to show.'
              }
              className={cn(
                'inline-flex items-center gap-1.5 border px-3 py-2 sm:px-2.5 sm:py-1 min-h-[40px] sm:min-h-0 text-eyebrow font-semibold uppercase transition-colors',
                teacherMode
                  ? 'border-amber-400 bg-amber-100 text-amber-800'
                  : 'border-hairline bg-white text-ink-500 hover:border-amber-400 hover:text-amber-700',
              )}
            >
              <GraduationCap className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Teacher</span>
            </button>
          )}

          {/* Signed-in identity + sign out */}
          {username && (
            <>
              <span
                className="hidden md:inline max-w-[12ch] truncate text-caption text-ink-400"
                title={displayName ?? username}
              >
                {displayName ?? username}
              </span>
              <button
                type="button"
                onClick={() => void signOut()}
                aria-label="Sign out"
                title="Sign out"
                className="inline-flex items-center gap-1.5 border border-hairline bg-white px-3 py-2 sm:px-2.5 sm:py-1 min-h-[40px] sm:min-h-0 text-eyebrow font-semibold uppercase text-ink-500 transition-colors hover:border-amber-400 hover:text-amber-700"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
