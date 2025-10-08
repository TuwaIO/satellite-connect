import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';

export function WaitForConnectionContent() {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  if (activeWallet?.isConnected) return null;
  return (
    <>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <motion.path
          d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
        />
      </svg>

      <span>Connect Wallet</span>
    </>
  );
}
