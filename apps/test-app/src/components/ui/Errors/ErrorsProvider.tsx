import { ToastCloseButton } from '@tuwaio/nova-transactions';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { ToastError } from '@/components/ui/Errors/ToastError';

export function ErrorsProvider() {
  const walletConnectionError = useSatelliteConnectStore((store) => store.walletConnectionError);
  const switchNetworkError = useSatelliteConnectStore((store) => store.switchNetworkError);

  const toastContainerId = 'satellite-connect-errors';

  useEffect(() => {
    if (!walletConnectionError && !switchNetworkError) return;
    toast(
      <ToastError
        title={
          walletConnectionError ? 'Wallet connection error' : switchNetworkError ? 'Error when chain switching' : ''
        }
        rawError={walletConnectionError || switchNetworkError || ''}
      />,
      {
        containerId: toastContainerId,
      },
    );
  }, [walletConnectionError, switchNetworkError]);

  return (
    <>
      <ToastContainer
        position="top-center"
        closeOnClick={false}
        icon={false}
        closeButton={ToastCloseButton}
        containerId={toastContainerId}
      />
    </>
  );
}
