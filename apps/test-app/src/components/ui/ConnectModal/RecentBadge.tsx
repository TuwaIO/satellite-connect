import { cn } from '@tuwaio/nova-core';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { isTouchDevice } from '@/components/ui/utils/isTouchDevice';

export function RecentBadge({ className }: { className?: string }) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  const gradientBackground = `linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--tuwa-text-secondary) 20%, rgba(255, 255, 255, 0) 40%)`;

  const touchClasses = ['px-1.5 py-0', 'text-[10px]'];
  const mouseClasses = ['px-2.5 py-0.5', 'text-xs'];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium text-[var(--tuwa-text-secondary)] border border-[var(--tuwa-border-primary)] relative overflow-hidden',
        isTouch ? touchClasses : mouseClasses,
        className,
      )}
    >
      <motion.span
        className="absolute inset-0 z-0 pointer-events-none rounded-full"
        style={{ background: gradientBackground, backgroundSize: '200% 100%' }}
        initial={{ backgroundPositionX: '100%' }}
        animate={{ backgroundPositionX: '-100%' }}
        transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
      />
      <span className="absolute z-10 pointer-events-none rounded-full bg-[var(--tuwa-bg-primary)] inset-[1px]" />
      <span className="relative z-20">Recent</span>
    </span>
  );
}
