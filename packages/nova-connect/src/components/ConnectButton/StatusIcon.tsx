import { cn } from '@tuwaio/nova-core';
import { motion, Variants } from 'framer-motion';
import { type FC, type ReactNode, useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

const MOTION_PATH_VARIANTS: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

interface StatusIconProps {
  txStatus: 'succeed' | 'failed' | 'replaced';
  colorVar: string;
  children: ReactNode;
  'aria-label'?: string;
  className?: string;
}

export const StatusIcon: FC<StatusIconProps> = ({
  txStatus,
  colorVar,
  children,
  'aria-label': ariaLabel,
  className,
}) => {
  const labels = useNovaConnectLabels();

  // Memoize the default aria-label based on status
  const defaultAriaLabel = useMemo(() => {
    switch (txStatus) {
      case 'succeed':
        return labels.successIcon;
      case 'failed':
        return labels.errorIcon;
      case 'replaced':
        return labels.replacedIcon;
      default:
        return labels.statusIcon;
    }
  }, [txStatus, labels]);

  // Memoize the final aria-label
  const finalAriaLabel = useMemo(() => {
    return ariaLabel || defaultAriaLabel;
  }, [ariaLabel, defaultAriaLabel]);

  // Memoize CSS classes for performance
  const containerClasses = useMemo(
    () =>
      cn(
        'w-6 h-6 rounded-full flex items-center justify-center shadow-sm',
        `text-[var(--tuwa-${colorVar}-text)] bg-[var(--tuwa-bg-primary)]`,
        className,
      ),
    [colorVar, className],
  );

  return (
    <motion.div
      key={txStatus}
      className={containerClasses}
      role="img"
      aria-label={finalAriaLabel}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1], // Better easing curve
      }}
    >
      <svg
        className="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true" // Hide SVG from screen readers since container has aria-label
        focusable="false" // Prevent SVG from receiving focus
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
            delay: 0.1, // Small delay for better visual hierarchy
          }}
        />
      </svg>
    </motion.div>
  );
};
