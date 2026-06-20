import { CheckCircle2 } from 'lucide-react';
import type { Block } from '@/data/types';
import { inline } from '@/lib/inline';
import { slugify } from '@/lib/slug';
import { H2, H3, Lead, Callout, Card, CodeBlock, OutputBlock } from '@/components/primitives';
import { Pill } from '@/components/primitives';
import { TeachingNotes } from './TeachingNotes';
import { usePrefs } from '@/store/prefs';
import { useAuth } from '@/store/auth';

// All blocks fill the parent container's width. The lesson page enforces
// a single max-width on the article, so nothing here needs its own.
export function BlockRenderer({ block }: { block: Block }) {
  const teacherMode = usePrefs((s) => s.teacherMode);
  const isAdmin = useAuth((s) => s.isAdmin);

  // teachingNotes are instructor-facing — shown only to an instructor who has
  // Teacher Mode on. The isAdmin check means a student can never see them, even
  // if Teacher Mode was left on in their browser before this gate existed.
  if (block.kind === 'teachingNotes' && !(teacherMode && isAdmin)) return null;

  switch (block.kind) {
    case 'lead':
      return <Lead className="!max-w-none my-6">{inline(block.text)}</Lead>;

    case 'paragraph':
      return (
        <p className="my-5 text-body text-ink-600 leading-relaxed">
          {inline(block.text)}
        </p>
      );

    case 'heading':
      return block.level === 2 ? (
        // Auto-id level-2 headings (when no explicit id) so the "On this page"
        // nav has a stable anchor target for every section.
        <H2 id={block.id ?? slugify(block.text)}>{inline(block.text)}</H2>
      ) : (
        <H3>{inline(block.text)}</H3>
      );

    case 'list':
      return block.ordered ? (
        <ol className="my-5 pl-6 list-decimal space-y-2.5 text-body text-ink-600 marker:text-ink-400">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {inline(item)}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="my-5 pl-6 list-disc space-y-2.5 text-body text-ink-600 marker:text-amber-600">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {inline(item)}
            </li>
          ))}
        </ul>
      );

    case 'code':
      return <CodeBlock code={block.code} language={block.language} filename={block.filename} />;

    case 'output':
      return <OutputBlock output={block.output} lines={block.lines} label={block.label} />;

    case 'callout':
      return (
        <Callout tone={block.tone} title={block.title ? inline(block.title) : undefined}>
          {inline(block.text)}
        </Callout>
      );

    case 'twoColumn':
      return (
        <div className="my-8 grid gap-4 sm:grid-cols-2">
          {block.cards.map((c, i) => (
            <Card key={i} padded="md" accent>
              <div className="flex items-center gap-2 mb-3">
                <Pill tone="accent">{`0${i + 1}`.slice(-2)}</Pill>
                <h3 className="font-sans font-semibold text-h3 text-ink">{inline(c.title)}</h3>
              </div>
              <ul className="space-y-2 text-body text-ink-600 leading-relaxed">
                {c.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 bg-amber-600" aria-hidden />
                    <span>{inline(it)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      );

    case 'teachingNotes':
      return <TeachingNotes items={block.items} />;

    case 'keyTakeaways':
      return (
        <section className="mt-10 border border-ok bg-ok-soft/60 px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-ok" />
            <span className="text-eyebrow font-bold uppercase text-ok-text">
              Key takeaways
            </span>
          </div>
          <ul className="space-y-2 text-body text-ink leading-relaxed">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-2.5 inline-block h-1 w-1 shrink-0 bg-ok" aria-hidden />
                <span>{inline(item)}</span>
              </li>
            ))}
          </ul>
        </section>
      );

    case 'examples':
      return (
        <div className="my-8">
          {block.intro && (
            <p className="text-body text-ink-600 leading-relaxed mb-4">
              {inline(block.intro)}
            </p>
          )}
          <div className="grid gap-4">
            {block.examples.map((ex, i) => (
              <div key={i} className="border border-hairline bg-white">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-hairline bg-cream-200">
                  <Pill tone="dim">Ex {`0${i + 1}`.slice(-2)}</Pill>
                  <span className="text-caption text-ink font-medium">{inline(ex.label)}</span>
                </div>
                <div className="px-1">
                  <CodeBlock code={ex.code} />
                </div>
                {ex.output !== undefined && <OutputBlock output={ex.output} />}
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
