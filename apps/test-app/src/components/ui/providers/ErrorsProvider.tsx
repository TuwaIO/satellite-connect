import { ToastCloseButton } from '@tuwaio/nova-transactions';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { useEffect } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';

import { ToastError } from '../components/ToastError';

export function ErrorsProvider() {
  const walletConnectionError = useSatelliteConnectStore((store) => store.walletConnectionError);
  const switchNetworkError = useSatelliteConnectStore((store) => store.switchNetworkError);
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);

  const toastContainerId = 'nova-connect-errors';

  useEffect(() => {
    if (activeWallet?.isConnected) {
      toast.dismiss({ containerId: toastContainerId });
      if (switchNetworkError) {
        toast.error(
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
      }
    } else if (walletConnectionError || switchNetworkError) {
      toast.error(
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
    }
  }, [walletConnectionError, switchNetworkError, activeWallet]);

  return (
    <>
      <ToastContainer
        containerId={toastContainerId}
        position="top-center"
        closeOnClick={false}
        icon={false}
        closeButton={ToastCloseButton}
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
        className="p-0 bg-transparent"
      />
    </>
  );
}
