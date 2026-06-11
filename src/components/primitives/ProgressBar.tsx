import { cn } from '@/lib/cn';

export type ProgressBarProps = {
  value: number;
  max?: number;
  thin?: boolean;
  className?: string;
  label?: string;
};

export function ProgressBar({ value, max = 100, thin, className, label }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          'w-full bg-cream-300 overflow-hidden',
          thin ? 'h-1' : 'h-1.5',
        )}
      >
        <div
          className="h-full bg-amber-600 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
