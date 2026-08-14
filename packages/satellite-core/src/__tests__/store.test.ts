import { ConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import { describe, expect, it, vi } from 'vitest';

import { createSatelliteConnectStore } from '../store/satelliteConnectStore';
import type { BaseConnector, SatelliteAdapter } from '../types';

describe('SatelliteConnectStore', () => {
  const mockAdapter: SatelliteAdapter<{ name: string }, BaseConnector> = {
    key: OrbitAdapter.EVM,
    getConnectors: () => ({
      adapter: OrbitAdapter.EVM,
      connectors: [{ name: 'MetaMask' }],
    }),
    connect: vi.fn().mockResolvedValue({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      address: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      rpcURL: 'https://eth.llamarpc.com',
      isContractAddress: false,
      isConnected: true,
    }),
    disconnect: vi.fn().mockResolvedValue(undefined),
    checkAndSwitchNetwork: vi.fn().mockResolvedValue(undefined),
    getBalance: vi.fn().mockResolvedValue({ value: '1.5', symbol: 'ETH' }),
    getExplorerUrl: vi.fn().mockReturnValue('https://etherscan.io'),
  };

  it('creates store and retrieves connectors', () => {
    const store = createSatelliteConnectStore({ adapter: mockAdapter });
    const connectors = store.getState().getConnectors();

    expect(connectors[OrbitAdapter.EVM]).toHaveLength(1);
    expect(connectors[OrbitAdapter.EVM]?.[0].name).toBe('MetaMask');
  });

  it('connects to connector and updates activeConnection', async () => {
    const store = createSatelliteConnectStore({ adapter: mockAdapter });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    const state = store.getState();
    expect(state.activeConnection?.address).toBe('0x1234567890123456789012345678901234567890');
    expect(state.activeConnection?.isConnected).toBe(true);
  });

  it('disconnects active connector', async () => {
    const store = createSatelliteConnectStore({ adapter: mockAdapter });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    await store.getState().disconnect();

    const state = store.getState();
    expect(state.activeConnection).toBeUndefined();
  });
});
