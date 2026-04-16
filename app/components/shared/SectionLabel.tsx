import type {ReactNode} from 'react';

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({children, className = ''}: SectionLabelProps) {
  return (
    <span
      className={`text-gold-deep text-[11px] uppercase tracking-[4px] font-semibold font-body ${className}`.trim()}
    >
      {children}
    </span>
  );
}
