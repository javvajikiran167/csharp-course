import type { ReactNode } from 'react';
import { Info, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const callout = cva(
  'flex gap-3 border-l-4 px-5 py-4 my-6',
  {
    variants: {
      tone: {
        note:    'bg-info-soft/40 border-info text-ink',
        tip:     'bg-amber-50 border-amber-600 text-ink',
        warn:    'bg-err-soft/40 border-err text-ink',
        success: 'bg-ok-soft/40 border-ok text-ink',
      },
    },
    defaultVariants: { tone: 'note' },
  },
);

const Icons = {
  note: Info,
  tip: Lightbulb,
  warn: AlertTriangle,
  success: CheckCircle2,
};

const iconColors = {
  note: 'text-info',
  tip: 'text-amber-700',
  warn: 'text-err',
  success: 'text-ok',
};

export type CalloutProps = VariantProps<typeof callout> & {
  title?: ReactNode;
  children: ReactNode;
};

export function Callout({ tone = 'note', title, children }: CalloutProps) {
  const Icon = Icons[tone ?? 'note'];
  return (
    <aside className={callout({ tone })}>
      <Icon className={cn('mt-1 h-5 w-5 shrink-0', iconColors[tone ?? 'note'])} aria-hidden />
      <div className="space-y-1.5 leading-relaxed">
        {title && <div className="font-semibold text-ink">{title}</div>}
        <div className="text-ink-600">{children}</div>
      </div>
    </aside>
  );
}
