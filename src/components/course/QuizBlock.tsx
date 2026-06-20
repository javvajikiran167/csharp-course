import { useMemo, useState } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import { Button, Pill, Eyebrow } from '@/components/primitives';
import { CodeBlock } from '@/components/primitives/Code';
import { QUIZ_PASS_PCT } from '@/lib/completion';
import { inline } from '@/lib/inline';
import { cn } from '@/lib/cn';
import type {
  Question,
  MultipleChoiceQuestion,
  CodePredictQuestion,
  FillBlankQuestion,
} from './quiz-types';

type Props = {
  questions: Question[];
  // Called once, when the learner finishes the run, with their score.
  onFinish?: (score: number, total: number) => void;
};

// A self-contained quiz runner. Presentational: it owns the index/score/phase
// of one run and reports the result via onFinish; persistence is the caller's
// job. Used by the per-topic Quiz page (and reusable anywhere).
export function Quiz({ questions, onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'asking' | 'done'>('asking');

  const total = questions.length;
  const current = questions[index];

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      setPhase('done');
      onFinish?.(score, total);
    }
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setPhase('asking');
  };

  if (total === 0) {
    return (
      <p className="text-body text-ink-600">This topic's quiz is coming soon.</p>
    );
  }

  if (phase === 'done') {
    const pct = Math.round((score / total) * 100);
    const passing = pct >= QUIZ_PASS_PCT;
    return (
      <section className="border border-hairline bg-white p-5 sm:p-8" id="quiz-result">
        <Eyebrow>Quiz complete</Eyebrow>
        <h3 className="mt-2 font-serif font-semibold text-h1 text-ink">
          {passing ? 'Nice work — you passed.' : 'Solid try.'}
        </h3>
        <p className="mt-3 text-body text-ink-600">
          You scored <strong className="font-semibold text-ink">{score}/{total}</strong> ({pct}%).
          {passing
            ? ` ${QUIZ_PASS_PCT}% or above counts as a pass — this topic's quiz is marked complete.`
            : ` You need ${QUIZ_PASS_PCT}% to pass. Re-read the lessons and retry whenever you like.`}
        </p>
        <div className="mt-6 flex gap-3">
          <Button tone="secondary" onClick={restart}>
            <RotateCcw className="h-4 w-4" />
            Retry quiz
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-hairline bg-white p-5 sm:p-8" id="quiz">
      <div className="flex items-center justify-between">
        <Eyebrow>Question</Eyebrow>
        <Pill tone="dim">{index + 1} / {total}</Pill>
      </div>
      <h3 className="mt-2 font-serif font-semibold text-h2 text-ink">{inline(current.prompt)}</h3>

      {/*
        key={current.id} is critical — it forces React to remount the
        child on every new question so its internal pick/revealed state
        resets. Without it, the previous answer persists as selected.
      */}
      <div className="mt-6">
        {current.kind === 'mcq' && (
          <MultipleChoice key={current.id} q={current} onAnswer={handleAnswer} onNext={handleNext} />
        )}
        {current.kind === 'predict' && (
          <CodePredict key={current.id} q={current} onAnswer={handleAnswer} onNext={handleNext} />
        )}
        {current.kind === 'fill' && (
          <FillBlank key={current.id} q={current} onAnswer={handleAnswer} onNext={handleNext} />
        )}
      </div>
    </section>
  );
}

/* ── MCQ ─────────────────────────────────────────────────── */

