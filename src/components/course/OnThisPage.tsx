import type { Block, Lesson } from '@/data/types';
import { slugify } from '@/lib/slug';
import { inline } from '@/lib/inline';
import { Eyebrow } from '@/components/primitives';

type Heading = Extract<Block, { kind: 'heading' }>;

// Compact in-page section nav for long lessons. Built from the level-2
// headings; the ids match what BlockRenderer assigns (explicit id or slug).
// Renders nothing for short lessons so it never clutters them.
const MIN_SECTIONS = 4;

export function OnThisPage({ lesson }: { lesson: Lesson }) {
  const headings = lesson.blocks.filter(
    (b): b is Heading => b.kind === 'heading' && b.level === 2,
  );
  if (headings.length < MIN_SECTIONS) return null;

  return (
    <nav
      aria-label="On this page"
      className="mt-8 border border-hairline bg-cream-50 px-5 py-4"
    >
      <Eyebrow>On this page</Eyebrow>
      <ul className="mt-3 space-y-1.5">
        {headings.map((h, i) => {
          const id = h.id ?? slugify(h.text);
          return (
            <li key={i} className="flex gap-2.5">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 bg-amber-600" aria-hidden />
              <a
                href={`#${id}`}
                className="text-caption text-ink-600 underline-offset-2 hover:text-amber-700 hover:underline"
              >
                {inline(h.text)}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
