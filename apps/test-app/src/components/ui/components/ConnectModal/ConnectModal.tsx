import { InformationCircleIcon } from '@heroicons/react/24/outline';
import {
  CloseIcon,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  standardButtonClasses,
} from '@tuwaio/nova-core';
import {
  formatWalletName,
  getWalletTypeFromConnectorName,
  impersonatedHelpers,
  OrbitAdapter,
  waitFor,
  WalletType,
} from '@tuwaio/orbit-core';
import { Connector, SatelliteStoreContext, useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';
import { isAddress } from 'gill';
import React, { useContext, useEffect } from 'react';

import { ConnectContentType, useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { InitialChains } from '../../types';
import { getConnectChainId } from '../../utils/getConnectedChainId';
import { getFilteredConnectors } from '../../utils/getFilteredConnectors';
import { networksLinks } from '../../utils/networksLinks';
import { AboutWallets } from './AboutWallets';
import { Connecting } from './Connecting';
import { ConnectorsSelections } from './ConnectorsSelections';
import { GetWallet } from './GetWallet';
import { ImpersonateForm } from './ImpersonatedForm';
import { NetworkSelections } from './NetworkSelections';
import { NetworkTabs } from './NetworkTabs';

/**
 * Interface for grouped wallet connectors
 */
export interface GroupedConnector {
  /** Name of the wallet connector */
  name: string;
  /** Optional icon for the wallet */
  icon?: string;
  /** Array of supported network adapters */
  adapters: OrbitAdapter[];
  /** Array of connectors with their associated adapters */
  connectors: (Connector & { adapter: OrbitAdapter })[];
}

/**
 * ConnectModal component - Main modal dialog for wallet connection workflow
 *
 * This component provides a comprehensive wallet connection interface with:
 * - Multi-step connection flow with different content types
 * - Network selection and adapter filtering
 * - Support for regular wallets and impersonated wallets
 * - Educational content about wallets and networks
 * - Error handling and retry mechanisms
 * - Full accessibility support with ARIA labels
 * - Keyboard navigation and screen reader compatibility
 *
 * Modal content types:
 * - 'connectors': Main wallet selection screen with network tabs
 * - 'network': Network selection for multi-network wallets
 * - 'connecting': Connection progress and status display
 * - 'about': Educational content about wallets
 * - 'getWallet': Onboarding flow for users without wallets
 * - 'impersonate': Form for wallet address impersonation
 *
 * Visual features:
 * - Responsive design adapting to different screen sizes
 * - Smooth transitions between different content states
 * - Loading states and progress indicators
 * - Clear navigation with back/forward buttons
 * - Contextual action buttons in footer
 *
 * Accessibility features:
 * - Proper ARIA labels and roles for screen readers
 * - Keyboard navigation support with focus management
 * - Semantic HTML structure for better navigation
 * - Screen reader announcements for state changes
 * - High contrast compatible styling
 *
 * @param appChains - Configuration for supported blockchain networks
 * @param solanaRPCUrls - RPC URLs configuration for Solana network
 * @returns JSX element representing the connection modal dialog
 *
 * @example
 * ```tsx
 * <ConnectModal
 *   appChains={{
 *     [OrbitAdapter.EVM]: [1, 137, 56], // Ethereum, Polygon, BSC
 *     [OrbitAdapter.SOLANA]: ['devnet', 'mainnet-beta']
 *   }}
 *   solanaRPCUrls={{
 *     'mainnet-beta': 'https://api.mainnet-beta.solana.com',
 *     'devnet': 'https://api.devnet.solana.com'
 *   }}
 * />
 * ```
 *
 * @public
 */
export function ConnectModal({ appChains, solanaRPCUrls }: InitialChains) {
  const getConnectors = useSatelliteConnectStore((store) => store.getConnectors);
  const connect = useSatelliteConnectStore((store) => store.connect);
  const walletConnectionError = useSatelliteConnectStore((store) => store.walletConnectionError);

  const store = useContext(SatelliteStoreContext);
  const labels = useNovaConnectLabels();

  const {
    isConnectModalOpen,
    setIsConnectModalOpen,
    setConnectModalContentType,
    setActiveConnector,
    setImpersonatedAddress,
    setIsConnected,
    connectModalContentType,
    selectedAdapter,
    setSelectedAdapter,
    isConnected,
    withImpersonated,
    activeConnector,
    impersonatedAddress,
  } = useNovaConnect();

  const connectors = getConnectors();
  const filteredConnectors = getFilteredConnectors({ connectors, selectedAdapter });

  useEffect(() => {
    if (isConnectModalOpen) {
      setConnectModalContentType('connectors');
      setSelectedAdapter(undefined);
      setActiveConnector(undefined);
      setImpersonatedAddress('');
      setIsConnected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnectModalOpen]);

  /**
   * Gets the appropriate title for the current modal content
   */
  const getTitle = () => {
    switch (connectModalContentType) {
      case 'about':
        return labels.aboutWallets;
      case 'getWallet':
        return labels.getWallet;
      case 'connecting':
        return selectedAdapter
          ? connectors[selectedAdapter]?.find((connector) => formatWalletName(connector.name) === activeConnector)?.name
          : labels.connectingEllipsis;
      case 'impersonate':
        return labels.connectImpersonatedWallet;
      default:
        return labels.connectWallet;
    }
  };

  /**
   * Determines the content type to navigate back to
   */
  const goBackContentType = () => {
    switch (connectModalContentType) {
      default:
        return 'connectors';
    }
  };

  /**
   * Renders the main content based on current modal state
   */
  const renderMainContent = () => {
    switch (connectModalContentType) {
      case 'network':
        return (
          <NetworkSelections
            activeConnector={activeConnector}
            connectors={filteredConnectors}
            onClick={async (adapter, walletType) => {
              setSelectedAdapter(adapter);
              setConnectModalContentType('connecting');
              await connect({
                walletType,
                chainId: getConnectChainId({ appChains, selectedAdapter: adapter, solanaRPCUrls }),
              });
              try {
                await waitFor(() => store?.getState().activeWallet?.isConnected);
                setIsConnected(true);
                setTimeout(() => setIsConnectModalOpen(false), 500);
              } catch (error) {
                console.error(error);
              }
            }}
          />
        );
      case 'connectors':
        return (
          <>
            <NetworkTabs
              networks={Object.keys(connectors) as OrbitAdapter[]}
              selectedAdapter={selectedAdapter}
              onSelect={(adapter) => setSelectedAdapter(adapter)}
            />

            <ConnectorsSelections
              isOnlyOneNetwork={Object.keys(connectors).length === 1}
              connectors={filteredConnectors}
              selectedAdapter={selectedAdapter}
              onClick={(connector: GroupedConnector) => {
                setActiveConnector(formatWalletName(connector.name));
                if (connector.adapters.length === 1) {
                  setSelectedAdapter(connector.adapters[0]);
                  setConnectModalContentType(
                    formatWalletName(connector.name) === 'impersonatedwallet' ? 'impersonate' : 'connecting',
                  );
                } else if (selectedAdapter) {
                  setConnectModalContentType(
                    formatWalletName(connector.name) === 'impersonatedwallet' ? 'impersonate' : 'connecting',
                  );
                } else if (formatWalletName(connector.name) === 'impersonatedwallet') {
                  setConnectModalContentType('impersonate');
                } else {
                  setConnectModalContentType('network');
                }
              }}
              setContentType={setConnectModalContentType}
              appChains={appChains}
              solanaRPCUrls={solanaRPCUrls}
              setIsConnected={setIsConnected}
              setIsOpen={setIsConnectModalOpen}
              waitForPredict={() => store?.getState().activeWallet?.isConnected}
              withImpersonated={withImpersonated}
            />
          </>
        );
      case 'about':
        return <AboutWallets />;
      case 'getWallet':
        return <GetWallet />;
      case 'connecting':
        return (
          <Connecting
            selectedAdapter={selectedAdapter}
            connectors={filteredConnectors}
            activeConnector={activeConnector}
            isConnected={isConnected}
          />
        );
      case 'impersonate':
        return (
          <ImpersonateForm impersonatedAddress={impersonatedAddress} setImpersonatedAddress={setImpersonatedAddress} />
        );
    }
  };

  /**
   * Gets configuration for the bottom action button
   */
  const getBottomButtonInfo = () => {
    switch (connectModalContentType) {
      case 'connectors':
        return {
          title: labels.iDontHaveWallet,
          onClick: () => setConnectModalContentType('getWallet'),
        };
      case 'getWallet':
        return {
          title: labels.choseWallet,
          onClick: () =>
            window.open(
              networksLinks[selectedAdapter ?? (Object.keys(connectors)[0] as OrbitAdapter)]?.choseWallet,
              '_blank',
              'noopener,noreferrer',
            ),
        };
      case 'about':
        return {
          title: labels.learnMore,
          onClick: () =>
            window.open(
              networksLinks[selectedAdapter ?? (Object.keys(connectors)[0] as OrbitAdapter)]?.about,
              '_blank',
              'noopener,noreferrer',
            ),
        };
      case 'impersonate':
        return {
          title: labels.connect,
          onClick: async () => {
            const trimmedAddress = impersonatedAddress.trim();
            if (
              walletConnectionError ||
              !trimmedAddress ||
              isAddress(trimmedAddress) ||
              !!store?.getState().activeWallet?.isConnected
            )
              return;
            impersonatedHelpers.setImpersonated(trimmedAddress);
            await connect({
              walletType: `${selectedAdapter ?? OrbitAdapter.EVM}:impersonatedwallet` as WalletType,
              chainId: getConnectChainId({
                appChains,
                selectedAdapter: selectedAdapter ?? OrbitAdapter.EVM,
                solanaRPCUrls,
              }),
            });
            setConnectModalContentType('connecting');
            try {
              await waitFor(() => store?.getState().activeWallet?.isConnected);
              setIsConnected(true);
              setTimeout(() => setIsConnectModalOpen(false), 500);
            } catch (error) {
              console.error(error);
            }
          },
        };
      case 'connecting':
        return walletConnectionError && selectedAdapter && activeConnector
          ? {
              title: labels.tryAgain,
              onClick: async () => {
                await connect({
                  walletType: getWalletTypeFromConnectorName(selectedAdapter, activeConnector) as WalletType,
                  chainId: getConnectChainId({ appChains, selectedAdapter, solanaRPCUrls }),
                });
                try {
                  await waitFor(() => store?.getState().activeWallet?.isConnected);
                  setIsConnected(true);
                  setTimeout(() => setIsConnectModalOpen(false), 500);
                } catch (error) {
                  console.error(error);
                }
              },
            }
          : undefined;
    }
  };

  return (
    <Dialog open={isConnectModalOpen} onOpenChange={(open) => setIsConnectModalOpen(open)}>
      <DialogContent className={cn('w-full sm:max-w-md')}>
        <motion.div
          layout
          transition={{
            layout: {
              duration: 0.0001,
            },
          }}
        >
          <div className={cn('relative flex w-full flex-col')}>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {connectModalContentType === 'connectors' && (
                  <button
                    className="cursor-pointer text-[var(--tuwa-text-secondary)] transition duration-300 ease-in-out active:scale-75 hover:scale-110"
                    type="button"
                    onClick={() => setConnectModalContentType('about')}
                    aria-label={`${labels.learnMore} ${labels.aboutWallets}`}
                  >
                    <InformationCircleIcon width={20} height={20} className="mr-1" aria-hidden="true" />
                  </button>
                )}
                {getTitle()}
              </DialogTitle>

              <DialogClose asChild>
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  aria-label={labels.closeModal}
                  className="cursor-pointer rounded-full p-1
                     text-[var(--tuwa-text-tertiary)] transition-colors
                     hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]"
                >
                  <CloseIcon aria-hidden="true" />
                </button>
              </DialogClose>
            </DialogHeader>

            <main className="flex flex-col gap-4 p-4" id="connect-modal-content" role="main">
              {renderMainContent()}
            </main>

            <footer
              className="flex w-full items-center justify-between border-t border-[var(--tuwa-border-primary)] p-4"
              role="contentinfo"
            >
              <div className="flex items-center gap-4">
                {connectModalContentType !== 'connectors' && (
                  <button
                    type="button"
                    onClick={() => setConnectModalContentType(goBackContentType() as ConnectContentType)}
                    className={standardButtonClasses}
                    aria-label={`${labels.back} to previous step`}
                  >
                    {labels.back}
                  </button>
                )}
              </div>
              {getBottomButtonInfo()?.title && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={getBottomButtonInfo()?.onClick}
                    className={standardButtonClasses}
                    aria-describedby="bottom-action-description"
                  >
                    {getBottomButtonInfo()?.title}
                  </button>
                  <span id="bottom-action-description" className="sr-only">
                    {connectModalContentType === 'getWallet' && 'Opens external wallet selection page'}
                    {connectModalContentType === 'about' && 'Opens external documentation'}
                    {connectModalContentType === 'impersonate' && 'Connects with impersonated wallet address'}
                    {connectModalContentType === 'connecting' && 'Retries wallet connection'}
                  </span>
                </div>
              )}
            </footer>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
