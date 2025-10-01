import { textCenterEllipsis } from '@tuwaio/nova-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

export function ConnectedButtonContent() {
  const wallet = useSatelliteConnectStore((state) => state.activeWallet);

  return (
    <>
      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)]" />
      <span className="font-mono text-[var(--tuwa-text-primary)]">{textCenterEllipsis(wallet?.address, 5, 5)}</span>
      <div className="w-2 h-2 rounded-full bg-[var(--tuwa-success-icon)]" />
    </>
  );
}
