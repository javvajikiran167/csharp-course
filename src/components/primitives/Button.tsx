import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const button = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600',
  {
    variants: {
      tone: {
        primary:   'bg-amber-700 text-white hover:bg-amber-800 active:bg-amber-900',
        secondary: 'bg-white text-ink border border-ink hover:bg-cream-200',
        ghost:     'bg-transparent text-ink-600 hover:text-ink hover:bg-cream-200',
        danger:    'bg-err text-white hover:bg-err-text',
      },
      size: {
        sm: 'h-8 px-3 text-caption',
        md: 'h-10 px-4 text-body',
        lg: 'h-12 px-6 text-body',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      tone: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    children: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, tone, size, block, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(button({ tone, size, block }), className)}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
