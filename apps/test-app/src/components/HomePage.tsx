'use client';

import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { TransactionsBlockRainbowKit } from '@/components/evm/TransactionsBlock';
import { TransactionsBlockSolana } from '@/components/solana/TransactionsBlock';

export default function HomePage() {
  const disconnect = useSatelliteConnectStore((store) => store.disconnect);

  const [activeAdapter, setActiveAdapter] = useState<OrbitAdapter>(OrbitAdapter.SOLANA);
  const [direction, setDirection] = useState(1);

  const toggleAdapter = () => {
    if (activeAdapter === OrbitAdapter.EVM) {
      setDirection(1);
      disconnect();
      setActiveAdapter(OrbitAdapter.SOLANA);
    } else {
      setDirection(1);
      disconnect();
      setActiveAdapter(OrbitAdapter.EVM);
    }
  };

  const ToggleButton = () => {
    return (
      <button
        className="absolute top-1 right-1 bg-white cursor-pointer p-2.5 rounded-full border border-transparent font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 z-10"
        onClick={toggleAdapter}
      >
        <ArrowsRightLeftIcon className="w-6 h-6" aria-hidden="true" />
      </button>
    );
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full flex justify-center items-center bg-gradient-to-br from-[var(--tuwa-bg-secondary)] to-[var(--tuwa-bg-muted)] gap-4 relative min-h-[100dvh]">
      <AnimatePresence mode="wait" custom={direction}>
        {activeAdapter === OrbitAdapter.SOLANA ? (
          <motion.div
            key="solana-block"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            custom={direction}
          >
            <TransactionsBlockSolana toggleButton={<ToggleButton />} />
          </motion.div>
        ) : (
          <motion.div
            key="evm-block"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            custom={direction}
          >
            <TransactionsBlockRainbowKit toggleButton={<ToggleButton />} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
