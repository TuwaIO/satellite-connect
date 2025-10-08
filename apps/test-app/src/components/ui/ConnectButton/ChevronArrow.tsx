import { cn } from '@tuwaio/nova-core';
import { motion } from 'framer-motion';

export function ChevronArrow({ className, isOpen }: { className?: string; isOpen?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn('w-4 h-4 text-[var(--tuwa-text-secondary)]', className)}
    >
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        animate={{ d: isOpen ? 'm4.5 15.75 7.5-7.5 7.5 7.5' : 'm19.5 8.25-7.5 7.5-7.5-7.5' }}
        transition={{ duration: 0.2, ease: [0.4, 0.4, 0.4, 1] }}
      />
    </svg>
  );
}
