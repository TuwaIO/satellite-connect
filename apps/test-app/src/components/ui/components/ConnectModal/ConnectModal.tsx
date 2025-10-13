import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { standardButtonClasses } from '@tuwaio/nova-core';
import { CloseIcon, cn, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@tuwaio/nova-core';
import {
  formatWalletName,
  getWalletTypeFromConnectorName,
  impersonatedHelpers,
  OrbitAdapter,
  waitFor,
  WalletType,
} from '@tuwaio/orbit-core';
import { Connector, useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { SatelliteStoreContext } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';
import React, { useContext, useEffect } from 'react';

import { ConnectContentType, useNovaConnect } from '../../hooks/useNovaConnect';
import { InitialChains } from '../../types';
import { getConnectChainId } from '../../utils/getConnectedChainId';
import { getFilteredConnectors } from '../../utils/getFilteredConnectors';
import { networksLinks } from '../../utils/networksLinks';
import { AboutWallets } from './AboutWallets';
import { Connecting } from './Connecting';
import { ConnectorsSelections } from './ConnectorsSelections';
import { GetWallet } from './GetWallet';
import { ImpersonatedForm } from './ImpersonatedForm';
import { NetworkSelections } from './NetworkSelections';
import { NetworkTabs } from './NetworkTabs';

export interface GroupedConnector {
  name: string;
  icon?: string;
  adapters: OrbitAdapter[];
  connectors: (Connector & { adapter: OrbitAdapter })[];
}

export function ConnectModal({ appChains, solanaRPCUrls }: InitialChains) {
  const getConnectors = useSatelliteConnectStore((store) => store.getConnectors);
  const connect = useSatelliteConnectStore((store) => store.connect);
  const walletConnectionError = useSatelliteConnectStore((store) => store.walletConnectionError);

  const store = useContext(SatelliteStoreContext);

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

  const getTitle = () => {
    switch (connectModalContentType) {
      case 'about':
        return 'About wallets';
      case 'getWallet':
        return 'Get a wallet';
      case 'connecting':
        return selectedAdapter
          ? connectors[selectedAdapter]?.find((connector) => formatWalletName(connector.name) === activeConnector)?.name
          : 'Connecting...';
      case 'impersonate':
        return 'Connect impersonated wallet';
      default:
        return 'Connect wallet';
    }
  };

  const goBackContentType = () => {
    switch (connectModalContentType) {
      default:
        return 'connectors';
    }
  };

  const renderMainContent = () => {
    switch (connectModalContentType) {
      case 'network':
        return (
          <NetworkSelections
            activeConnector={activeConnector}
            connectors={filteredConnectors}
            onClick={async (adapter, walletType) => {
              await connect({
                walletType,
                chainId: getConnectChainId({ appChains, selectedAdapter: adapter, solanaRPCUrls }),
              });
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
              connectors={filteredConnectors}
              selectedAdapter={selectedAdapter}
              onClick={(connector: GroupedConnector) => {
                setActiveConnector(formatWalletName(connector.name));
                if (connector.adapters.length === 1) {
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
          <ImpersonatedForm impersonatedAddress={impersonatedAddress} setImpersonatedAddress={setImpersonatedAddress} />
        );
    }
  };

  const getBottomButtonInfo = () => {
    switch (connectModalContentType) {
      case 'connectors':
        return {
          title: "I don't have a wallet",
          onClick: () => setConnectModalContentType('getWallet'),
        };
      case 'getWallet':
        return {
          title: 'Chose a wallet',
          onClick: () =>
            selectedAdapter
              ? window.open(networksLinks[selectedAdapter]?.choseWallet, '_blank', 'noopener,noreferrer')
              : undefined,
        };
      case 'about':
        return {
          title: 'Learn more',
          onClick: () =>
            selectedAdapter
              ? window.open(networksLinks[selectedAdapter]?.about, '_blank', 'noopener,noreferrer')
              : undefined,
        };
      case 'impersonate':
        return {
          title: 'Connect',
          onClick: async () => {
            const trimmedAddress = impersonatedAddress.trim();
            impersonatedHelpers.setImpersonated(trimmedAddress);
            await connect({
              walletType: `${selectedAdapter ?? OrbitAdapter.EVM}:impersonatedwallet` as WalletType,
              chainId: getConnectChainId({
                appChains,
                selectedAdapter: selectedAdapter ?? OrbitAdapter.EVM,
                solanaRPCUrls,
              }),
            });
            setIsConnectModalOpen(false);
          },
        };
      case 'connecting':
        return walletConnectionError && selectedAdapter && activeConnector
          ? {
              title: 'Try again',
              onClick: async () => {
                await connect({
                  walletType: getWalletTypeFromConnectorName(selectedAdapter, activeConnector) as WalletType,
                  chainId: getConnectChainId({ appChains, selectedAdapter, solanaRPCUrls }),
                });
                try {
                  await waitFor(() => store?.getState().activeWallet?.isConnected);
                  setIsConnected(true);
                  setTimeout(() => setIsConnectModalOpen(false), 1000);
                } catch (error) {
                  console.error(error);
                }
              },
            }
          : undefined;
    }
  };

  console.log('connectModalContentType', connectModalContentType);

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
                  >
                    <InformationCircleIcon width={20} height={20} className="mr-1" />
                  </button>
                )}
                {getTitle()}
              </DialogTitle>

              <DialogClose asChild>
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  aria-label="Close modal"
                  className="cursor-pointer rounded-full p-1
                     text-[var(--tuwa-text-tertiary)] transition-colors
                     hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]"
                >
                  <CloseIcon />
                </button>
              </DialogClose>
            </DialogHeader>

            <main className="flex flex-col gap-4 p-4">{renderMainContent()}</main>

            <footer className="flex w-full items-center justify-between border-t border-[var(--tuwa-border-primary)] p-4">
              <div className="flex items-center gap-4">
                {connectModalContentType !== 'connectors' && (
                  <button
                    type="button"
                    onClick={() => setConnectModalContentType(goBackContentType() as ConnectContentType)}
                    className={standardButtonClasses}
                  >
                    Back
                  </button>
                )}
              </div>
              {getBottomButtonInfo()?.title && (
                <div className="flex items-center gap-3">
                  <button type="button" onClick={getBottomButtonInfo()?.onClick} className={standardButtonClasses}>
                    {getBottomButtonInfo()?.title}
                  </button>
                </div>
              )}
            </footer>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
