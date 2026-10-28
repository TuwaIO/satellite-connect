import { lastConnectedConnectorHelpers } from '@tuwaio/orbit-core';
import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import { connect, createConfig, createStorage, getConnections, http, injected, noopStorage } from '@wagmi/core';
import type { EIP1193Provider } from 'viem';
import { base, mainnet } from 'viem/chains';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ConnectorEVM, EVMConnection } from '../types';
import { satelliteEVMAdapter } from './evmAdapter';

// No RPC requests: the store checks every new connection for contract code
vi.mock('../utils/checkIsWalletAddressContract', () => ({
  checkIsWalletAddressContract: vi.fn().mockResolvedValue(false),
}));

// The real store, adapter and wagmi with fake injected wallets that behave like MetaMask: the permission belongs to the
// whole origin, `wallet_revokePermissions` drops it for every tab of the site, and `wallet_requestPermissions` always
// shows a prompt (modelled by granting the permission and logging the call).

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

const PROMPTS = ['wallet_requestPermissions', 'eth_requestAccounts'];

const createWallet = (rdns: string, name: string, address: `0x${string}`) => {
  const wallet = { permitted: true, chainId: 1, log: [] as string[] };
  const listeners = new Map<string, Set<(value: unknown) => void>>();
  const emit = (event: string, value: unknown) => listeners.get(event)?.forEach((listener) => listener(value));
  const provider = {
    async request({ method, params }: { method: string; params?: unknown }) {
      wallet.log.push(method);
      switch (method) {
        case 'eth_accounts':
          return wallet.permitted ? [address] : [];
        case 'eth_requestAccounts':
        case 'wallet_requestPermissions':
          wallet.permitted = true;
          return method === 'eth_requestAccounts'
            ? [address]
            : [{ parentCapability: 'eth_accounts', caveats: [{ type: 'restrictReturnedAccounts', value: [address] }] }];
        case 'eth_chainId':
          return `0x${wallet.chainId.toString(16)}`;
        case 'wallet_revokePermissions':
          wallet.permitted = false;
          emit('accountsChanged', []);
          return null;
        case 'wallet_switchEthereumChain': {
          const [{ chainId }] = params as [{ chainId: `0x${string}` }];
          wallet.chainId = Number.parseInt(chainId, 16);
          emit('chainChanged', chainId);
          return null;
        }
        default:
          throw Object.assign(new Error(`Unsupported method ${method}`), { code: 4200 });
      }
    },
    on(event: string, listener: (value: unknown) => void) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(listener);
    },
    removeListener(event: string, listener: (value: unknown) => void) {
      listeners.get(event)?.delete(listener);
    },
  };
  const connector = injected({ target: () => ({ id: rdns, name, provider: provider as unknown as EIP1193Provider }) });
  return { wallet, connector };
};

const ADDRESS = '0x1111111111111111111111111111111111111111';
const OTHER_ADDRESS = '0x2222222222222222222222222222222222222222';
const RABBY = 'evm:rabbywallet';
const chains = [mainnet, base] as const;
const prompts = (log: string[]) => log.filter((method) => PROMPTS.includes(method));

const setup = () => {
  const metaMask = createWallet('io.metamask', 'MetaMask', ADDRESS);
  const rabby = createWallet('io.rabby', 'Rabby Wallet', OTHER_ADDRESS);
  const config = createConfig({
    chains,
    connectors: [metaMask.connector, rabby.connector],
    transports: { [mainnet.id]: http(), [base.id]: http() },
    storage: createStorage({ storage: noopStorage }),
    multiInjectedProviderDiscovery: false,
  });
  const adapter = satelliteEVMAdapter(config, chains);
  // Another store on the same wagmi config: on the same adapter object (a provider that mounts again) by default
  const createStore = (storeAdapter = adapter) =>
    createSatelliteConnectStore<ConnectorEVM, EVMConnection>({ adapter: storeAdapter });
  const clearLogs = () => {
    metaMask.wallet.log.length = 0;
    rabby.wallet.log.length = 0;
  };
  return {
    metaMask: metaMask.wallet,
    rabby: rabby.wallet,
    config,
    adapter,
    store: createStore(),
    createStore,
    clearLogs,
  };
};

