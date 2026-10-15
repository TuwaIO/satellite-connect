import {
  lastConnectedConnectorHelpers,
  OrbitAdapter,
  recentlyConnectedConnectorsListHelpers,
} from '@tuwaio/orbit-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BaseConnector, SatelliteAdapter } from '../types';
import { createSatelliteConnectStore } from './satelliteConnectStore';

// "Remember this wallet": a wallet the user did not ask to remember is reconnected only until the tab closes
// (sessionStorage); a remembered one until it is disconnected (localStorage), as before.
const createMemoryStorage = (): Storage => {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      items.delete(key);
    },
    setItem: (key, value) => {
      items.set(key, value);
    },
  };
};

const LAST = 'orbit-core:lastConnectedConnector';
const RECENT = 'orbit-core:recentlyConnectedConnectorsListHelpers';
let local: Storage;
let session: Storage;

const adapter = (): SatelliteAdapter<{ name: string }, BaseConnector> => ({
  key: OrbitAdapter.EVM,
  getConnectors: () => ({ adapter: OrbitAdapter.EVM, connectors: [{ name: 'MetaMask' }] }),
  connect: vi.fn(async ({ connectorType, chainId }) => ({
    connectorType,
    chainId,
    address: '0x1234567890123456789012345678901234567890',
    rpcURL: 'https://eth.llamarpc.com',
    isContractAddress: false,
    isConnected: true,
  })),
  disconnect: vi.fn().mockResolvedValue(undefined),
  checkAndSwitchNetwork: vi.fn().mockResolvedValue(undefined),
  getBalance: vi.fn().mockResolvedValue({ value: '1', symbol: 'ETH' }),
  getExplorerUrl: vi.fn().mockReturnValue(undefined),
});

beforeEach(() => {
  local = createMemoryStorage();
  session = createMemoryStorage();
  vi.stubGlobal('window', { localStorage: local, sessionStorage: session });
});
afterEach(() => vi.unstubAllGlobals());

describe('remembering the wallet', () => {
  it('remembers the wallet by default, as before', async () => {
    const store = createSatelliteConnectStore({ adapter: adapter() });
    expect(store.getState().rememberWallet).toBe(true);

    await store.getState().connect({ connectorType: 'evm:metamask', chainId: 1 });

    expect(local.getItem(LAST)).not.toBeNull();
    expect(session.getItem(LAST)).toBeNull();
  });

  it('keeps a wallet that is not remembered in sessionStorage only, with its recent entry', async () => {
    const store = createSatelliteConnectStore({ adapter: adapter(), rememberWallet: false });

    await store.getState().connect({ connectorType: 'evm:metamask', chainId: 1 });

    expect(local.getItem(LAST)).toBeNull();
    expect(JSON.parse(session.getItem(LAST)!)).toMatchObject({ connectorType: 'evm:metamask', chainId: 1 });
    expect(local.getItem(RECENT)).toBeNull();
    expect(recentlyConnectedConnectorsListHelpers.hasConnector('evm:metamask')).toBe(true);
  });

  it('moves the connected wallet when the user changes the choice', async () => {
    const store = createSatelliteConnectStore({ adapter: adapter(), rememberWallet: false });
    await store.getState().connect({ connectorType: 'evm:metamask', chainId: 1 });

    store.getState().setRememberWallet(true);

    expect(store.getState().rememberWallet).toBe(true);
    expect(session.getItem(LAST)).toBeNull();
    expect(JSON.parse(local.getItem(LAST)!)).toMatchObject({ connectorType: 'evm:metamask' });
    expect(JSON.parse(local.getItem(RECENT)!)).toHaveProperty('evm:metamask');

    store.getState().setRememberWallet(false);
    expect(local.getItem(LAST)).toBeNull();
    expect(JSON.parse(local.getItem(RECENT)!)).not.toHaveProperty('evm:metamask');
  });

  it('reconnects after a reload with the choice the connection was saved with', async () => {
    lastConnectedConnectorHelpers.setLastConnectedConnector(
      { connectorType: 'evm:metamask', chainId: 1 },
      { remember: false },
    );
    const evm = adapter();
    const store = createSatelliteConnectStore({ adapter: evm });

    await store.getState().initializeAutoConnect(true);

    expect(evm.connect).toHaveBeenCalledWith({ connectorType: 'evm:metamask', chainId: 1 });
    expect(store.getState().rememberWallet).toBe(false);
    expect(local.getItem(LAST)).toBeNull();
  });
});
