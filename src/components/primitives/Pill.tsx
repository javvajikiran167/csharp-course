import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const pill = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 text-eyebrow font-semibold uppercase border',
  {
    variants: {
      tone: {
        accent:  'bg-amber-50 text-amber-800 border-amber-200',
        ok:      'bg-ok-soft text-ok-text border-ok',
        err:     'bg-err-soft text-err-text border-err',
        info:    'bg-info-soft text-info-text border-info',
        neutral: 'bg-white text-ink-600 border-hairline',
        dim:     'bg-transparent text-ink-400 border-hairline',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export type PillProps = VariantProps<typeof pill> & {
  children: ReactNode;
  className?: string;
  dot?: boolean;
  pulse?: boolean;
};

export function Pill({ tone, dot, pulse, className, children }: PillProps) {
  return (
    <span className={cn(pill({ tone }), className)}>
      {dot && (
        <span
          className={cn(
            'inline-block h-1.5 w-1.5',
            tone === 'ok' && 'bg-ok',
            tone === 'err' && 'bg-err',
            tone === 'info' && 'bg-info',
            (!tone || tone === 'accent' || tone === 'neutral' || tone === 'dim') && 'bg-amber-600',
            pulse && 'animate-pulse',
          )}
        />
      )}
      {children}
    </span>
  );
}
