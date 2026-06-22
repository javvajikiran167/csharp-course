import { useState } from 'react';
import { Hammer, ChevronDown, ChevronRight, Target, Rocket } from 'lucide-react';
import type { Project } from '@/data/types';
import { Eyebrow, Pill } from '@/components/primitives';
import { inline } from '@/lib/inline';

const diffPill = (d: Project['difficulty']) =>
  d === 'starter' ? 'ok' : d === 'intermediate' ? 'accent' : 'err';

// Larger builds shown under the practice problems. Each expands to reveal the
// full spec (requirements + stretch goals) so the list stays scannable.
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <section className="mt-14 border-t border-hairline pt-10">
      <Eyebrow>Build something real</Eyebrow>
      <h2 className="mt-2 font-serif font-semibold text-h1 text-ink">Projects</h2>
      <p className="mt-3 max-w-prose text-body text-ink-600">
        Two larger builds that pull this topic's ideas together. Treat the
        requirements as a spec — the kind a teammate or interviewer would hand you —
        and ship something you could actually demo.
      </p>
      <ol className="mt-6 space-y-4">
        {projects.map((p) => (
          <ProjectItem key={p.id} project={p} />
        ))}
      </ol>
    </section>
  );
}

function ProjectItem({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border border-hairline bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-cream-200"
        aria-expanded={open}
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-hairline bg-cream-50 text-amber-700 group-hover:border-amber-400">
          <Hammer className="h-4 w-4" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <Pill tone={diffPill(project.difficulty)}>{project.difficulty}</Pill>
            <span className="font-sans font-semibold text-h3 text-ink">{project.title}</span>
          </span>
          <span className="mt-1.5 block text-body text-ink-600 leading-relaxed pr-4">
            {inline(project.brief)}
          </span>
        </span>
        {open ? (
          <ChevronDown className="mt-2 h-4 w-4 shrink-0 text-ink-400" />
        ) : (
          <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-ink-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-hairline px-5 py-5">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-700" />
            <Eyebrow>Requirements</Eyebrow>
          </div>
          <ul className="mt-2 space-y-2 text-body text-ink-600 leading-relaxed">
            {project.requirements.map((r, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-2 inline-block h-1 w-1 shrink-0 bg-amber-600" aria-hidden />
                <span>{inline(r)}</span>
              </li>
            ))}
          </ul>

          {project.stretch && project.stretch.length > 0 && (
            <>
              <div className="mt-5 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-amber-700" />
                <Eyebrow>Stretch goals</Eyebrow>
              </div>
              <ul className="mt-2 space-y-2 text-body text-ink-600 leading-relaxed">
                {project.stretch.map((s, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 bg-ink-400" aria-hidden />
                    <span>{inline(s)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {project.concepts && project.concepts.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              <span className="text-eyebrow text-ink-400 mr-1">Exercises:</span>
              {project.concepts.map((c, i) => (
                <Pill key={i} tone="dim">{c}</Pill>
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
