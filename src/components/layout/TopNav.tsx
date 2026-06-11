import { Link, useLocation } from 'react-router-dom';

// Deliberately minimal: just enough to get home, never enough to distract.
export function TopNav() {
  const location = useLocation();
  const isLessonPage =
    /^\/topic\/[^/]+\/[^/]+/.test(location.pathname);

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
          className="flex items-center gap-2 group"
          aria-label="Back to home"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center bg-amber-600 font-serif font-bold text-white text-[13px] leading-none">
            C
          </span>
          <span className="font-serif font-semibold text-[15px] text-ink group-hover:text-amber-700 transition-colors">
            c# craft
          </span>
        </Link>
      </div>
    </header>
  );
}
