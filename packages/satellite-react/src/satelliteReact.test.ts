import { ConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import { useContext } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SatelliteStoreContext, useSatelliteConnectStore } from './hooks/satelliteHook';

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    useContext: vi.fn(),
  };
});

vi.mock('zustand', async () => {
  const actual = await vi.importActual<typeof import('zustand')>('zustand');
  return {
    ...actual,
    useStore: vi.fn((store: any, selector: any) => selector(store.getState())),
  };
});

describe('satellite-react integration', () => {
  const mockEvmAdapter = {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes store and supports selector subscriptions', async () => {
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });

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

  it('throws error when useSatelliteConnectStore is called outside of SatelliteConnectProvider', () => {
    vi.mocked(useContext).mockReturnValue(null);

    expect(() => {
      useSatelliteConnectStore((s) => s.activeConnection);
    }).toThrow('useSatelliteConnectStore must be used within a SatelliteConnectProvider');
  });

  it('returns selected state slice when store context is present', () => {
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });
    vi.mocked(useContext).mockReturnValue(store as any);

    const connecting = useSatelliteConnectStore((s) => s.connecting);
    expect(connecting).toBe(false);

    const connectors = useSatelliteConnectStore((s) => s.getConnectors());
    expect(connectors[OrbitAdapter.EVM]).toHaveLength(1);
  });

  it('creates SatelliteStoreContext with stable identifier', () => {
    expect(SatelliteStoreContext).toBeDefined();
  });
});
