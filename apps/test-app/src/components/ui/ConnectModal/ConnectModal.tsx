import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { CloseIcon, cn, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@tuwaio/nova-core';
import { getWalletTypeFromConnectorName, OrbitAdapter } from '@tuwaio/orbit-core';
import { impersonatedHelpers, WalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { SatelliteStoreContext } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';

import { InitialChains } from '@/components/ui/types';
import { formatWalletName } from '@/components/ui/utils/formatWalletName';
import { getConnectChainId } from '@/components/ui/utils/getConnectedChainId';
import { networksLinks } from '@/components/ui/utils/networksLinks';
import { waitFor } from '@/components/ui/utils/waitFor';

import { AboutWallets } from './AboutWallets';
import { Connecting } from './Connecting';
import { ConnectorsSelections } from './ConnectorsSelections';
import { GetWallet } from './GetWallet';
import { ImpersonatedForm } from './ImpersonatedForm';
import { NetworkSelections } from './NetworkSelections';

export type ContentType = 'network' | 'connectors' | 'about' | 'getWallet' | 'connecting' | 'impersonate';

interface ConnectModalProps extends InitialChains {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ConnectModal({ isOpen, setIsOpen, solanaRPCUrls, appChains }: ConnectModalProps) {
  const getConnectors = useSatelliteConnectStore((store) => store.getConnectors);
  const connect = useSatelliteConnectStore((store) => store.connect);
  const walletConnectionError = useSatelliteConnectStore((store) => store.walletConnectionError);

  const store = useContext(SatelliteStoreContext);

  const connectors = getConnectors();
  const isOnlyOneNetwork = Object.keys(connectors).length === 1;

  const [contentType, setContentType] = useState<ContentType>(isOnlyOneNetwork ? 'connectors' : 'network');
  const [selectedAdapter, setSelectedAdapter] = useState<OrbitAdapter | undefined>(
    isOnlyOneNetwork ? (Object.keys(connectors)[0] as OrbitAdapter) : undefined,
  );
  const [activeConnector, setActiveConnector] = useState<string | undefined>(undefined);
  const [impersonatedAddress, setImpersonatedAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContentType(isOnlyOneNetwork ? 'connectors' : 'network');
      setSelectedAdapter(isOnlyOneNetwork ? (Object.keys(connectors)[0] as OrbitAdapter) : undefined);
      setActiveConnector(undefined);
      setImpersonatedAddress('');
      setIsConnected(false);
    }
  }, [isOpen]);

  const getTitle = () => {
    switch (contentType) {
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
    switch (contentType) {
      case 'connectors':
        return 'network';
      default:
        return 'connectors';
    }
  };

  const renderMainContent = () => {
    switch (contentType) {
      case 'network':
        return (
          <NetworkSelections
            networks={Object.keys(connectors) as OrbitAdapter[]}
            setSelectedAdapter={(network) => {
              setContentType('connectors');
              setSelectedAdapter(network);
            }}
          />
        );
      case 'connectors':
        return (
          <ConnectorsSelections
            connectors={connectors}
            selectedAdapter={selectedAdapter}
            onClick={(connectorName) => {
              setActiveConnector(connectorName);
              setContentType(connectorName === 'impersonatedconnector' ? 'impersonate' : 'connecting');
            }}
            appChains={appChains}
            solanaRPCUrls={solanaRPCUrls}
            setIsConnected={setIsConnected}
            setIsOpen={setIsOpen}
            waitForPredict={() => store?.getState().activeWallet?.isConnected}
          />
        );
      case 'about':
        return <AboutWallets />;
      case 'getWallet':
        return <GetWallet />;
      case 'connecting':
        return (
          <Connecting
            selectedAdapter={selectedAdapter}
            connectors={connectors}
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
    switch (contentType) {
      case 'connectors':
        return {
          title: "I don't have a wallet",
          onClick: () => setContentType('getWallet'),
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
              walletType: `${selectedAdapter}:impersonatedconnector` as WalletType,
              chainId: appChains ? appChains[0].id : 1,
            });
            setIsOpen(false);
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
                  setTimeout(() => setIsOpen(false), 1000);
                } catch (error) {
                  console.error(error);
                }
              },
            }
          : undefined;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className={cn('max-w-md')}>
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
                {contentType === 'connectors' && (
                  <button
                    className="cursor-pointer text-[var(--tuwa-text-secondary)] transition duration-300 ease-in-out active:scale-75 hover:scale-110"
                    type="button"
                    onClick={() => setContentType('about')}
                  >
                    <InformationCircleIcon width={20} height={20} className="mr-1" />
                  </button>
                )}
                {getTitle()}
              </DialogTitle>

              <DialogClose asChild>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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

            {contentType !== 'network' && (
              <footer
                className="flex w-full items-center justify-between
                       border-t border-[var(--tuwa-border-primary)] p-4"
              >
                <div className="flex items-center gap-4">
                  {isOnlyOneNetwork ? (
                    contentType !== 'connectors' && (
                      <button
                        type="button"
                        onClick={() => setContentType(goBackContentType())}
                        className="cursor-pointer rounded-md bg-[var(--tuwa-bg-muted)] px-4 py-2 text-sm font-semibold
                     text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-border-primary)]
                     disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Back
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => setContentType(goBackContentType())}
                      className="cursor-pointer rounded-md bg-[var(--tuwa-bg-muted)] px-4 py-2 text-sm font-semibold
                     text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-border-primary)]
                     disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Back
                    </button>
                  )}
                </div>
                {getBottomButtonInfo()?.title && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={getBottomButtonInfo()?.onClick}
                      className="cursor-pointer rounded-md bg-[var(--tuwa-bg-muted)] px-4 py-2 text-sm font-semibold
                     text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-border-primary)]
                     disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {getBottomButtonInfo()?.title}
                    </button>
                  </div>
                )}
              </footer>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
