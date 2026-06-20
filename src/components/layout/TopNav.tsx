import { Link, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { usePrefs } from '@/store/prefs';
import { cn } from '@/lib/cn';

// Deliberately minimal: just enough to get home, never enough to distract.
export function TopNav() {
  const location = useLocation();
  const isLessonPage =
    /^\/topic\/[^/]+\/[^/]+/.test(location.pathname);
  const teacherMode = usePrefs((s) => s.teacherMode);
  const toggleTeacherMode = usePrefs((s) => s.toggleTeacherMode);

  return (
    <header
      className={[
        'sticky top-0 z-30 border-b border-hairline transition-colors',
        isLessonPage ? 'bg-cream/95 backdrop-blur' : 'bg-cream/80 backdrop-blur',
      ].join(' ')}
    >
      <div className="container-page flex h-12 items-center justify-between">
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
      </div>
    </header>
  );
}
