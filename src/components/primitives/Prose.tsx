import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Prose({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        'max-w-prose text-body leading-relaxed text-ink-600',
        '[&_p]:my-4 [&_p]:first:mt-0 [&_p]:last:mb-0',
        '[&_strong]:font-semibold [&_strong]:text-ink',
        '[&_em]:italic',
        '[&_ul]:my-4 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1.5',
        '[&_ol]:my-4 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1.5',
        '[&_li]:pl-1',
        '[&_code]:rounded-sm [&_code]:bg-cream-200 [&_code]:border [&_code]:border-hairline [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-amber-800',
        '[&_a]:text-amber-700 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-amber-800',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'text-eyebrow font-bold uppercase text-amber-700',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function H1({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={cn('font-serif font-semibold text-h1 text-ink', className)}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('font-sans font-semibold text-h2 text-ink mt-12 mb-4 scroll-mt-24', className)}>
      {children}
    </h2>
  );
}

export function H3({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('font-sans font-semibold text-h3 text-ink mt-8 mb-2', className)}>
      {children}
    </h3>
  );
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-[1.125rem] leading-relaxed text-ink-600 max-w-prose', className)}>
      {children}
    </p>
  );
}

export function Display({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={cn('font-serif font-semibold text-display text-ink', className)}>
      {children}
    </h1>
  );
}
