import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion, Variants } from 'framer-motion';
import React, { useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

const PATH_ANIMATION_VARIANTS: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

export function WaitForConnectionContent() {
  const labels = useNovaConnectLabels();
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);

  // Memoize connection status check for better performance
  const isConnected = useMemo(() => Boolean(activeWallet?.isConnected), [activeWallet?.isConnected]);

  // Don't render if wallet is already connected
  if (isConnected) return null;

  return (
    <div className="flex items-center gap-2" role="img" aria-label={labels.connectWallet}>
      {/* Wallet Icon */}
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <motion.path
          d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          variants={PATH_ANIMATION_VARIANTS}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            delay: 0.1,
          }}
        />
      </svg>

      {/* Connect Wallet Text */}
      <span
        className="font-medium"
        role="text"
        aria-hidden="true" // Hide from screen readers since parent has aria-label
      >
        {labels.connectWallet}
      </span>
    </div>
  );
}
