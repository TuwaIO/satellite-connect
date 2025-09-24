import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { sepolia } from 'viem/chains';

export function Test() {
  const availableConnectors = useSatelliteConnectStore((state) => state.availableConnectors);
  const connect = useSatelliteConnectStore((state) => state.connect);
  const disconnect = useSatelliteConnectStore((state) => state.disconnect);
  const activeWallet = useSatelliteConnectStore((state) => state.activeWallet);

  console.log('activeWallet', activeWallet);

  return (
    <div>
      {Object.entries(availableConnectors).map((con) => {
        return (
          <div key={con[0]}>
            {con[1].map((connector) => (
              <div
                key={connector.walletType}
                onClick={() =>
                  !activeWallet?.isConnected && connect({ walletType: connector.walletType, chainId: sepolia.id })
                }
              >
                {connector.walletType}
              </div>
            ))}
          </div>
        );
      })}

      <div onClick={disconnect}>Disconnect</div>
    </div>
  );
}
