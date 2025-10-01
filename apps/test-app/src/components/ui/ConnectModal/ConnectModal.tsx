import { CloseIcon, cn, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { useEffect, useState } from 'react';

import { networksLinks } from '@/components/ui/utils/networksLinks';

import { AboutWallets } from './AboutWallets';
import { Connecting } from './Connecting';
import { ConnectorsSelections } from './ConnectorsSelections';
import { GetWallet } from './GetWallet';
import { ImpersonatedForm } from './ImpersonatedForm';
import { NetworkSelections } from './NetworkSelections';

type ContentType = 'network' | 'connectors' | 'about' | 'getWallet' | 'connecting' | 'impersonate';

interface ConnectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ConnectModal({ isOpen, setIsOpen }: ConnectModalProps) {
  const getConnectors = useSatelliteConnectStore((store) => store.getConnectors);

  const connectors = getConnectors();
  const isOnlyOneNetwork = Object.keys(connectors).length === 1;

  const [contentType, setContentType] = useState<ContentType>(isOnlyOneNetwork ? 'connectors' : 'network');
  const [selectedAdapter, setSelectedAdapter] = useState<OrbitAdapter | undefined>(
    isOnlyOneNetwork ? (Object.keys(connectors)[0] as OrbitAdapter) : undefined,
  );
  const [activeConnector, setActiveConnector] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      setContentType(isOnlyOneNetwork ? 'connectors' : 'network');
      setSelectedAdapter(isOnlyOneNetwork ? (Object.keys(connectors)[0] as OrbitAdapter) : undefined);
      setActiveConnector(undefined);
    }
  }, [isOpen]);

  const getTitle = () => {
    switch (contentType) {
      case 'about':
        return 'About wallets';
      case 'getWallet':
        return 'Get a wallet';
      case 'connecting':
        return 'Connecting...';
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
        return <ConnectorsSelections />;
      case 'about':
        return <AboutWallets />;
      case 'getWallet':
        return <GetWallet />;
      case 'connecting':
        return <Connecting />;
      case 'impersonate':
        return <ImpersonatedForm />;
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className={cn('max-w-md')}>
        <div className={cn('relative flex w-full flex-col')}>
          <DialogHeader>
            <DialogTitle>
              {contentType === 'connectors' && (
                <button type="button" onClick={() => setContentType('about')}>
                  About
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
                      className="cursor-pointer text-sm font-medium
                         text-[var(--tuwa-text-accent)] transition-opacity hover:opacity-80"
                    >
                      {`<- Back`}
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setContentType(goBackContentType())}
                    className="cursor-pointer text-sm font-medium
                         text-[var(--tuwa-text-accent)] transition-opacity hover:opacity-80"
                  >
                    {`<- Back`}
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
      </DialogContent>
    </Dialog>
  );
}
