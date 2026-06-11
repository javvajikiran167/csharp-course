import { useState, type ReactNode } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

export function InlineCode({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <code className={cn('rounded-sm bg-cream-200 border border-hairline px-1.5 py-0.5 font-mono text-[0.9em] text-amber-800', className)}>
      {children}
    </code>
  );
}

export type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
};

export function CodeBlock({ code, language = 'csharp', filename, showCopy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard might be unavailable in some contexts */
    }
  };

  return (
    <div className="my-6 border border-code-border bg-code-bg overflow-hidden">
      {(filename || showCopy) && (
        <div className="flex items-center justify-between bg-code-header border-b border-code-border px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-[#FF5F57]" />
            <span className="inline-block h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <span className="inline-block h-3 w-3 rounded-full bg-[#28C840]" />
            {filename && (
              <span className="ml-3 font-mono text-caption text-code-dim">{filename}</span>
            )}
          </div>
          {showCopy && (
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 border border-code-border px-2 py-1 text-eyebrow font-semibold uppercase text-code-dim hover:text-amber-300 hover:border-amber-300 transition-colors"
              aria-label={copied ? 'Code copied' : 'Copy code'}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={false}
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: '16px 18px',
          background: 'transparent',
          fontSize: '13.5px',
          lineHeight: '1.7',
        }}
        codeTagProps={{ style: { fontFamily: 'JetBrains Mono, ui-monospace, monospace' } }}
      >
        {code.replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

export type OutputBlockProps = {
  output?: string;
  lines?: Array<string | { text: string; dim?: boolean }>;
  label?: string;
};

export function OutputBlock({ output, lines, label = '▶ OUTPUT' }: OutputBlockProps) {
  const items = lines ?? (output ? output.split('\n').map((t) => ({ text: t, dim: false })) : []);
  return (
    <div className="my-6 border border-code-border bg-code-bg border-l-4 border-l-ok p-4">
      <div className="text-eyebrow font-semibold uppercase text-ok mb-2">{label}</div>
      <pre className="m-0 font-mono text-code leading-relaxed whitespace-pre-wrap break-words">
        {items.map((item, i) => {
          const isObj = typeof item !== 'string';
          const text = isObj ? item.text : item;
          const dim = isObj ? item.dim : false;
          return (
            <div key={i} className={cn(dim ? 'text-code-dim' : 'text-code-text')}>
              {text}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
