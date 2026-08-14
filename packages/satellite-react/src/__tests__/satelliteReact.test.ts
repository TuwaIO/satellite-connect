import { ConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import { describe, expect, it, vi } from 'vitest';

describe('satellite-react store integration', () => {
  const mockAdapter = {
    key: OrbitAdapter.EVM,
    getConnectors: () => ({
      adapter: OrbitAdapter.EVM,
      connectors: [{ name: 'MetaMask' }],
    }),
    connect: vi.fn().mockResolvedValue({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      address: '0x1111111111111111111111111111111111111111',
      chainId: 1,
      rpcURL: 'https://eth.llamarpc.com',
      isContractAddress: false,
      isConnected: true,
    }),
    disconnect: vi.fn().mockResolvedValue(undefined),
    checkAndSwitchNetwork: vi.fn().mockResolvedValue(undefined),
    getBalance: vi.fn().mockResolvedValue({ value: '1.0', symbol: 'ETH' }),
    getExplorerUrl: vi.fn().mockReturnValue('https://etherscan.io'),
  };

  it('initializes store and supports selector subscriptions', async () => {
    const store = createSatelliteConnectStore({ adapter: mockAdapter });

    let latestAddress: string | undefined;
    const unsubscribe = store.subscribe((state) => {
      latestAddress = state.activeConnection?.address;
    });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    expect(latestAddress).toBe('0x1111111111111111111111111111111111111111');
    expect(store.getState().activeConnection?.isConnected).toBe(true);

    await store.getState().disconnect();
    expect(store.getState().activeConnection).toBeUndefined();

    unsubscribe();
  });
});
