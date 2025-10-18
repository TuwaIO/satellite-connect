import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { formatWalletName, isSafeApp, OrbitAdapter } from '@tuwaio/orbit-core';
import React, { useMemo } from 'react';

import { ConnectContentType } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { InitialChains } from '../../types';
import { isTouchDevice } from '../../utils';
import { ConnectButtonProps } from '../ConnectButton';
import { WalletIcon } from '../WalletIcon';
import { ConnectCard } from './ConnectCard';
import { GroupedConnector } from './ConnectModal';
import { ConnectorsBlock } from './ConnectorsBlock';
import { Disclaimer } from './Disclaimer';

/**
 * Props for the ConnectorsSelections component
 */
export interface ConnectorsSelectionsProps
  extends Pick<ConnectButtonProps, 'withImpersonated' | 'store'>,
    InitialChains {
  /** Currently selected network adapter */
  selectedAdapter: OrbitAdapter | undefined;
  /** Array of grouped wallet connectors */
  connectors: GroupedConnector[];
  /** Click handler for connector selection */
  onClick: (connector: GroupedConnector) => void;
  /** Function to set connection status */
  setIsConnected: (value: boolean) => void;
  /** Function to control modal open state */
  setIsOpen: (value: boolean) => void;
  /** Function to wait for connection prediction */
  waitForPredict: () => boolean | undefined;
  /** Function to set modal content type */
  setContentType: (contentType: ConnectContentType) => void;
  /** Whether only one network is available */
  isOnlyOneNetwork?: boolean;
}

/**
 * ConnectorsSelections component - Main wallet selection interface with categorized connectors
 *
 * This component provides the primary wallet selection interface with:
 * - Categorized wallet sections (Installed, Popular, Impersonate)
 * - Responsive layout adapting to touch/mouse interfaces
 * - Safe App environment detection and filtering
 * - Empty state handling for missing connectors
 * - Educational content integration for touch devices
 * - Full accessibility support with semantic structure
 *
 * Wallet categorization:
 * - Installed: Detected browser extension wallets (excluding popular ones)
 * - Popular: Coinbase Wallet and WalletConnect for broader compatibility
 * - Impersonate: Development/testing wallet for address simulation
 * - Safe App filtering: Conditional Safe Wallet display based on environment
 *
 * Layout features:
 * - Touch devices: Horizontal scrolling with educational disclaimer
 * - Mouse devices: Vertical scrolling with fixed height container
 * - Responsive grid adapting to screen size and device capabilities
 * - Custom scrollbar styling with NovaCustomScroll class
 *
 * Empty state handling:
 * - Clear error messaging when no connectors found
 * - Contextual help text explaining the issue
 * - Visual indicators with warning icons
 * - Proper error state accessibility
 *
 * Accessibility features:
 * - Semantic HTML structure with proper headings
 * - ARIA labels for screen readers
 * - Role-based navigation support
 * - Focus management for keyboard users
 * - Error states with descriptive messaging
 *
 * @param selectedAdapter - Currently selected network adapter
 * @param connectors - Array of available wallet connectors
 * @param onClick - Handler for wallet connector selection
 * @param setIsConnected - Function to update connection status
 * @param setIsOpen - Function to control modal visibility
 * @param waitForPredict - Function for connection state prediction
 * @param setContentType - Function to change modal content
 * @param withImpersonated - Whether to show impersonation option
 * @param isOnlyOneNetwork - Whether only one network is available
 * @param appChains - Configuration for supported blockchain networks
 * @param solanaRPCUrls - Solana RPC endpoints configuration
 * @returns JSX element representing the connector selection interface
 *
 * @example
 * ```tsx
 * <ConnectorsSelections
 *   selectedAdapter={OrbitAdapter.EVM}
 *   connectors={availableConnectors}
 *   onClick={(connector) => handleWalletSelection(connector)}
 *   setIsConnected={setConnectionStatus}
 *   setIsOpen={setModalOpen}
 *   waitForPredict={() => checkConnectionState()}
 *   setContentType={setModalContent}
 *   withImpersonated={true}
 *   isOnlyOneNetwork={false}
 *   appChains={chainConfiguration}
 *   solanaRPCUrls={solanaConfig}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Touch device optimized with educational content
 * <ConnectorsSelections
 *   selectedAdapter={undefined}
 *   connectors={allConnectors}
 *   onClick={(connector) => initiateConnection(connector)}
 *   setIsConnected={updateConnectionState}
 *   setIsOpen={toggleModal}
 *   waitForPredict={predictConnection}
 *   setContentType={changeContent}
 *   withImpersonated={false}
 *   isOnlyOneNetwork={true}
 * />
 * ```
 *
 * @public
 */
