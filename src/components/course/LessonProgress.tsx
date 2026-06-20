import { Check, RotateCcw } from 'lucide-react';
import type { Lesson } from '@/data/types';
import { useProgress } from '@/store/progress';
import { isLessonComplete } from '@/lib/completion';
import { Eyebrow, Pill } from '@/components/primitives';
import { cn } from '@/lib/cn';

// End-of-lesson card. Completion is fully manual: the learner ticks the quiz
// and practice boxes themselves; a lesson is complete only when both are on.
export function LessonProgress({ lesson }: { lesson: Lesson }) {
  const rec = useProgress((s) => s.lessons[lesson.slug]);
  const setQuizDone = useProgress((s) => s.setQuizDone);
  const setPracticeDone = useProgress((s) => s.setPracticeDone);
  const resetLesson = useProgress((s) => s.resetLesson);

  const challengeCount = lesson.challenges?.length ?? 0;
  const hasPractice = challengeCount > 0;
  const quizDone = rec?.quizDone ?? false;
  const practiceDone = rec?.practiceDone ?? false;
  const complete = isLessonComplete(lesson, rec);
  const touched = quizDone || practiceDone || Boolean(rec?.visited);

  const quizHint =
    rec && rec.totalQuestions > 0
      ? `best score ${rec.quizScore}/${rec.totalQuestions}`
      : 'not attempted yet';
  const practiceHint = `${challengeCount} challenge${challengeCount === 1 ? '' : 's'}`;

  return (
    <section id="lesson-progress" className="mt-12 border border-hairline bg-cream-50 p-6" aria-label="Lesson progress">
      <div className="flex items-center justify-between">
        <Eyebrow>Track your progress</Eyebrow>
        {complete ? (
          <Pill tone="ok" dot>Complete</Pill>
        ) : (
          <Pill tone="dim">In progress</Pill>
        )}
      </div>

      <ul className="mt-4 space-y-2">
        <CheckRow
          label="Quiz completed"
          hint={quizHint}
          checked={quizDone}
          onToggle={() => setQuizDone(lesson.slug, !quizDone)}
        />
        {hasPractice && (
          <CheckRow
            label="Practice completed"
            hint={practiceHint}
            checked={practiceDone}
            onToggle={() => setPracticeDone(lesson.slug, !practiceDone)}
          />
        )}
      </ul>

      {touched && (
        <div className="mt-4 flex justify-end border-t border-hairline pt-3">
          <button
            type="button"
            onClick={() => resetLesson(lesson.slug)}
            className="inline-flex items-center gap-1.5 text-caption text-ink-400 hover:text-amber-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset lesson
          </button>
        </div>
      )}
    </section>
  );
}

function CheckRow({
  label,
  hint,
  checked,
  onToggle,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className={cn(
          'group flex w-full flex-wrap items-center gap-3 border bg-white px-4 py-3 text-left transition-colors',
          checked ? 'border-ok bg-ok-soft/40' : 'border-hairline hover:border-amber-400',
        )}
      >
        <span
          className={cn(
            'inline-flex h-5 w-5 shrink-0 items-center justify-center border',
            checked ? 'border-ok bg-ok text-white' : 'border-hairline bg-white text-transparent',
          )}
        >
          <Check className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 font-sans font-medium text-ink">{label}</span>
        <span className="ml-auto shrink-0 text-caption text-ink-400">{hint}</span>
      </button>
    </li>
  );
}
