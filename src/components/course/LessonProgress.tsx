import { Check } from 'lucide-react';
import type { Lesson } from '@/data/types';
import { useProgress } from '@/store/progress';
import { Eyebrow, Pill } from '@/components/primitives';
import { cn } from '@/lib/cn';

// End-of-lesson card. Lessons are reading units now — the learner marks the
// lesson read when they've worked through it. Quizzes and practice live on the
// topic's dedicated pages.
export function LessonProgress({ lesson }: { lesson: Lesson }) {
  const rec = useProgress((s) => s.lessons[lesson.slug]);
  const setLessonRead = useProgress((s) => s.setLessonRead);
  const read = rec?.read ?? false;

  return (
    <section
      id="lesson-progress"
      className="mt-12 border border-hairline bg-cream-50 p-6"
      aria-label="Lesson progress"
    >
      <div className="flex items-center justify-between">
        <Eyebrow>Track your progress</Eyebrow>
        {read ? <Pill tone="ok" dot>Read</Pill> : <Pill tone="dim">Not yet read</Pill>}
      </div>

      <button
        type="button"
        role="checkbox"
        aria-checked={read}
        onClick={() => setLessonRead(lesson.slug, !read)}
        className={cn(
          'mt-4 group flex w-full flex-wrap items-center gap-3 border bg-white px-4 py-3 text-left transition-colors',
          read ? 'border-ok bg-ok-soft/40' : 'border-hairline hover:border-amber-400',
        )}
      >
        <span
          className={cn(
            'inline-flex h-5 w-5 shrink-0 items-center justify-center border',
            read ? 'border-ok bg-ok text-white' : 'border-hairline bg-white text-transparent',
          )}
        >
          <Check className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 font-sans font-medium text-ink">Mark this lesson as read</span>
      </button>
    </section>
  );
}