export function ConnectorsSelections({
  setIsConnected,
  setIsOpen,
  selectedAdapter,
  connectors,
  onClick,
  appChains,
  solanaRPCUrls,
  waitForPredict,
  setContentType,
  withImpersonated,
  isOnlyOneNetwork,
  store,
}: ConnectorsSelectionsProps) {
  const labels = useNovaConnectLabels();
  const isTouch = useMemo(() => isTouchDevice(), []);

  /**
   * Filters connectors to show only installed wallets (excluding popular ones)
   */
  const installedConnectorsInitial = useMemo(
    () =>
      connectors.filter((group) => {
        const formattedName = formatWalletName(group.name);
        return (
          formattedName !== 'impersonatedwallet' &&
          formattedName !== 'coinbasewallet' &&
          formattedName !== 'walletconnect'
        );
      }),
    [connectors],
  );

  /**
   * Applies Safe App filtering to installed connectors
   */
  const installedConnectors = useMemo(
    () =>
      isSafeApp
        ? installedConnectorsInitial
        : installedConnectorsInitial.filter((group) => formatWalletName(group.name) !== 'safewallet'),
    [installedConnectorsInitial],
  );

  /**
   * Checks if impersonated wallet connector is available
   */
  const isImpersonatedConnectorInConnectors = useMemo(
    () => connectors.some((group) => formatWalletName(group.name) === 'impersonatedwallet'),
    [connectors],
  );

  /**
   * Filters connectors to show only popular wallet options
   */
  const popularConnectors = useMemo(
    () =>
      connectors.filter((group) => {
        const formattedName = formatWalletName(group.name);
        return formattedName === 'coinbasewallet' || formattedName === 'walletconnect';
      }),
    [connectors],
  );

  const touchListClasses = [
    'novacon:flex-row',
    'novacon:overflow-x-auto',
    'novacon:max-h-none',
    'novacon:gap-3',
    'novacon:pb-4',
    'novacon:px-1',
  ];
  const mouseListClasses = ['novacon:flex-col', 'novacon:overflow-y-auto', 'novacon:max-h-[310px]', 'novacon:gap-2'];

  /**
   * Handles click on impersonated wallet option
   */
  const handleImpersonateClick = () => {
    const impersonateConnector = connectors.find((group) => formatWalletName(group.name) === 'impersonatedwallet');
    if (impersonateConnector) {
      onClick(impersonateConnector);
    }
  };

  // Empty state when no connectors found for selected adapter
  if (selectedAdapter && !connectors?.length) {
    return (
      <div
        className="novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:p-8 novacon:text-center novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:rounded-xl novacon:bg-[var(--tuwa-bg-secondary)] novacon:text-[var(--tuwa-text-secondary)]"
        role="alert"
        aria-live="polite"
      >
        <ExclamationTriangleIcon
          width={32}
          height={32}
          className="novacon:text-[var(--tuwa-text-accent)] novacon:mb-3"
          aria-hidden="true"
        />
        <h2 className="novacon:text-lg novacon:font-semibold novacon:text-[var(--tuwa-text-primary)] novacon:mb-1">
          {labels.noConnectorsFound}
        </h2>
        <p className="novacon:text-sm">{labels.noConnectorsDescription}</p>
      </div>
    );
  }

  return (
    <div className="novacon:flex novacon:flex-col novacon:gap-4" role="region" aria-label={labels.connectWallet}>
      <div className={cn('novacon:flex novacon:flex-col novacon:gap-2', { 'novacon:flex-row': isTouch })}>
        <div
          className={cn('novacon:flex NovaCustomScroll', isTouch ? touchListClasses : mouseListClasses)}
          role="region"
          aria-label="Available wallet connectors"
        >
          <ConnectorsBlock
            connectors={installedConnectors}
            title={labels.installed}
            selectedAdapter={selectedAdapter}
            onClick={onClick}
            waitForPredict={waitForPredict}
            solanaRPCUrls={solanaRPCUrls}
            setIsConnected={setIsConnected}
            setIsOpen={setIsOpen}
            appChains={appChains}
            isOnlyOneNetwork={isOnlyOneNetwork}
            isTitleBold
            store={store}
          />
          <ConnectorsBlock
            connectors={popularConnectors}
            title={labels.popular}
            selectedAdapter={selectedAdapter}
            onClick={onClick}
            waitForPredict={waitForPredict}
            solanaRPCUrls={solanaRPCUrls}
            setIsConnected={setIsConnected}
            setIsOpen={setIsOpen}
            appChains={appChains}
            isOnlyOneNetwork={isOnlyOneNetwork}
            store={store}
          />
        </div>

        {isImpersonatedConnectorInConnectors && withImpersonated && (
          <div
            className={cn({ 'novacon:flex novacon:flex-col novacon:gap-2': isTouch })}
            role="region"
            aria-label={labels.impersonate}
          >
            <p className={cn('novacon:text-sm novacon:hidden', { 'novacon:block novacon:opacity-0': isTouch })}>
              {labels.impersonate}
            </p>
            <ConnectCard
              icon={<WalletIcon name="impersonatedwallet" />}
              adapters={!selectedAdapter ? [OrbitAdapter.EVM] : undefined}
              onClick={handleImpersonateClick}
              title={labels.impersonate}
              subtitle={labels.readOnlyMode}
              isOnlyOneNetwork={isOnlyOneNetwork}
            />
          </div>
        )}
      </div>

      {isTouch && (
        <Disclaimer
          title={labels.whatIsWallet}
          description={labels.walletDescription}
          learnMoreAction={() => setContentType('about')}
        />
      )}
    </div>
  );
}
