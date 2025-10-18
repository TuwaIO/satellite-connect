import { cn } from '@tuwaio/nova-core';
import { motion } from 'framer-motion';
import React, { memo, useMemo } from 'react';

import { isTouchDevice } from '../../utils';

interface RecentBadgeProps {
  className?: string;
  children?: React.ReactNode;
  animated?: boolean;
}

/**
 * Badge component with animated gradient border effect
 */
export const RecentBadge = memo<RecentBadgeProps>(({ className, children = 'Recent', animated = true }) => {
  const isTouch = useMemo(() => isTouchDevice(), []);

  // Memoize gradient to prevent recreating
  const gradientBackground = useMemo(
    () => `linear-gradient(90deg, 
      rgba(255, 255, 255, 0) 0%, 
      var(--tuwa-text-secondary) 20%, 
      rgba(255, 255, 255, 0) 40%
    )`,
    [],
  );

  const sizeClasses = isTouch ? 'px-1.5 py-0 text-[10px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium relative overflow-hidden',
        'text-[var(--tuwa-text-secondary)] border border-[var(--tuwa-border-primary)]',
        sizeClasses,
        className,
      )}
      role="status"
      aria-label={typeof children === 'string' ? children : 'Recent'}
    >
      {/* Animated gradient border */}
      <motion.span
        className="absolute inset-0 z-0 pointer-events-none rounded-full"
        style={{ background: gradientBackground, backgroundSize: '200% 100%' }}
        initial={{ backgroundPositionX: '100%' }}
        animate={animated ? { backgroundPositionX: '-100%' } : {}}
        transition={{
          duration: 4,
          ease: 'linear',
          repeat: animated ? Infinity : 0,
        }}
      />

      {/* Background overlay */}
      <span className="absolute z-10 pointer-events-none rounded-full bg-[var(--tuwa-bg-primary)] inset-[1px]" />

      {/* Content */}
      <span className="relative z-20 whitespace-nowrap">{children}</span>
    </span>
  );
});

RecentBadge.displayName = 'RecentBadge';
