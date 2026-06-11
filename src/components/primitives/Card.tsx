import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const card = cva(
  'relative bg-white border border-hairline transition-shadow',
  {
    variants: {
      interactive: {
        true: 'hover:shadow-cardHover hover:border-amber-300 cursor-pointer',
        false: 'shadow-card',
      },
      padded: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        none: '',
      },
      accent: {
        true: 'before:absolute before:top-0 before:left-0 before:h-1 before:w-12 before:bg-amber-600',
        false: '',
      },
    },
    defaultVariants: {
      interactive: false,
      padded: 'md',
      accent: false,
    },
  },
);

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof card> & { children: ReactNode };

export function Card({ className, interactive, padded, accent, children, ...props }: CardProps) {
  return (
    <div className={cn(card({ interactive, padded, accent }), className)} {...props}>
      {children}
    </div>
  );
}