function MultipleChoice({
  q,
  onAnswer,
  onNext,
}: { q: MultipleChoiceQuestion; onAnswer: (c: boolean) => void; onNext: () => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctIdx = useMemo(() => q.options.findIndex((o) => o.correct), [q]);

  const submit = () => {
    if (pick === null) return;
    setRevealed(true);
    onAnswer(pick === correctIdx);
  };

  return (
    <div>
      <ul className="space-y-2" role="radiogroup" aria-label="Answer options">
        {q.options.map((opt, i) => {
          const isCorrect = i === correctIdx;
          const picked = pick === i;
          let visualState = 'border-hairline hover:border-amber-400';
          if (revealed) {
            if (isCorrect) visualState = 'border-ok bg-ok-soft';
            else if (picked) visualState = 'border-err bg-err-soft';
            else visualState = 'border-hairline opacity-60';
          } else if (picked) {
            visualState = 'border-amber-600 bg-amber-50';
          }
          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealed}
                role="radio"
                aria-checked={picked}
                onClick={() => setPick(i)}
                className={cn(
                  'w-full min-w-0 text-left flex items-center gap-3 px-4 py-3 border bg-white transition-colors',
                  visualState,
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-6 w-6 items-center justify-center border text-eyebrow font-bold',
                    revealed && isCorrect && 'bg-ok text-white border-ok',
                    revealed && !isCorrect && picked && 'bg-err text-white border-err',
                    !revealed && 'border-hairline text-ink-400',
                    !revealed && picked && 'border-amber-600 text-amber-700',
                  )}
                >
                  {revealed && isCorrect ? <Check className="h-4 w-4" /> :
                   revealed && picked && !isCorrect ? <X className="h-4 w-4" /> :
                   String.fromCharCode(65 + i)}
                </span>
                <span className="min-w-0 break-words text-body text-ink">{inline(opt.label)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <Reveal revealed={revealed} explanation={q.explanation} onSubmit={submit} onNext={onNext} canSubmit={pick !== null} correct={revealed ? pick === correctIdx : undefined} />
    </div>
  );
}

/* ── Code prediction ─────────────────────────────────────── */

function CodePredict({
  q,
  onAnswer,
  onNext,
}: { q: CodePredictQuestion; onAnswer: (c: boolean) => void; onNext: () => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctIdx = useMemo(() => q.options.findIndex((o) => o.correct), [q]);

  const submit = () => {
    if (pick === null) return;
    setRevealed(true);
    onAnswer(pick === correctIdx);
  };

  return (
    <div>
      <CodeBlock code={q.code} language="csharp" filename="Program.cs" showCopy={false} />
      <p className="text-body text-ink-600">Predict the output:</p>
      <ul className="mt-3 space-y-2" role="radiogroup" aria-label="Answer options">
        {q.options.map((opt, i) => {
          const isCorrect = i === correctIdx;
          const picked = pick === i;
          let style = 'border-hairline hover:border-amber-400';
          if (revealed) {
            if (isCorrect) style = 'border-ok bg-ok-soft';
            else if (picked) style = 'border-err bg-err-soft';
            else style = 'border-hairline opacity-60';
          } else if (picked) {
            style = 'border-amber-600 bg-amber-50';
          }
          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealed}
                role="radio"
                aria-checked={picked}
                onClick={() => setPick(i)}
                className={cn(
                  'w-full min-w-0 text-left flex items-center gap-3 px-4 py-3 border bg-white font-mono text-code transition-colors',
                  style,
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-6 w-6 items-center justify-center border text-eyebrow font-bold font-sans',
                    revealed && isCorrect && 'bg-ok text-white border-ok',
                    revealed && !isCorrect && picked && 'bg-err text-white border-err',
                    !revealed && 'border-hairline text-ink-400',
                    !revealed && picked && 'border-amber-600 text-amber-700',
                  )}
                >
                  {revealed && isCorrect ? <Check className="h-4 w-4" /> :
                   revealed && picked && !isCorrect ? <X className="h-4 w-4" /> :
                   String.fromCharCode(65 + i)}
                </span>
                <span className="min-w-0 whitespace-pre-wrap break-words">{inline(opt.label)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <Reveal revealed={revealed} explanation={q.explanation} onSubmit={submit} onNext={onNext} canSubmit={pick !== null} correct={revealed ? pick === correctIdx : undefined} />
    </div>
  );
}

/* ── Fill in the blank ───────────────────────────────────── */

function FillBlank({
  q,
  onAnswer,
  onNext,
}: { q: FillBlankQuestion; onAnswer: (c: boolean) => void; onNext: () => void }) {
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const accepted = q.accept.map((a) => a.trim().toLowerCase());
  const isCorrect = accepted.includes(value.trim().toLowerCase());

  const submit = () => {
    if (!value.trim()) return;
    setRevealed(true);
    onAnswer(isCorrect);
  };

  const [before, after] = q.template.split('___');

  return (
    <div>
      <div className="bg-code-bg border border-code-border p-4 font-mono text-code text-code-text whitespace-pre-wrap">
        {before}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={revealed}
          placeholder="?"
          className={cn(
            'inline-block w-32 bg-transparent border-b border-amber-400 text-amber-300 outline-none focus:border-amber-300 px-1 font-mono',
            revealed && isCorrect && 'border-ok text-ok',
            revealed && !isCorrect && 'border-err text-err',
          )}
          aria-label="Fill in the blank"
        />
        {after}
      </div>
      <Reveal
        revealed={revealed}
        explanation={
          revealed && !isCorrect
            ? `Accepted: ${q.accept.join(', ')}. ${q.explanation}`
            : q.explanation
        }
        onSubmit={submit}
        onNext={onNext}
        canSubmit={value.trim().length > 0}
      />
    </div>
  );
}

/* ── Reveal panel (shared) ───────────────────────────────── */

function Reveal({
  revealed,
  explanation,
  onSubmit,
  onNext,
  canSubmit,
  correct,
}: {
  revealed: boolean;
  explanation: string;
  onSubmit: () => void;
  onNext: () => void;
  canSubmit: boolean;
  correct?: boolean;
}) {
  if (!revealed) {
    return (
      <div className="mt-5">
        <Button tone="primary" onClick={onSubmit} disabled={!canSubmit}>
          Check answer
        </Button>
      </div>
    );
  }
  return (
    <div className="mt-5 border-l-2 border-amber-600 bg-amber-50 px-4 py-3" role="status" aria-live="polite">
      {typeof correct === 'boolean' && (
        <p className="font-semibold text-ink">{correct ? 'Correct' : 'Not quite'}</p>
      )}
      <Eyebrow>Why</Eyebrow>
      <p className="mt-1 text-body text-ink-600">{inline(explanation)}</p>
      <div className="mt-4">
        <Button tone="primary" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
