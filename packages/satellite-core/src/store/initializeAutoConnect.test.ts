import {
  ConnectorType,
  formatConnectorName,
  getConnectorTypeFromName,
  impersonatedHelpers,
  lastConnectedConnectorHelpers,
  OrbitAdapter,
  recentlyConnectedConnectorsListHelpers,
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
      getConnectors: () => ({ adapter: OrbitAdapter.EVM, connectors: [{ name: 'Safe' }, { name: 'MetaMask' }] }),
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

  it('reports when auto-connect has finished', async () => {
    lastConnectedConnectorHelpers.setLastConnectedConnector({
      connectorType: evmConnectorType('MetaMask'),
      chainId: 1,
    });
    const store = createSatelliteConnectStore({ adapter: evmAdapter });
    expect(store.getState().isAutoConnectFinished).toBe(false);

    const autoConnect = store.getState().initializeAutoConnect(true);
    expect(store.getState().isAutoConnectFinished).toBe(false);
    await autoConnect;

    expect(store.getState().isAutoConnectFinished).toBe(true);
    expect(store.getState().activeConnection?.connectorType).toBe(evmConnectorType('MetaMask'));
  });

  it('reports auto-connect as finished when it rejects', async () => {
    vi.stubGlobal('window', {
      get localStorage(): Storage {
        throw new Error('Storage is blocked');
      },
    });
    const store = createSatelliteConnectStore({ adapter: evmAdapter });

    await expect(store.getState().initializeAutoConnect(true)).rejects.toThrow('Storage is blocked');
    expect(store.getState().isAutoConnectFinished).toBe(true);
  });

  it('waits for the last of overlapping auto-connect calls', async () => {
    // React Strict Mode runs the effect twice: the second call is still listing the live connections when the first
    // one ends. (This test used to hold the second call in `disconnect`; the start-up no longer disconnects every
    // wallet of the adapters, so it is held where the start-up now waits. The first call stops after its 300 ms
    // because a later call started, so the only listing is the second call's.)
    let releaseSecondCall: () => void = () => undefined;
    evmAdapter.getLiveConnections = vi.fn(
      () => new Promise<BaseConnector[]>((resolve) => (releaseSecondCall = () => resolve([]))),
    );
    const store = createSatelliteConnectStore({ adapter: evmAdapter });

    const firstCall = store.getState().initializeAutoConnect(true);
    const secondCall = store.getState().initializeAutoConnect(true);
    await firstCall;
    expect(store.getState().isAutoConnectFinished).toBe(false);
    await vi.waitFor(() => expect(evmAdapter.getLiveConnections).toHaveBeenCalledTimes(1));
    expect(store.getState().isAutoConnectFinished).toBe(false);

    releaseSecondCall();
    await secondCall;
    expect(store.getState().isAutoConnectFinished).toBe(true);
  });

  it('restores the last wallet once when auto-connect calls overlap', async () => {
    lastConnectedConnectorHelpers.setLastConnectedConnector({
      connectorType: evmConnectorType('MetaMask'),
      chainId: 1,
    });
    const store = createSatelliteConnectStore({ adapter: evmAdapter });

    await Promise.all([store.getState().initializeAutoConnect(true), store.getState().initializeAutoConnect(true)]);

    expect(evmAdapter.connect).toHaveBeenCalledTimes(1);
    expect(store.getState().activeConnection?.connectorType).toBe(evmConnectorType('MetaMask'));
    expect(store.getState().connectionError).toBeUndefined();
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

  it('waits up to 1.5 s for the last wallet to register, then reconnects it', async () => {
    // Wallet Standard and EIP-6963 wallets register after the page loads
    vi.useFakeTimers();
    try {
      let registered = false;
      setTimeout(() => (registered = true), 800);
      evmAdapter.getConnectors = () => ({
        adapter: OrbitAdapter.EVM,
        connectors: registered ? [{ name: 'Phantom' }] : [],
      });
      const connect = evmAdapter.connect;
      // Like the adapters: a wallet that is not registered yet cannot be connected
      evmAdapter.connect = vi.fn(async (params) => {
        if (!registered) throw new Error('Cannot find connector with this wallet type');
        return connect(params);
      });
      lastConnectedConnectorHelpers.setLastConnectedConnector({
        connectorType: evmConnectorType('Phantom'),
        chainId: 1,
      });
      const store = createSatelliteConnectStore({ adapter: evmAdapter });

      const autoConnect = store.getState().initializeAutoConnect(true);
      await vi.advanceTimersByTimeAsync(1500);
      await autoConnect;

      expect(evmAdapter.connect).toHaveBeenCalledWith({ connectorType: evmConnectorType('Phantom'), chainId: 1 });
      expect(store.getState().connectionError).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('forgets a last wallet that is no longer installed, without an error, and keeps it among the recent ones', async () => {
    vi.useFakeTimers();
    try {
      const rabby = evmConnectorType('Rabby');
      lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: rabby, chainId: 1 });
      recentlyConnectedConnectorsListHelpers.addConnector(rabby, { address: '0x1', disconnectedTimestamp: Date.now() });
      const store = createSatelliteConnectStore({ adapter: evmAdapter });

      const autoConnect = store.getState().initializeAutoConnect(true);
      await vi.advanceTimersByTimeAsync(3000);
      await autoConnect;

      expect(evmAdapter.connect).not.toHaveBeenCalled();
      expect(store.getState().connectionError).toBeUndefined();
      expect(store.getState().isAutoConnectFinished).toBe(true);
      expect(lastConnectedConnectorHelpers.getLastConnectedConnector()).toBeUndefined();
      expect(recentlyConnectedConnectorsListHelpers.getConnector(rabby)).toBeDefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('reconnects at once when the adapter has connectors without a name to check', async () => {
    const customAdapter = {
      ...evmAdapter,
      getConnectors: () => ({
        adapter: OrbitAdapter.EVM,
        connectors: [{ id: 'custom' } as unknown as { name: string }],
      }),
    };
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: evmConnectorType('Custom'), chainId: 1 });

    await createSatelliteConnectStore({ adapter: customAdapter }).getState().initializeAutoConnect(true);

    expect(evmAdapter.connect).toHaveBeenCalledWith({ connectorType: evmConnectorType('Custom'), chainId: 1 });
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

// A wallet such as MetaMask keeps one permission for the whole origin, and a disconnect revokes it: the start-up must
// leave alone every wallet this page does not hold, and keep the last active one connected.
describe('initializeAutoConnect without a blind disconnect', () => {
  const METAMASK = evmConnectorType('MetaMask');
  const RABBY = evmConnectorType('Rabby Wallet');
  const PHANTOM = `${OrbitAdapter.SOLANA}:phantom` as ConnectorType;

  const connectionOf = (connectorType: ConnectorType, chainId: number | string = 1): BaseConnector => ({
    connectorType,
    chainId,
    address: connectorType === PHANTOM ? '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d' : `0x${'1'.repeat(40)}`,
    rpcURL: 'https://rpc.example',
    isContractAddress: false,
    isConnected: true,
  });

  const createAdapter = (
    key: OrbitAdapter,
    names: string[],
    live: BaseConnector[] = [],
  ): SatelliteAdapter<{ name: string }, BaseConnector> => ({
    key,
    getConnectors: () => ({ adapter: key, connectors: names.map((name) => ({ name })) }),
    connect: vi.fn(async ({ connectorType, chainId }) => connectionOf(connectorType, chainId)),
    reconnect: vi.fn(async ({ connectorType, chainId }) => connectionOf(connectorType, chainId)),
    getLiveConnections: vi.fn(async () => live),
    disconnect: vi.fn().mockResolvedValue(undefined),
    checkAndSwitchNetwork: vi.fn().mockResolvedValue(undefined),
    getBalance: vi.fn().mockResolvedValue({ value: '1', symbol: 'ETH' }),
    getExplorerUrl: vi.fn().mockReturnValue(undefined),
  });

  beforeEach(() => {
    frame.isInSecureIframe = false;
    vi.stubGlobal('window', { localStorage: createMemoryStorage(), sessionStorage: createMemoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('disconnects nothing with autoConnect false', async () => {
    const adapter = createAdapter(OrbitAdapter.EVM, ['MetaMask', 'Rabby Wallet'], [connectionOf(RABBY)]);
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: METAMASK, chainId: 1 });
    const store = createSatelliteConnectStore({ adapter });

    await store.getState().initializeAutoConnect(false);

    expect(adapter.disconnect).not.toHaveBeenCalled();
    expect(adapter.connect).not.toHaveBeenCalled();
    expect(adapter.reconnect).not.toHaveBeenCalled();
    expect(store.getState().isAutoConnectFinished).toBe(true);
  });

  it('does not ask the adapters to disconnect wallets they do not hold when there is nothing to restore', async () => {
    const evm = createAdapter(OrbitAdapter.EVM, ['MetaMask']);
    const solana = createAdapter(OrbitAdapter.SOLANA, ['Phantom']);
    const store = createSatelliteConnectStore({ adapter: [evm, solana] });

    await store.getState().initializeAutoConnect(true);

    expect(evm.disconnect).not.toHaveBeenCalled();
    expect(solana.disconnect).not.toHaveBeenCalled();
  });

  it('restores the last wallet without a prompt and without disconnecting it first', async () => {
    const adapter = createAdapter(OrbitAdapter.EVM, ['MetaMask']);
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: METAMASK, chainId: 8453 });
    const store = createSatelliteConnectStore({ adapter });

    await store.getState().initializeAutoConnect(true);

    expect(adapter.disconnect).not.toHaveBeenCalled();
    expect(adapter.reconnect).toHaveBeenCalledWith({ connectorType: METAMASK, chainId: 8453 });
    expect(adapter.connect).not.toHaveBeenCalled();
    expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
    expect(lastConnectedConnectorHelpers.getLastConnectedConnector()).toMatchObject({
      connectorType: METAMASK,
      chainId: 8453,
    });
  });

  it('keeps the last wallet the adapter already holds and disconnects only its other live connections', async () => {
    // For example, an earlier store on the same adapter connected MetaMask and Rabby (a provider that mounts again)
    const adapter = createAdapter(
      OrbitAdapter.EVM,
      ['MetaMask', 'Rabby Wallet'],
      [connectionOf(METAMASK), connectionOf(RABBY, 10)],
    );
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: METAMASK, chainId: 1 });
    const store = createSatelliteConnectStore({ adapter });

    await store.getState().initializeAutoConnect(true);

    expect(adapter.disconnect).toHaveBeenCalledTimes(1);
    expect(adapter.disconnect).toHaveBeenCalledWith(expect.objectContaining({ connectorType: RABBY }));
    expect(adapter.reconnect).toHaveBeenCalledWith({ connectorType: METAMASK, chainId: 1 });
    expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
    expect(Object.keys(store.getState().connections)).toEqual([METAMASK]);
  });

  it('disconnects the connections of the store except the last active one, across chain families', async () => {
    const evm = createAdapter(OrbitAdapter.EVM, ['MetaMask']);
    const solana = createAdapter(OrbitAdapter.SOLANA, ['Phantom']);
    const store = createSatelliteConnectStore({ adapter: [evm, solana] });
    await store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    await store.getState().connect({ connectorType: PHANTOM, chainId: 'devnet' });
    vi.mocked(solana.connect).mockClear();

    await store.getState().initializeAutoConnect(true);

    expect(evm.disconnect).toHaveBeenCalledTimes(1);
    expect(evm.disconnect).toHaveBeenCalledWith(expect.objectContaining({ connectorType: METAMASK }));
    expect(solana.disconnect).not.toHaveBeenCalled();
    expect(solana.connect).not.toHaveBeenCalled();
    expect(store.getState().activeConnection?.connectorType).toBe(PHANTOM);
    expect(Object.keys(store.getState().connections)).toEqual([PHANTOM]);
  });

  it('skips the last wallet without a prompt or an error when it no longer authorizes the app', async () => {
    // A locked wallet, or one whose permission was revoked in the wallet
    const adapter = createAdapter(OrbitAdapter.EVM, ['MetaMask']);
    vi.mocked(adapter.reconnect!).mockResolvedValue(undefined);
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: METAMASK, chainId: 1 });
    const store = createSatelliteConnectStore({ adapter });

    await store.getState().initializeAutoConnect(true);

    expect(adapter.connect).not.toHaveBeenCalled();
    expect(store.getState().activeConnection).toBeUndefined();
    expect(store.getState().connecting).toBe(false);
    expect(store.getState().connectionError).toBeUndefined();
    expect(store.getState().isAutoConnectFinished).toBe(true);
    // Kept, so a later page load restores the wallet once it authorizes the app again
    expect(lastConnectedConnectorHelpers.getLastConnectedConnector()?.connectorType).toBe(METAMASK);
  });

  it('stores the error of a failed restore', async () => {
    const adapter = createAdapter(OrbitAdapter.EVM, ['MetaMask']);
    vi.mocked(adapter.reconnect!).mockRejectedValue(new Error('Provider is gone'));
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: METAMASK, chainId: 1 });
    const store = createSatelliteConnectStore({ adapter });

    await store.getState().initializeAutoConnect(true);

    expect(store.getState().connectionError?.message).toBe('Provider is gone');
    expect(store.getState().isAutoConnectFinished).toBe(true);
  });

  // This test used to expect a disconnect of the WalletConnect connection too. It is the last active wallet: a disconnect
  // would end its WalletConnect session, although only its automatic restore is skipped.
  it('keeps the live connection of a last wallet that is never restored automatically', async () => {
    const WALLET_CONNECT = evmConnectorType('WalletConnect');
    const adapter = createAdapter(
      OrbitAdapter.EVM,
      ['WalletConnect', 'Rabby Wallet'],
      [connectionOf(WALLET_CONNECT), connectionOf(RABBY)],
    );
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: WALLET_CONNECT, chainId: 1 });
    const store = createSatelliteConnectStore({ adapter });

    await store.getState().initializeAutoConnect(true);

    expect(adapter.disconnect).toHaveBeenCalledTimes(1);
    expect(adapter.disconnect).toHaveBeenCalledWith(expect.objectContaining({ connectorType: RABBY }));
    expect(adapter.reconnect).not.toHaveBeenCalled();
    expect(adapter.connect).not.toHaveBeenCalled();
  });

  it('removes the impersonated address on start-up, also with autoConnect false', async () => {
    impersonatedHelpers.setImpersonated('0x0000000000000000000000000000000000000001');
    const store = createSatelliteConnectStore({ adapter: createAdapter(OrbitAdapter.EVM, ['MetaMask']) });

    await store.getState().initializeAutoConnect(false);

    expect(impersonatedHelpers.getImpersonated()).toBeFalsy();
  });

  it('keeps a live Safe connection inside Safe{Wallet} instead of connecting it again', async () => {
    frame.isInSecureIframe = true;
    const SAFE = evmConnectorType('Safe');
    const adapter = {
      ...createAdapter(OrbitAdapter.EVM, ['Safe', 'MetaMask'], [connectionOf(SAFE, 100), connectionOf(METAMASK)]),
      getSafeConnectorChainId: vi.fn().mockResolvedValue(100),
    };
    const store = createSatelliteConnectStore({ adapter });

    await store.getState().initializeAutoConnect(false);

    expect(adapter.reconnect).toHaveBeenCalledWith({ connectorType: SAFE, chainId: 100 });
    expect(adapter.connect).not.toHaveBeenCalled();
    expect(adapter.disconnect).toHaveBeenCalledTimes(1);
    expect(adapter.disconnect).toHaveBeenCalledWith(expect.objectContaining({ connectorType: METAMASK }));
    expect(store.getState().activeConnection?.connectorType).toBe(SAFE);
  });

  it('connects the Safe connector when it cannot be restored without a request', async () => {
    frame.isInSecureIframe = true;
    const SAFE = evmConnectorType('Safe');
    const adapter = {
      ...createAdapter(OrbitAdapter.EVM, ['Safe']),
      getSafeConnectorChainId: vi.fn().mockResolvedValue(100),
    };
    vi.mocked(adapter.reconnect!).mockResolvedValue(undefined);
    const store = createSatelliteConnectStore({ adapter });

    await store.getState().initializeAutoConnect(false);

    expect(adapter.connect).toHaveBeenCalledWith({ connectorType: SAFE, chainId: 100 });
    expect(store.getState().activeConnection?.connectorType).toBe(SAFE);
  });
});

