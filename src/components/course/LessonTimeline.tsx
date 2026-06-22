import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import type { Lesson, Topic } from '@/data/types';
import { useProgress } from '@/store/progress';
import { isLessonComplete } from '@/lib/completion';
import { Pill } from '@/components/primitives';
import { inline } from '@/lib/inline';
import { cn } from '@/lib/cn';

type LessonStatus = 'not-started' | 'visited' | 'completed';

type Props = {
  topic: Topic;
};

// Stepper-style lesson list. Three visible states + a highlighted "next up"
// card to tell the student where to resume. All three states render the
// same row shape so the page rhythm stays consistent.
export function LessonTimeline({ topic }: Props) {
  const lessons = topic.lessons;
  const records = useProgress((s) => s.lessons);

  const statusOf = (lesson: Lesson): LessonStatus => {
    const rec = records[lesson.slug];
    if (isLessonComplete(rec)) return 'completed';
    if (rec?.visited) return 'visited';
    return 'not-started';
  };

  // First lesson that is not completed = the "current" one to highlight.
  // (Visited but unfinished beats not-started; if everything is done, no highlight.)
  const nextUpIdx = lessons.findIndex((l) => statusOf(l) !== 'completed');

  return (
    <ol className="relative space-y-2">
      {/* The vertical connector line behind the badges */}
      <span
        className="absolute left-[1.125rem] top-3 bottom-3 w-px bg-hairline pointer-events-none"
        aria-hidden
      />

      {lessons.map((lesson, i) => {
        const status = statusOf(lesson);
        const isNextUp = i === nextUpIdx && status !== 'completed';

        return (
          <li key={lesson.slug} className="relative">
            <LessonRow
              topicSlug={topic.slug}
              lesson={lesson}
              status={status}
              isNextUp={isNextUp}
            />
          </li>
        );
      })}
    </ol>
  );
}

function LessonRow({
  topicSlug,
  lesson,
  status,
  isNextUp,
}: {
  topicSlug: string;
  lesson: Lesson;
  status: LessonStatus;
  isNextUp: boolean;
}) {
  const number = `0${lesson.number}`.slice(-2);

  return (
    <Link
      to={`/topic/${topicSlug}/${lesson.slug}`}
      className={cn(
        'group relative flex items-start gap-5 py-4 px-4 transition-colors',
        'hover:bg-cream-200',
        isNextUp && 'bg-amber-50 ring-1 ring-amber-300',
      )}
    >
      {/* Status badge — sits in front of the connector line */}
      <StatusBadge status={status} number={number} />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {isNextUp && (
            <Pill tone="accent" dot pulse>
              <Sparkles className="h-3 w-3" />
              Next up
            </Pill>
          )}
          <h3
            className={cn(
              'font-sans font-semibold leading-tight',
              status === 'completed' ? 'text-ink-600' : 'text-ink',
            )}
          >
            {inline(lesson.title)}
          </h3>
          {status === 'completed' && <Pill tone="ok">Read</Pill>}
        </div>

        <p className="mt-1 text-caption text-ink-400 leading-relaxed pr-6">
          {inline(lesson.objective)}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-eyebrow text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-3 w-3" />
            {lesson.blocks.length} blocks
          </span>
        </div>
      </div>

      <ArrowRight
        className={cn(
          'mt-3 h-4 w-4 shrink-0 transition-colors',
          isNextUp
            ? 'text-amber-700'
            : 'text-ink-400 group-hover:text-amber-700',
        )}
        aria-hidden
      />
    </Link>
  );
}

function StatusBadge({ status, number }: { status: LessonStatus; number: string }) {
  if (status === 'completed') {
    return (
      <span
        className="relative z-10 mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center bg-ok text-white border border-ok"
        aria-label="Lesson completed"
      >
        <Check className="h-4 w-4" />
      </span>
    );
  }
  if (status === 'visited') {
    return (
      <span
        className="relative z-10 mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center bg-amber-100 text-amber-800 border border-amber-300 font-mono text-caption font-semibold"
        aria-label="Lesson in progress"
      >
        {number}
      </span>
    );
  }
  return (
    <span
      className="relative z-10 mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center bg-cream-50 text-ink-400 border border-hairline font-mono text-caption"
      aria-label="Lesson not started"
    >
      {number}
    </span>
  );
}
