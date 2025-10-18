import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { GlobeAltIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import React from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { getNetworkIcon } from '../../utils';

/**
 * Props for the NetworkTabs component
 */
interface NetworkTabsProps {
  /** Array of available network adapters */
  networks: OrbitAdapter[];
  /** Currently selected network adapter (undefined means "All" is selected) */
  selectedAdapter: OrbitAdapter | undefined;
  /** Handler for network selection changes */
  onSelect: (adapter: OrbitAdapter | undefined) => void;
}

/**
 * Animation variants for tab text transitions
 */
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

/**
 * NetworkTabs component - Animated tab navigation for network selection
 *
 * This component provides an animated tab interface for selecting blockchain networks:
 * - Animated tab transitions with smooth layouts
 * - Visual network icons with Web3Icon integration
 * - "All networks" option for viewing all connectors
 * - Responsive horizontal scrolling for mobile devices
 * - Full accessibility support with keyboard navigation
 * - Motion-based UI feedback for better user experience
 *
 * Key features:
 * - Framer Motion powered animations with layout transitions
 * - Dynamic tab indicator that smoothly moves between selections
 * - Network icons with proper fallbacks and sizing
 * - Conditional rendering - hidden when only one network available
 * - Touch-friendly interface with horizontal scrolling
 *
 * Animation system:
 * - Layout animations for smooth tab movement
 * - Text fade transitions when switching between tabs
 * - Morphing background indicator following active selection
 * - Optimized animation durations for natural feel
 *
 * Accessibility features:
 * - Proper button semantics with ARIA labels
 * - Keyboard navigation support (Space, Enter)
 * - Screen reader friendly tab descriptions
 * - Focus management with visible focus indicators
 * - Meaningful tooltips for each network option
 *
 * @param networks - Array of available network adapters to display as tabs
 * @param selectedAdapter - Currently active network (undefined for "All")
 * @param onSelect - Callback function when user selects a different network
 * @returns JSX element representing animated network tabs, or null if ≤1 networks
 *
 * @example
 * ```tsx
 * <NetworkTabs
 *   networks={[OrbitAdapter.EVM, OrbitAdapter.SOLANA]}
 *   selectedAdapter={OrbitAdapter.EVM}
 *   onSelect={(adapter) => handleNetworkChange(adapter)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Single network scenario - component renders nothing
 * <NetworkTabs
 *   networks={[OrbitAdapter.EVM]}
 *   selectedAdapter={OrbitAdapter.EVM}
 *   onSelect={(adapter) => setSelectedNetwork(adapter)}
 * />
 * // Returns null - no tabs needed for single network
 * ```
 *
 * @example
 * ```tsx
 * // Multi-network with "All" option selected
 * <NetworkTabs
 *   networks={[OrbitAdapter.EVM, OrbitAdapter.SOLANA, OrbitAdapter.BITCOIN]}
 *   selectedAdapter={undefined} // "All" networks selected
 *   onSelect={(adapter) => filterByNetwork(adapter)}
 * />
 * ```
 *
 * @public
 */
export function NetworkTabs({ networks, selectedAdapter, onSelect }: NetworkTabsProps) {
  const labels = useNovaConnectLabels();

  // Don't render tabs if only one or no networks available
  if (networks.length <= 1) return null;

  // Include "All" option (undefined) as first tab
  const localNetworks = [undefined, ...networks];

  /**
   * Handles tab selection with keyboard and mouse events
   * @param network - Selected network adapter (undefined for "All")
   */
  const handleTabSelect = (network: OrbitAdapter | undefined) => {
    onSelect(network);
  };

  /**
   * Gets display name for network tab
   * @param network - Network adapter (undefined for "All")
   * @returns Human-readable network name
   */
  const getNetworkDisplayName = (network: OrbitAdapter | undefined) => {
    return typeof network !== 'undefined' ? getNetworkIcon(network)?.name : labels.all;
  };

  /**
   * Gets aria-label for network tab accessibility
   * @param network - Network adapter (undefined for "All")
   * @returns Accessible label for screen readers
   */
  const getNetworkAriaLabel = (network: OrbitAdapter | undefined) => {
    const displayName = getNetworkDisplayName(network);
    const isSelected = selectedAdapter === network;
    return `${displayName} network${isSelected ? ', currently selected' : ''}`;
  };

  return (
    <motion.div
      layout
      transition={{
        layout: {
          duration: 0.6,
          ease: [0.1, 0.1, 0.2, 1],
        },
      }}
      role="tablist"
      aria-label="Network selection tabs"
    >
      <motion.div
        layout
        transition={{
          layout: {
            duration: 0.0001,
          },
        }}
      >
        <div className="flex overflow-x-auto gap-2 p-2 mb-2 border-b border-[var(--tuwa-border-primary)] relative">
          {localNetworks.map((network, index) => {
            const displayName = getNetworkDisplayName(network);
            const isSelected = selectedAdapter === network;
            const networkInfo = network ? getNetworkIcon(network) : null;

            return (
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
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`network-panel-${network || 'all'}`}
                    onClick={() => handleTabSelect(network)}
                    title={displayName}
                    aria-label={getNetworkAriaLabel(network)}
                    className={cn(
                      'cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg transition-colors overflow-hidden relative z-4',
                      'hover:bg-[var(--tuwa-bg-muted)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-border-primary)] focus:ring-offset-2',
                      isSelected
                        ? 'bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-accent)]'
                        : 'text-[var(--tuwa-text-secondary)]',
                    )}
                  >
                    <div
                      className="w-6 h-6 [&>img]:w-full [&>img]:h-full"
                      role="img"
                      aria-label={`${displayName} network icon`}
                    >
                      {network ? (
                        <Web3Icon chainId={networkInfo?.chainId} />
                      ) : (
                        <div className="w-6 h-6 [&>img]:w-full [&>img]:h-full rounded-full bg-[var(--tuwa-bg-primary)]">
                          <GlobeAltIcon aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      <motion.span
                        variants={textVariant}
                        className="block"
                        animate={isSelected ? 'active' : 'inactive'}
                        aria-hidden={!isSelected}
                      >
                        {displayName}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </motion.div>

                {isSelected && (
                  <motion.div
                    layoutId="indicator"
                    className="absolute inset-0 bg-[var(--tuwa-bg-muted)] z-3 rounded-lg"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
