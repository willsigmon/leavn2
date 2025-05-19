import React from 'react';
import { Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CTAButton({
  children,
  variant = 'primary',
  size = 'base',
  icon: Icon,
  className,
  loading = false,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'base' | 'sm';
  icon?: LucideIcon;
  className?: string;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full font-medium transition focus-visible:ring-2',
    {
      'bg-[#2c4c3b] text-white hover:bg-[#223c2e] px-6 py-3': variant === 'primary',
      'bg-transparent text-[#2c4c3b] dark:text-[#a5c2a5] hover:bg-[#e8efe5]/40 dark:hover:bg-[#2c4c3b]/20 border border-[#d8e5d2] dark:border-[#2c4c3b] px-4 py-2': variant === 'ghost',
    },
    {
      'text-sm': size === 'base',
      'text-xs': size === 'sm',
    },
    loading ? 'opacity-70 cursor-not-allowed' : '',
    className
  );

  return (
    <button {...props} disabled={loading || props.disabled} className={classes}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="mr-2 h-4 w-4" />
      ) : null}
      {children}
    </button>
  );
}