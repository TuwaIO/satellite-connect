import { CloseIcon, cn, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@tuwaio/nova-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

interface ConnectedModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ConnectedModal({ isOpen, setIsOpen }: ConnectedModalProps) {
  const disconnect = useSatelliteConnectStore((store) => store.disconnect);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className={cn('max-w-md')}>
        <div className={cn('relative flex w-full flex-col')}>
          <DialogHeader>
            <DialogTitle>Connected</DialogTitle>

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

          <main className="flex flex-col gap-4 p-4">
            <h1>Hello</h1>
          </main>

          <footer
            className="flex w-full items-center justify-between
                       border-t border-[var(--tuwa-border-primary)] p-4"
          >
            <button
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
            >
              Disconnect
            </button>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
