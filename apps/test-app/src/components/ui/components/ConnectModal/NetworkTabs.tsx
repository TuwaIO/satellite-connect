import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { GlobeAltIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import React from 'react';

import { getNetworkIcon } from '../../utils/getNetworIcon';

interface NetworkTabsProps {
  networks: OrbitAdapter[];
  selectedAdapter: OrbitAdapter | undefined;
  onSelect: (adapter: OrbitAdapter | undefined) => void;
}

const textVariant: Variants = {
  active: {
    opacity: 1,
    zIndex: 2,
    x: 0,
    position: 'relative',
    transition: {
      duration: 0.2,
    },
  },
  inactive: {
    opacity: 0,
    zIndex: -1,
    x: -10,
    position: 'absolute',
    transition: {
      duration: 0.2,
    },
  },
};

export function NetworkTabs({ networks, selectedAdapter, onSelect }: NetworkTabsProps) {
  if (networks.length <= 1) return null;

  const localNetworks = [undefined, ...networks];

  return (
    <motion.div
      layout
      transition={{
        layout: {
          duration: 0.6,
          ease: [0.1, 0.1, 0.2, 1],
        },
      }}
    >
      <motion.div
        layout
        transition={{
          layout: {
            duration: 0.0001,
          },
        }}
      >
        <div className="flex overflow-x-auto gap-2 pb-2 mb-2 border-b border-[var(--tuwa-border-primary)] relative">
          {localNetworks.map((network, index) => (
            <motion.div
              key={`${network}_${index}`}
              className="relative group"
              layout
              transition={{
                layout: {
                  duration: 0.6,
                  ease: [0.1, 0.1, 0.2, 1],
                },
              }}
            >
              <motion.div
                layout
                transition={{
                  layout: {
                    duration: 0.0001,
                  },
                }}
              >
                <button
                  type="button"
                  onClick={() => onSelect(network)}
                  title={network ? getNetworkIcon(network)?.name : 'All'}
                  className={cn(
                    'cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg transition-colors overflow-hidden relative z-4',
                    'hover:bg-[var(--tuwa-bg-muted)]',
                    selectedAdapter === network
                      ? 'bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-accent)]'
                      : 'text-[var(--tuwa-text-secondary)]',
                  )}
                >
                  {network ? (
                    <div className="w-6 h-6 [&>img]:w-full [&>img]:h-full">
                      <Web3Icon chainId={getNetworkIcon(network)?.chainId} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 [&>img]:w-full [&>img]:h-full rounded-full bg-[var(--tuwa-bg-primary)]">
                      <GlobeAltIcon />
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    <motion.span
                      variants={textVariant}
                      className="block"
                      animate={selectedAdapter === network ? 'active' : 'inactive'}
                    >
                      {network ? getNetworkIcon(network)?.name : 'All'}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </motion.div>

              {selectedAdapter === network && (
                <motion.div
                  layoutId="indicator"
                  className="absolute inset-0 bg-[var(--tuwa-bg-muted)] z-3 rounded-lg"
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
