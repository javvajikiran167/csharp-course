import type { ReactNode } from 'react';

// Tiny inline markdown — author-controlled content only, no user input.
// Supports: **bold**, *italic*, `code`, and [text](https://url) links.
// No images, no HTML. Only http(s) link targets are honored.
//
// Behavior: splits the string into a flat array of strings and React elements.
// We tokenize one syntax at a time (link → code → bold → italic) so they nest
// cleanly without a real parser.
export function inline(text: string): ReactNode[] {
  // Tokens: [text](url), `code`, **bold**, *italic*
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

    // [label](url) — only http(s) targets; anything else falls through as plain text.
    if (ch === '[') {
      const close = text.indexOf('](', i + 1);
      if (close > i) {
        const urlEnd = text.indexOf(')', close + 2);
        if (urlEnd > close) {
          const label = text.slice(i + 1, close);
          const url = text.slice(close + 2, urlEnd);
          if (/^https?:\/\//i.test(url)) {
            flush();
            result.push(
              <a
                key={`l${result.length}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-800 underline decoration-amber-300 underline-offset-2 hover:decoration-amber-600"
              >
                {label}
              </a>,
            );
            i = urlEnd + 1;
            continue;
          }
        }
      }
    }

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
            {inline(text.slice(i + 2, end))}
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
            {inline(text.slice(i + 1, end))}
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
