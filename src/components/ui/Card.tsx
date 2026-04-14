import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Highlight the card with a coloured left border */
  accent?: 'brand' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
  selected?: boolean;
}

const accentClasses = {
  brand:   'border-l-4 border-l-brand-500',
  success: 'border-l-4 border-l-green-500',
  warning: 'border-l-4 border-l-amber-500',
  danger:  'border-l-4 border-l-red-500',
};

export function Card({ children, className = '', accent, onClick, selected }: CardProps) {
  const interactive = onClick != null;

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick?.() : undefined}
      className={[
        'rounded-xl bg-white shadow-sm border border-slate-200 p-6',
        accent ? accentClasses[accent] : '',
        interactive ? 'cursor-pointer transition-all duration-150 hover:shadow-md hover:border-brand-300' : '',
        selected ? 'ring-2 ring-brand-500 border-brand-300 bg-brand-50' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
