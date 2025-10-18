import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { formatWalletName, getWalletTypeFromConnectorName, OrbitAdapter, WalletType } from '@tuwaio/orbit-core';
import React, { useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { getNetworkIcon, isTouchDevice, networksLinks } from '../../utils';
import { ConnectCard } from './ConnectCard';
import { GroupedConnector } from './ConnectModal';
import { Disclaimer } from './Disclaimer';

/**
 * Props for the NetworkSelections component
 */
interface NetworkSelectionsProps {
  /** Name of the currently active wallet connector */
  activeConnector: string | undefined;
  /** Array of grouped wallet connectors with their supported networks */
  connectors: GroupedConnector[];
  /** Click handler for network selection */
  onClick: (adapter: OrbitAdapter, walletType: WalletType) => Promise<void>;
}

/**
 * NetworkSelections component - Network/blockchain selection interface for multi-network wallets
 *
 * This component provides a network selection interface when a wallet supports multiple blockchains:
 * - Visual network cards with blockchain icons and names
 * - Responsive layout adapting to touch/mouse interfaces
 * - Error handling for invalid connector states
 * - Educational content about blockchain networks
 * - Full accessibility support with semantic structure
 * - External documentation links for each network
 *
 * Use cases:
 * - Multi-network wallets (e.g., MetaMask supporting EVM chains)
 * - Cross-chain wallets supporting both EVM and Solana
 * - Network-specific connection requirements
 * - User education about blockchain differences
 *
 * Layout features:
 * - Touch devices: Horizontal scrolling layout for easy mobile navigation
 * - Mouse devices: Vertical layout with fixed height scrolling
 * - Network icons with Web3Icon integration for consistency
 * - External links for additional network information
 *
 * Error handling:
 * - Graceful fallback when active connector is not found
 * - Clear error messaging with actionable guidance
 * - Visual error indicators with warning icons
 * - Accessible error state announcements
 *
 * Accessibility features:
 * - Semantic heading structure for network selection
 * - Proper ARIA labels for error states and selections
 * - Screen reader friendly network descriptions
 * - Keyboard navigation support for all interactive elements
 * - Error announcements with live regions
 *
 * @param activeConnector - Name of the currently selected wallet connector
 * @param connectors - Array of available wallet connectors with supported networks
 * @param onClick - Async handler for network selection with adapter and wallet type
 * @returns JSX element representing the network selection interface
 *
 * @example
 * ```tsx
 * <NetworkSelections
 *   activeConnector="metamask"
 *   connectors={multiNetworkConnectors}
 *   onClick={async (adapter, walletType) => {
 *     await connectToNetwork(adapter, walletType);
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // For cross-chain wallet selection
 * <NetworkSelections
 *   activeConnector="phantom"
 *   connectors={[{
 *     name: "Phantom",
 *     adapters: [OrbitAdapter.SOLANA, OrbitAdapter.EVM],
 *     connectors: phantomConnectors
 *   }]}
 *   onClick={(adapter, type) => handleNetworkConnection(adapter, type)}
 * />
 * ```
 *
 * @public
 */
export function NetworkSelections({ connectors, onClick, activeConnector }: NetworkSelectionsProps) {
  const labels = useNovaConnectLabels();
  const isTouch = useMemo(() => isTouchDevice(), []);

  const touchListClasses = [
    'novacon:flex-row',
    'novacon:overflow-x-auto',
    'novacon:max-h-none',
    'novacon:gap-3',
    'novacon:pb-4',
    'novacon:px-1',
  ];
  const mouseListClasses = ['novacon:flex-col', 'novacon:max-h-[310px]', 'novacon:overflow-y-auto', 'novacon:gap-2'];

  /**
   * Finds the active connector configuration
   */
  const activeConnectors = useMemo(
    () => connectors.find((connector) => formatWalletName(connector.name) === activeConnector),
    [connectors, activeConnector],
  );

  /**
   * Handles network selection click
   * @param network - The selected network adapter
   */
  const handleNetworkClick = (network: OrbitAdapter) => {
    if (!activeConnector) return;

    return onClick(network, getWalletTypeFromConnectorName(network, formatWalletName(activeConnector)) as WalletType);
  };

  // Error state when active connector is not found
  if (!activeConnectors) {
    return (
      <div
        className="novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:p-8 novacon:text-center novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:rounded-xl novacon:bg-[var(--tuwa-bg-secondary)] novacon:text-[var(--tuwa-text-secondary)]"
        role="alert"
        aria-live="assertive"
      >
        <ExclamationTriangleIcon
          width={32}
          height={32}
          className="novacon:text-[var(--tuwa-text-accent)] novacon:mb-3"
          aria-hidden="true"
        />
        <h2 className="novacon:text-lg novacon:font-semibold novacon:text-[var(--tuwa-text-primary)] novacon:mb-1">
          {labels.somethingWentWrong}
        </h2>
        <p className="novacon:text-sm">{labels.networkPickingError}</p>
      </div>
    );
  }

  return (
    <div
      className="novacon:flex novacon:flex-col novacon:gap-4 novacon:text-[var(--tuwa-text-primary)]"
      role="region"
      aria-labelledby="network-selection-title"
    >
      <h2 id="network-selection-title">{labels.selectAvailableNetwork}</h2>

      <div
        className={cn('novacon:flex NovaCustomScroll', isTouch ? touchListClasses : mouseListClasses)}
        role="list"
        aria-label="Available networks"
      >
        {activeConnectors.adapters.map((network) => {
          const networkInfo = getNetworkIcon(network);
          const networkName = networkInfo?.name ?? network;

          return (
            <div key={network} className={cn({ 'novacon:flex-shrink-0': isTouch })} role="listitem">
              <ConnectCard
                icon={
                  <div className="novacon:w-8 novacon:h-8" role="img" aria-label={`${networkName} network icon`}>
                    <Web3Icon chainId={networkInfo?.chainId} />
                  </div>
                }
                onClick={() => handleNetworkClick(network)}
                title={networkName}
                infoLink={networksLinks[network]?.aboutNetwork}
              />
            </div>
          );
        })}
      </div>

      <Disclaimer
        title={labels.whatIsNetwork}
        description={labels.networkDescription}
        learnMoreAction="https://academy.binance.com/en/articles/what-is-blockchain-and-how-does-it-work"
        listAction="https://www.alchemy.com/dapps/top/blockchains"
      />
    </div>
  );
}
