'use client';

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { getWalletTypeFromConnectorName, WalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { sepolia } from 'viem/chains';

export function Test() {
  const availableConnectors = useSatelliteConnectStore((state) => state.availableConnectors);
  const connect = useSatelliteConnectStore((state) => state.connect);
  const disconnect = useSatelliteConnectStore((state) => state.disconnect);
  const activeWallet = useSatelliteConnectStore((state) => state.activeWallet);
  const walletConnectionError = useSatelliteConnectStore((state) => state.walletConnectionError);

  console.log('availableConnectors', availableConnectors);
  console.log(walletConnectionError);

  return (
    <div>
      {Object.entries(availableConnectors).map((con) => {
        return (
          <div key={con[0]}>
            {con[1].map((connector) => (
              <div
                key={getWalletTypeFromConnectorName(con[0] as OrbitAdapter, connector.name)}
                onClick={() =>
                  !activeWallet?.isConnected &&
                  connect({
                    walletType: getWalletTypeFromConnectorName(con[0] as OrbitAdapter, connector.name) as WalletType,
                    chainId: con[0] === OrbitAdapter.EVM ? sepolia.id : 'devnet',
                  })
                }
              >
                {connector.name}
              </div>
            ))}
          </div>
        );
      })}

      <div onClick={disconnect}>Disconnect</div>
    </div>
  );
}
