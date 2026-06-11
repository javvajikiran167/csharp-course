import type { ReactNode } from 'react';

// Tiny inline markdown — author-controlled content only, no user input.
// Supports: **bold**, *italic*, `code`. No links, no images, no HTML.
//
// Behavior: splits the string into a flat array of strings and React elements.
// We tokenize one syntax at a time (code → bold → italic) so they nest cleanly
// without a real parser.
export function inline(text: string): ReactNode[] {
  // Tokens: `code`, **bold**, *italic*
  const result: ReactNode[] = [];
  let i = 0;
  let buf = '';
  const flush = () => {
    if (buf) {
      result.push(buf);
      buf = '';
    }
  };

  while (i < text.length) {
    const ch = text[i];
    const rest = text.slice(i);

    if (ch === '`') {
      const end = text.indexOf('`', i + 1);
      if (end > i) {
        flush();
        result.push(
          <code
            key={`c${result.length}`}
            className="rounded-sm bg-cream-200 border border-hairline px-1.5 py-0.5 font-mono text-[0.9em] text-amber-800"
          >
            {text.slice(i + 1, end)}
          </code>,
        );
        i = end + 1;
        continue;
      }
    }

    if (rest.startsWith('**')) {
      const end = text.indexOf('**', i + 2);
      if (end > i + 1) {
        flush();
        result.push(
          <strong key={`b${result.length}`} className="font-semibold text-ink">
            {text.slice(i + 2, end)}
          </strong>,
        );
        i = end + 2;
        continue;
      }
    }

    if (ch === '*') {
      const end = text.indexOf('*', i + 1);
      if (end > i) {
        flush();
        result.push(
          <em key={`i${result.length}`} className="italic">
            {text.slice(i + 1, end)}
          </em>,
        );
        i = end + 1;
        continue;
      }
    }

    buf += ch;
    i++;
  }

  flush();
  return result;
}
