import {
  ConnectorType,
  formatConnectorName,
  getConnectorTypeFromName,
  lastConnectedConnectorHelpers,
  OrbitAdapter,
} from '@tuwaio/orbit-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BaseConnector, SatelliteAdapter } from '../types';
import { createSatelliteConnectStore } from './satelliteConnectStore';

// Whether the dApp runs in an HTTPS iframe (Safe{Wallet} or another host page).
const frame = vi.hoisted(() => ({ isInSecureIframe: false }));
vi.mock('@tuwaio/orbit-core', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tuwaio/orbit-core')>()),
  get isInSecureIframe() {
    return frame.isInSecureIframe;
  },
}));

/** Connector type the EVM adapter derives from a wagmi connector name. */
const evmConnectorType = (connectorName: string) =>
  getConnectorTypeFromName(OrbitAdapter.EVM, formatConnectorName(connectorName)) as ConnectorType;

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

describe('initializeAutoConnect', () => {
  let evmAdapter: SatelliteAdapter<{ name: string }, BaseConnector>;

  beforeEach(() => {
    frame.isInSecureIframe = false;
    vi.stubGlobal('window', { localStorage: createMemoryStorage() });
    evmAdapter = {
      key: OrbitAdapter.EVM,
      getConnectors: () => ({ adapter: OrbitAdapter.EVM, connectors: [{ name: 'Safe' }] }),
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
      getSafeConnectorChainId: vi.fn().mockResolvedValue(1),
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('connects the Safe connector under the connector type the EVM adapter uses', async () => {
    frame.isInSecureIframe = true;
    const store = createSatelliteConnectStore({ adapter: evmAdapter });

    await store.getState().initializeAutoConnect(false);

    expect(evmAdapter.connect).toHaveBeenCalledWith({ connectorType: evmConnectorType('Safe'), chainId: 1 });
    expect(store.getState().activeConnection?.connectorType).toBe(evmConnectorType('Safe'));
  });

  it('connects the Safe connector inside Safe{Wallet} with autoConnect, instead of the last wallet', async () => {
    frame.isInSecureIframe = true;
    lastConnectedConnectorHelpers.setLastConnectedConnector({
      connectorType: evmConnectorType('MetaMask'),
      chainId: 1,
    });
    vi.mocked(evmAdapter.getSafeConnectorChainId!).mockResolvedValue(100);
    const store = createSatelliteConnectStore({ adapter: evmAdapter });

    await store.getState().initializeAutoConnect(true);

    expect(evmAdapter.connect).toHaveBeenCalledTimes(1);
    expect(evmAdapter.connect).toHaveBeenCalledWith({ connectorType: evmConnectorType('Safe'), chainId: 100 });
  });

  it('treats a rejected Safe chain lookup as "not inside Safe{Wallet}"', async () => {
    // The Safe connector of wagmi rejects when the parent window does not answer as Safe{Wallet}
    frame.isInSecureIframe = true;
    vi.mocked(evmAdapter.getSafeConnectorChainId!).mockRejectedValue(new Error('timed out'));
    lastConnectedConnectorHelpers.setLastConnectedConnector({
      connectorType: evmConnectorType('MetaMask'),
      chainId: 1,
    });

    await expect(
      createSatelliteConnectStore({ adapter: evmAdapter }).getState().initializeAutoConnect(false),
    ).resolves.toBeUndefined();
    expect(evmAdapter.connect).not.toHaveBeenCalled();

    await createSatelliteConnectStore({ adapter: evmAdapter }).getState().initializeAutoConnect(true);
    expect(evmAdapter.connect).toHaveBeenCalledWith({ connectorType: evmConnectorType('MetaMask'), chainId: 1 });
  });

  it('does not ask the Safe connector outside an iframe', async () => {
    const store = createSatelliteConnectStore({ adapter: evmAdapter });

    await store.getState().initializeAutoConnect(false);

    expect(evmAdapter.getSafeConnectorChainId).not.toHaveBeenCalled();
    expect(evmAdapter.connect).not.toHaveBeenCalled();
  });

  it('skips a saved wallet of a chain family without an adapter', async () => {
    // For example, a Solana wallet saved by another app on the same origin (localhost)
    lastConnectedConnectorHelpers.setLastConnectedConnector({
      connectorType: `${OrbitAdapter.SOLANA}:phantom`,
      chainId: 'mainnet',
    });
    const store = createSatelliteConnectStore({ adapter: evmAdapter });

    await store.getState().initializeAutoConnect(true);

    expect(evmAdapter.connect).not.toHaveBeenCalled();
    expect(store.getState().connectionError).toBeUndefined();
    expect(lastConnectedConnectorHelpers.getLastConnectedConnector()?.connectorType).toBe(
      `${OrbitAdapter.SOLANA}:phantom`,
    );
  });

  it('does not pass a connector type to the adapter of another chain family', async () => {
    for (const adapter of [evmAdapter, [evmAdapter]]) {
      const store = createSatelliteConnectStore({ adapter });

      await store.getState().connect({ connectorType: `${OrbitAdapter.SOLANA}:phantom`, chainId: 'mainnet' });

      expect(evmAdapter.connect).not.toHaveBeenCalled();
      expect(store.getState().connecting).toBe(false);
      expect(store.getState().connectionError?.message).toBe('No adapter found for connector type: solana:phantom');
    }
  });

  it('does not reconnect Base Account (Coinbase) automatically', async () => {
    lastConnectedConnectorHelpers.setLastConnectedConnector({
      connectorType: evmConnectorType('Base Account'),
      chainId: 8453,
    });
    const store = createSatelliteConnectStore({ adapter: evmAdapter });

    await store.getState().initializeAutoConnect(true);

    expect(evmAdapter.connect).not.toHaveBeenCalled();
  });

  it('reconnects the last connected injected wallet', async () => {
    lastConnectedConnectorHelpers.setLastConnectedConnector({
      connectorType: evmConnectorType('MetaMask'),
      chainId: 1,
    });
    const store = createSatelliteConnectStore({ adapter: evmAdapter });

    await store.getState().initializeAutoConnect(true);

    expect(evmAdapter.connect).toHaveBeenCalledWith({ connectorType: evmConnectorType('MetaMask'), chainId: 1 });
  });

  it('saves the chain the wallet is connected to, not the requested one', async () => {
    vi.mocked(evmAdapter.connect).mockImplementationOnce(async ({ connectorType }) => ({
      connectorType,
      chainId: 10, // the wallet stayed on another chain
      address: '0x1234567890123456789012345678901234567890',
      rpcURL: 'https://mainnet.optimism.io',
      isContractAddress: false,
      isConnected: true,
    }));
    evmAdapter.checkIsContractAddress = vi.fn().mockResolvedValue(false);
    const store = createSatelliteConnectStore({ adapter: evmAdapter });

    await store.getState().connect({ connectorType: evmConnectorType('MetaMask'), chainId: 1 });

    expect(evmAdapter.checkIsContractAddress).toHaveBeenCalledWith({
      address: '0x1234567890123456789012345678901234567890',
      chainId: 10,
    });
    expect(lastConnectedConnectorHelpers.getLastConnectedConnector()).toEqual({
      connectorType: evmConnectorType('MetaMask'),
      chainId: 10,
      address: '0x1234567890123456789012345678901234567890',
    });
  });

  it('saves the Solana cluster in the form normalized by the adapter', async () => {
    const solanaAdapter: SatelliteAdapter<{ name: string }, BaseConnector> = {
      ...evmAdapter,
      key: OrbitAdapter.SOLANA,
      connect: vi.fn(async ({ connectorType }) => ({
        connectorType,
        chainId: 'devnet',
        address: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
        rpcURL: 'https://api.devnet.solana.com',
        isContractAddress: false,
        isConnected: true,
      })),
    };
    const store = createSatelliteConnectStore({ adapter: solanaAdapter });

    await store.getState().connect({ connectorType: `${OrbitAdapter.SOLANA}:phantom`, chainId: 'solana:devnet' });

    expect(lastConnectedConnectorHelpers.getLastConnectedConnector()?.chainId).toBe('devnet');
  });
});