describe('disconnectAll', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { localStorage: createMemoryStorage(), sessionStorage: createMemoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('disconnects every connection the store holds, then what each adapter still holds', async () => {
    const connection = (connectorType: ConnectorType): BaseConnector => ({
      connectorType,
      chainId: 1,
      address: `0x${'2'.repeat(40)}`,
      rpcURL: 'https://rpc.example',
      isContractAddress: false,
      isConnected: true,
    });
    const adapter: SatelliteAdapter<{ name: string }, BaseConnector> = {
      key: OrbitAdapter.EVM,
      getConnectors: () => ({
        adapter: OrbitAdapter.EVM,
        connectors: [{ name: 'MetaMask' }, { name: 'Rabby Wallet' }],
      }),
      connect: vi.fn(async ({ connectorType }) => connection(connectorType)),
      disconnect: vi.fn().mockResolvedValue(undefined),
      checkAndSwitchNetwork: vi.fn().mockResolvedValue(undefined),
      getBalance: vi.fn().mockResolvedValue({ value: '1', symbol: 'ETH' }),
      getExplorerUrl: vi.fn().mockReturnValue(undefined),
    };
    const store = createSatelliteConnectStore({ adapter });
    await store.getState().connect({ connectorType: evmConnectorType('MetaMask'), chainId: 1 });
    await store.getState().connect({ connectorType: evmConnectorType('Rabby Wallet'), chainId: 1 });

    await store.getState().disconnectAll();

    expect(adapter.disconnect).toHaveBeenCalledWith(
      expect.objectContaining({ connectorType: evmConnectorType('MetaMask') }),
    );
    expect(adapter.disconnect).toHaveBeenCalledWith(
      expect.objectContaining({ connectorType: evmConnectorType('Rabby Wallet') }),
    );
    expect(adapter.disconnect).toHaveBeenLastCalledWith();
    expect(store.getState().connections).toEqual({});
    expect(store.getState().activeConnection).toBeUndefined();
  });
});
