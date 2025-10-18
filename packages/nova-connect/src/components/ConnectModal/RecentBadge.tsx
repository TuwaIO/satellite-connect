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

  const sizeClasses = isTouch
    ? 'novacon:px-1.5 novacon:py-0 novacon:text-[10px]'
    : 'novacon:px-2.5 novacon:py-0.5 novacon:text-xs';

  return (
    <span
      className={cn(
        'novacon:inline-flex novacon:items-center novacon:rounded-full novacon:font-medium novacon:relative novacon:overflow-hidden',
        'novacon:text-[var(--tuwa-text-secondary)] novacon:border novacon:border-[var(--tuwa-border-primary)]',
        sizeClasses,
        className,
      )}
      role="status"
      aria-label={typeof children === 'string' ? children : 'Recent'}
    >
      {/* Animated gradient border */}
      <motion.span
        className="novacon:absolute novacon:inset-0 novacon:z-0 novacon:pointer-events-none novacon:rounded-full"
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
      <span className="novacon:absolute novacon:z-10 novacon:pointer-events-none novacon:rounded-full novacon:bg-[var(--tuwa-bg-primary)] novacon:inset-[1px]" />

      {/* Content */}
      <span className="novacon:relative novacon:z-20 novacon:whitespace-nowrap">{children}</span>
    </span>
  );
});

RecentBadge.displayName = 'RecentBadge';