describe('auto-connect with wagmi and injected wallets', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { localStorage: createMemoryStorage(), sessionStorage: createMemoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends no wallet_revokePermissions on start-up when there is nothing to restore', async () => {
    const { metaMask, rabby, store } = setup();

    await store.getState().initializeAutoConnect(true);
    await store.getState().initializeAutoConnect(false);

    expect(metaMask.log).not.toContain('wallet_revokePermissions');
    expect(rabby.log).not.toContain('wallet_revokePermissions');
    // The wallets keep the permission, so other tabs of the site keep their connection
    expect(metaMask.permitted).toBe(true);
    expect(rabby.permitted).toBe(true);
  });

  it('restores the last wallet without disconnecting it and without a permission prompt', async () => {
    const { metaMask, rabby, store, config } = setup();
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: 'evm:metamask', chainId: 1 });

    await store.getState().initializeAutoConnect(true);

    expect(store.getState().connectionError).toBeUndefined();
    expect(store.getState().activeConnection).toMatchObject({
      connectorType: 'evm:metamask',
      address: ADDRESS,
      chainId: 1,
      isConnected: true,
    });
    expect(metaMask.log).not.toContain('wallet_revokePermissions');
    expect(metaMask.log.filter((method) => PROMPTS.includes(method))).toEqual([]);
    expect(rabby.log).toEqual([]);
    expect(getConnections(config).map(({ connector }) => connector.name)).toEqual(['MetaMask']);
  });

  it('restores the last wallet in its last network', async () => {
    const { metaMask, store } = setup();
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: 'evm:metamask', chainId: base.id });

    await store.getState().initializeAutoConnect(true);

    expect(metaMask.log).toContain('wallet_switchEthereumChain');
    expect(metaMask.chainId).toBe(base.id);
    expect(store.getState().activeConnection?.chainId).toBe(base.id);
    expect(lastConnectedConnectorHelpers.getLastConnectedConnector()?.chainId).toBe(base.id);
  });

  it('does not prompt when the last wallet no longer authorizes the app', async () => {
    const { metaMask, store } = setup();
    metaMask.permitted = false; // locked, or the site was disconnected in the wallet
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: 'evm:metamask', chainId: 1 });

    await store.getState().initializeAutoConnect(true);

    expect(metaMask.log.filter((method) => PROMPTS.includes(method))).toEqual([]);
    expect(store.getState().activeConnection).toBeUndefined();
    expect(store.getState().connectionError).toBeUndefined();
    expect(store.getState().isAutoConnectFinished).toBe(true);
  });

  it('keeps the last of two connections an earlier store opened and disconnects only the other one', async () => {
    // A provider that mounts again with autoConnect creates a new store on the same adapter
    const { metaMask, rabby, store, createStore, config, clearLogs } = setup();
    await store.getState().connect({ connectorType: RABBY, chainId: 1 });
    await store.getState().connect({ connectorType: 'evm:metamask', chainId: 1 });
    clearLogs();
    const next = createStore();

    await next.getState().initializeAutoConnect(true);

    expect(rabby.log).toContain('wallet_revokePermissions');
    expect(metaMask.log).not.toContain('wallet_revokePermissions');
    expect(prompts(metaMask.log)).toEqual([]);
    expect(next.getState().activeConnection?.connectorType).toBe('evm:metamask');
    expect(Object.keys(next.getState().connections)).toEqual(['evm:metamask']);
    expect(getConnections(config).map(({ connector }) => connector.name)).toEqual(['MetaMask']);
  });

  // This test used to expect a disconnect of Rabby, which wagmi restored by itself: wagmi's disconnect sends
  // `wallet_revokePermissions`, so Rabby dropped in every tab of the site and prompted on its next connect.
  it('leaves the wallets that wagmi restored by itself authorized, and connects them later without a prompt', async () => {
    // WagmiProvider restored Rabby and MetaMask from the wagmi storage before the store started
    const { metaMask, rabby, store, config, clearLogs } = setup();
    await connect(config, { connector: config.connectors[1] });
    await connect(config, { connector: config.connectors[0] });
    clearLogs();
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: 'evm:metamask', chainId: 1 });

    await store.getState().initializeAutoConnect(true);

    expect(rabby.log).not.toContain('wallet_revokePermissions');
    expect(rabby.permitted).toBe(true);
    expect(prompts(metaMask.log)).toEqual([]);
    expect(Object.keys(store.getState().connections)).toEqual(['evm:metamask']);

    await store.getState().connect({ connectorType: RABBY, chainId: 1 });

    expect(store.getState().connectionError).toBeUndefined();
    expect(store.getState().activeConnection).toMatchObject({ connectorType: RABBY, address: OTHER_ADDRESS });
    expect(prompts(rabby.log)).toEqual([]);
  });

  it('adopts the last wallet when wagmi holds it but another connection is current', async () => {
    const { metaMask, rabby, store, config, clearLogs } = setup();
    await connect(config, { connector: config.connectors[0] });
    await connect(config, { connector: config.connectors[1] }); // Rabby is wagmi's current connection
    clearLogs();
    lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: 'evm:metamask', chainId: 1 });

    await store.getState().initializeAutoConnect(true);

    expect(store.getState().connectionError).toBeUndefined();
    expect(store.getState().activeConnection).toMatchObject({ connectorType: 'evm:metamask', address: ADDRESS });
    expect(metaMask.log).not.toContain('wallet_revokePermissions');
    expect(metaMask.log.filter((method) => PROMPTS.includes(method))).toEqual([]);
    // wagmi restored Rabby by itself: it stays authorized (this test used to expect its disconnect)
    expect(rabby.log).not.toContain('wallet_revokePermissions');
  });

  it('disconnects nothing with autoConnect false, also live wagmi connections', async () => {
    const { metaMask, rabby, store, config, clearLogs } = setup();
    await connect(config, { connector: config.connectors[0] });
    await connect(config, { connector: config.connectors[1] });
    clearLogs();

    await store.getState().initializeAutoConnect(false);

    expect(metaMask.log).not.toContain('wallet_revokePermissions');
    expect(rabby.log).not.toContain('wallet_revokePermissions');
    expect(getConnections(config)).toHaveLength(2);
  });

  it('disconnects the connections of the store on an explicit disconnectAll, but no connector without a connection', async () => {
    const { metaMask, rabby, store, clearLogs } = setup();
    await store.getState().connect({ connectorType: 'evm:metamask', chainId: 1 });
    clearLogs();

    await store.getState().disconnectAll();

    expect(metaMask.log).toContain('wallet_revokePermissions');
    expect(rabby.log).not.toContain('wallet_revokePermissions');
    expect(store.getState().activeConnection).toBeUndefined();
  });

  it('connects a wallet that an earlier store on the same adapter left connected', async () => {
    // A provider that mounts again (a modal) creates a new store on the same wagmi config and adapter
    const { metaMask, store, createStore, clearLogs } = setup();
    await store.getState().connect({ connectorType: 'evm:metamask', chainId: 1 });
    clearLogs();
    const next = createStore();

    await next.getState().initializeAutoConnect(false);
    await next.getState().connect({ connectorType: 'evm:metamask', chainId: 1 });

    expect(next.getState().connectionError).toBeUndefined();
    expect(next.getState().activeConnection).toMatchObject({
      connectorType: 'evm:metamask',
      address: ADDRESS,
      isConnected: true,
    });
    expect(metaMask.log).not.toContain('wallet_revokePermissions');
    expect(prompts(metaMask.log)).toEqual([]);
  });

  it('connects a wallet that wagmi already holds in the requested chain, without a prompt', async () => {
    // WagmiProvider restored MetaMask; the store starts without autoConnect
    const { metaMask, store, config, clearLogs } = setup();
    await connect(config, { connector: config.connectors[0] });
    clearLogs();

    await store.getState().initializeAutoConnect(false);
    await store.getState().connect({ connectorType: 'evm:metamask', chainId: base.id });

    expect(store.getState().connectionError).toBeUndefined();
    expect(store.getState().activeConnection).toMatchObject({ connectorType: 'evm:metamask', chainId: base.id });
    expect(metaMask.log).toContain('wallet_switchEthereumChain');
    expect(prompts(metaMask.log)).toEqual([]);
  });

  it('makes a wallet that wagmi holds, but not as its current connection, current when it is connected', async () => {
    const { metaMask, store, config, clearLogs } = setup();
    await connect(config, { connector: config.connectors[0] });
    await connect(config, { connector: config.connectors[1] }); // Rabby is wagmi's current connection
    clearLogs();

    await store.getState().connect({ connectorType: 'evm:metamask', chainId: 1 });

    expect(store.getState().connectionError).toBeUndefined();
    expect(store.getState().activeConnection).toMatchObject({ connectorType: 'evm:metamask', address: ADDRESS });
    expect(config.state.current).toBe(config.connectors[0].uid);
    expect(prompts(metaMask.log)).toEqual([]);
  });

  it('never disconnects the wallet of another store that has its own adapter on the same wagmi config', async () => {
    const { metaMask, store, createStore, config, clearLogs } = setup();
    await store.getState().connect({ connectorType: 'evm:metamask', chainId: 1 });
    lastConnectedConnectorHelpers.removeLastConnectedConnector();
    clearLogs();
    const other = createStore(satelliteEVMAdapter(config, chains));

    await other.getState().initializeAutoConnect(true);
    await other.getState().disconnectAll();

    expect(metaMask.log).not.toContain('wallet_revokePermissions');
    expect(store.getState().activeConnection?.connectorType).toBe('evm:metamask');
    expect(getConnections(config).map(({ connector }) => connector.name)).toEqual(['MetaMask']);
  });
});
