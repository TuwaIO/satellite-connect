import { cn } from '@tuwaio/nova-core';
import { motion, Variants } from 'framer-motion';
import { type FC, type ReactNode } from 'react';

const MOTION_PATH_VARIANTS: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

interface StatusIconProps {
  txStatus: 'succeed' | 'failed' | 'replaced';
  colorVar: string;
  children: ReactNode;
}

export const StatusIcon: FC<StatusIconProps> = ({ txStatus, colorVar, children }) => (
  <motion.div
    key={txStatus}
    className={cn(
      'w-6 h-6 rounded-full flex items-center justify-center shadow-sm',
      `text-[var(--tuwa-${colorVar}-text)] bg-[var(--tuwa-bg-primary)]`,
    )}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <svg
      className="w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
    >
      <motion.path
        d={children as string}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        variants={MOTION_PATH_VARIANTS}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
      />
    </svg>
  </motion.div>
);
