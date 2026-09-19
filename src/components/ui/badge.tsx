import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium tracking-[0.02em] text-text-primary',
  {
    variants: {
      variant: {
        default: 'bg-white/5',
        accent: 'bg-gradient-to-r from-accent-1/15 to-accent-2/15 text-white border-transparent',
        success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
