import { useState } from 'react';
import { Code2, ChevronDown, ChevronRight } from 'lucide-react';
import type { Challenge } from '@/data/types';
import { Eyebrow, Pill } from '@/components/primitives';
import { inline } from '@/lib/inline';
import { cn } from '@/lib/cn';

const diffPill = (d: Challenge['difficulty']) =>
  d === 'easy' ? 'ok' : d === 'medium' ? 'accent' : 'err';

export function ChallengeList({ challenges }: { challenges: Challenge[] }) {
  return (
    <section className="mt-12 border-t border-hairline pt-10">
      <Eyebrow>Practice on your own</Eyebrow>
      <h2 className="mt-2 font-serif font-semibold text-h1 text-ink">Take-home challenges</h2>
      <p className="mt-3 max-w-prose text-body text-ink-600">
        Solve these in your editor. They use only concepts from this lesson — no shortcuts, no surprise topics.
        Each one is what an interviewer might pose to check you actually understand the material.
      </p>
      <ol className="mt-6 divide-y divide-hairline border-y border-hairline">
        {challenges.map((c) => (
          <ChallengeItem key={c.id} challenge={c} />
        ))}
      </ol>
    </section>
  );
}

function ChallengeItem({ challenge }: { challenge: Challenge }) {
  const [open, setOpen] = useState(false);
  const hasHints = challenge.hints && challenge.hints.length > 0;
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'group flex w-full items-start gap-4 py-5 text-left transition-colors hover:bg-cream-200',
        )}
        aria-expanded={open}
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-hairline bg-white text-ink-400 group-hover:border-amber-400">
          <Code2 className="h-4 w-4" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <Pill tone={diffPill(challenge.difficulty)}>{challenge.difficulty}</Pill>
            <span className="font-sans font-semibold text-ink">{challenge.title}</span>
          </span>
          <span className="mt-1 block text-body text-ink-600 leading-relaxed pr-4">
            {inline(challenge.prompt)}
          </span>
        </span>
        {hasHints && (
          open ? (
            <ChevronDown className="mt-3 h-4 w-4 shrink-0 text-ink-400" />
          ) : (
            <ChevronRight className="mt-3 h-4 w-4 shrink-0 text-ink-400" />
          )
        )}
      </button>
      {open && hasHints && (
        <div className="ml-12 mr-2 pb-5">
          <Eyebrow>Hints</Eyebrow>
          <ul className="mt-2 space-y-1.5 text-caption text-ink-600">
            {challenge.hints!.map((hint, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-700">→</span>
                <span>{inline(hint)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
