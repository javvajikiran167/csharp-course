import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-caption text-ink-400', className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={`${item.label}-${i}`}>
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-amber-700 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-ink-600 font-medium' : ''}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-ink-400" aria-hidden />}
          </Fragment>
        );
      })}
    </nav>
  );
}
