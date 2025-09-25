import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@tuwaio/nova-core';
import { getWalletTypeFromConnectorName, OrbitAdapter } from '@tuwaio/orbit-core';
import { WalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, useEffect, useMemo, useState } from 'react';

import { ImpersonateForm } from '@/components/WalletConnect/ImpersonatedForm';
import { NetworkSelection } from '@/components/WalletConnect/NetworkSelection';
import { WalletCard } from '@/components/WalletConnect/WalletCard';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContentType = 'wallets' | 'network' | 'impersonate';

export const WalletConnectModal: FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const [contentType, setContentType] = useState<ContentType>('wallets');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [selectedWalletData, setSelectedWalletData] = useState<{
    name: string;
    adapters: OrbitAdapter[];
  } | null>(null);

  const availableConnectors = useSatelliteConnectStore((store) => store.availableConnectors);
  const connect = useSatelliteConnectStore((store) => store.connect);
  const walletConnecting = useSatelliteConnectStore((store) => store.walletConnecting);
  const walletConnectionError = useSatelliteConnectStore((store) => store.walletConnectionError);
  const resetWalletConnectionError = useSatelliteConnectStore((store) => store.resetWalletConnectionError);

  useEffect(() => {
    if (isOpen) {
      setSelectedWallet(null);
      setContentType('wallets');
      setSelectedWalletData(null);
      resetWalletConnectionError();
    }
  }, [isOpen, resetWalletConnectionError]);

  const groupedConnectors = useMemo(() => {
    const groups: Record<string, { name: string; adapters: OrbitAdapter[] }> = {};

    Object.entries(availableConnectors).forEach(([adapterKey, connectors]) => {
      connectors?.forEach((connector) => {
        const name = connector.name.toLowerCase();
        if (!groups[name]) {
          groups[name] = {
            name: connector.name,
            adapters: [],
          };
        }
        groups[name].adapters.push(adapterKey as OrbitAdapter);
      });
    });

    return Object.values(groups);
  }, [availableConnectors]);

  const handleConnect = async (name: string, adapter: OrbitAdapter) => {
    try {
      setSelectedWallet(name);
      await connect({
        walletType: getWalletTypeFromConnectorName(adapter, name) as WalletType,
        chainId: adapter === OrbitAdapter.EVM ? 1 : 'devnet',
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setSelectedWallet(null);
    }
  };

  const handleWalletSelect = (wallet: { name: string; adapters: OrbitAdapter[] }) => {
    if (wallet.adapters.length === 1) {
      handleConnect(wallet.name, wallet.adapters[0]);
    } else {
      setSelectedWalletData(wallet);
      setContentType('network');
    }
  };

  const renderContent = () => {
    switch (contentType) {
      case 'network':
        return selectedWalletData ? (
          <NetworkSelection
            name={selectedWalletData.name}
            adapters={selectedWalletData.adapters}
            onConnect={handleConnect}
            onBack={() => setContentType('wallets')}
            isLoading={walletConnecting}
          />
        ) : null;

      case 'impersonate':
        return <ImpersonateForm onBack={() => setContentType('wallets')} onClose={onClose} />;

      default:
        return (
          <>
            <Dialog.Title className="text-lg font-semibold text-[var(--tuwa-text-primary)]">
              Connect Wallet
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-[var(--tuwa-text-secondary)]">
              Choose your preferred wallet to connect
            </Dialog.Description>

            {walletConnectionError && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500">
                {walletConnectionError}
              </div>
            )}

            <div className="mt-6 space-y-2">
              {groupedConnectors.map((group) => (
                <WalletCard
                  key={group.name}
                  name={group.name}
                  adapters={group.adapters}
                  onSelect={() => handleWalletSelect(group)}
                  isLoading={walletConnecting && selectedWallet === group.name.toLowerCase()}
                />
              ))}

              <button
                onClick={() => setContentType('impersonate')}
                className={cn(
                  'w-full p-4 rounded-xl transition-colors',
                  'bg-[var(--tuwa-bg-secondary)] hover:bg-[var(--tuwa-bg-muted)]',
                  'border border-[var(--tuwa-border-primary)]',
                  'flex items-center justify-between',
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                  <div className="text-left">
                    <div className="font-medium text-[var(--tuwa-text-primary)]">Impersonate Wallet</div>
                    <div className="text-sm text-[var(--tuwa-text-secondary)]">Read-only mode</div>
                  </div>
                </div>
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                  'w-full max-w-md p-6 rounded-2xl shadow-xl',
                  'bg-[var(--tuwa-bg-primary)] border border-[var(--tuwa-border-primary)]',
                )}
              >
                {renderContent()}

                {contentType === 'wallets' && (
                  <Dialog.Close asChild>
                    <button
                      className={cn(
                        'absolute top-4 right-4 p-2 rounded-lg',
                        'text-[var(--tuwa-text-secondary)]',
                        'hover:bg-[var(--tuwa-bg-secondary)]',
                        'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-border-primary)]',
                      )}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </Dialog.Close>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
