import { cn, isTouchDevice } from '@tuwaio/nova-core';
import {
  formatWalletName,
  getWalletTypeFromConnectorName,
  OrbitAdapter,
  recentConnectedWalletHelpers,
  waitFor,
  WalletType,
} from '@tuwaio/orbit-core';
import React, { useMemo } from 'react';

import { getConnectChainId } from '../../utils';
import { ConnectButtonProps } from '../ConnectButton';
import { WalletIcon } from '../WalletIcon';
import { ConnectCard } from './ConnectCard';
import { GroupedConnector } from './ConnectModal';
import { ConnectorsSelectionsProps } from './ConnectorsSelections';

/**
 * Props for the ConnectorsBlock component
 */
interface ConnectorsBlockProps
  extends Pick<
      ConnectorsSelectionsProps,
      'waitForPredict' | 'setIsOpen' | 'setIsConnected' | 'onClick' | 'appChains' | 'solanaRPCUrls'
    >,
    Pick<ConnectButtonProps, 'store'> {
  /** Currently selected network adapter */
  selectedAdapter: OrbitAdapter | undefined;
  /** Array of grouped wallet connectors to display */
  connectors: GroupedConnector[];
  /** Title text for the connector group */
  title: string;
  /** Whether to render the title in bold accent color */
  isTitleBold?: boolean;
  /** Whether only one network is available */
  isOnlyOneNetwork?: boolean;
}

/**
 * ConnectorsBlock component - Displays a grouped section of wallet connectors
 *
 * This component renders a section of wallet connectors with:
 * - Responsive layout adapting to touch/mouse interfaces
 * - Support for multi-network wallet selection
 * - Automatic connection handling for single-network wallets
 * - Recent wallet indicators and prioritization
 * - Full accessibility support with proper labeling
 * - Error handling and connection retry logic
 *
 * Layout features:
 * - Touch devices: Horizontal scrolling layout with cards
 * - Mouse devices: Vertical stacked layout for better readability
 * - Dynamic title styling based on section importance
 * - Consistent spacing and visual hierarchy
 *
 * Connection flow:
 * - Single adapter: Direct connection attempt
 * - Multiple adapters without selection: Triggers network selection
 * - Selected adapter: Uses specific adapter for connection
 * - Recent wallets: Visual indicators for previously used wallets
 *
 * Accessibility features:
 * - Semantic heading structure with proper levels
 * - Group labeling for related connector sets
 * - Screen reader friendly section descriptions
 * - Proper focus management and keyboard navigation
 *
 * @param selectedAdapter - Currently selected network adapter
 * @param connectors - Array of grouped wallet connectors
 * @param title - Section title for the connector group
 * @param isTitleBold - Whether to style title as accent/important
 * @param isOnlyOneNetwork - Whether only one network is available
 * @param waitForPredict - Function to wait for connection prediction
 * @param setIsOpen - Function to control modal open state
 * @param setIsConnected - Function to set connection status
 * @param onClick - Click handler for connector selection
 * @param appChains - Configuration for supported chains
 * @param solanaRPCUrls - Solana RPC URL configuration
 * @returns JSX element representing the connectors block
 *
 * @example
 * ```tsx
 * <ConnectorsBlock
 *   selectedAdapter={OrbitAdapter.EVM}
 *   connectors={installedConnectors}
 *   title="Installed"
 *   isTitleBold={true}
 *   isOnlyOneNetwork={false}
 *   onClick={(group) => handleWalletSelection(group)}
 *   appChains={appConfiguration}
 *   solanaRPCUrls={rpcConfig}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Popular wallets section without network selection
 * <ConnectorsBlock
 *   selectedAdapter={undefined}
 *   connectors={popularConnectors}
 *   title="Popular"
 *   isTitleBold={false}
 *   isOnlyOneNetwork={true}
 *   onClick={(group) => initiateConnection(group)}
 *   appChains={appConfiguration}
 *   solanaRPCUrls={rpcConfig}
 * />
 * ```
 *
 * @public
 */
export function ConnectorsBlock({
  selectedAdapter,
  connectors,
  solanaRPCUrls,
  appChains,
  waitForPredict,
  setIsConnected,
  setIsOpen,
  onClick,
  title,
  isTitleBold,
  isOnlyOneNetwork,
  store,
}: ConnectorsBlockProps) {
  const isTouch = useMemo(() => isTouchDevice(), []);

  const connect = store.getState().connect;
  const recentWallets = recentConnectedWalletHelpers.getRecentConnectedWallet();

  const touchCardContainerClasses = ['novacon:flex-row', 'novacon:gap-3'];
  const mouseCardContainerClasses = ['novacon:flex-col', 'novacon:gap-2'];

  /**
   * Handles connector click with connection logic
   * @param group - The grouped connector that was clicked
   */
  const handleConnectorClick = async (group: GroupedConnector) => {
    const name = formatWalletName(group.name);

    // If multiple adapters available and no specific adapter selected, show network selection
    if (group.adapters.length > 1 && !selectedAdapter) {
      // Here you could trigger a network selection modal or dropdown
      onClick(group); // This should handle the network selection logic
      return;
    }

    // Use the selected adapter or the first available adapter
    const targetAdapter = selectedAdapter || group.adapters[0];
    const walletType = getWalletTypeFromConnectorName(targetAdapter, name) as WalletType;

    onClick(group);

    await connect({
      walletType,
      chainId: getConnectChainId({ appChains, selectedAdapter: targetAdapter, solanaRPCUrls }),
    });

    try {
      await waitFor(waitForPredict);
      setIsConnected(true);
      setTimeout(() => setIsOpen(false), 500);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Generates section ID for accessibility labeling
   */
  const sectionId = useMemo(() => `connectors-${title.toLowerCase().replace(/\s+/g, '-')}`, [title]);

  /**
   * Determines if a wallet was recently used
   */
  const isWalletRecent = (group: GroupedConnector) => {
    const name = formatWalletName(group.name);
    return recentWallets ? (recentWallets[group.adapters[0]] ? recentWallets[group.adapters[0]][name] : false) : false;
  };

  return (
    <section
      className="novacon:flex novacon:flex-col novacon:gap-2"
      aria-labelledby={`${sectionId}-title`}
      role="group"
    >
      {!!connectors?.length && (
        <h3
          id={`${sectionId}-title`}
          className={cn('novacon:text-sm novacon:text-[var(--tuwa-text-secondary)]', {
            'novacon:font-bold novacon:text-[var(--tuwa-text-accent)]': isTitleBold,
          })}
        >
          {title}
        </h3>
      )}
      <div
        className={cn('novacon:flex', isTouch ? touchCardContainerClasses : mouseCardContainerClasses)}
        role="list"
        aria-label={`${title} wallet connectors`}
      >
        {!!connectors?.length &&
          connectors.map((group) => {
            const name = formatWalletName(group.name);
            const isRecent = isWalletRecent(group);

            return (
              <div
                key={`${name}-${group.adapters.join('-')}`}
                className={cn(isTouch && 'novacon:flex-shrink-0')}
                role="listitem"
              >
                <ConnectCard
                  icon={<WalletIcon icon={group.icon} name={name} />}
                  adapters={!selectedAdapter ? group.adapters : undefined}
                  onClick={() => handleConnectorClick(group)}
                  title={group.name}
                  isOnlyOneNetwork={isOnlyOneNetwork}
                  isRecent={isRecent}
                />
              </div>
            );
          })}
      </div>
    </section>
  );
}
