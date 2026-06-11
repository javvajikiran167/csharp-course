import { useState } from 'react';
import { ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { inline } from '@/lib/inline';
import { cn } from '@/lib/cn';

// Quick-glance bullet summary for the instructor. Open by default so it's
// visible while teaching; collapsible if the student just wants prose.
export function TeachingNotes({ items }: { items: string[] }) {
  const [open, setOpen] = useState(true);
  return (
    <aside
      className="mt-8 border border-amber-300 bg-amber-50"
      aria-label="Teaching notes"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-3 text-left',
          'hover:bg-amber-100 transition-colors',
        )}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5">
          <GraduationCap className="h-4 w-4 text-amber-700" />
          <span className="text-eyebrow font-bold uppercase text-amber-800">
            Teaching notes
          </span>
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-amber-700" />
        ) : (
          <ChevronDown className="h-4 w-4 text-amber-700" />
        )}
      </button>
      {open && (
        <ul className="px-5 pb-4 pt-1 space-y-1.5 text-caption text-ink leading-relaxed">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-1.5 inline-block h-1 w-1 shrink-0 bg-amber-700" />
              <span>{inline(item)}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
