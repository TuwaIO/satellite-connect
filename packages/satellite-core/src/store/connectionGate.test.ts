import { ConnectorType, lastConnectedConnectorHelpers, OrbitAdapter } from '@tuwaio/orbit-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BaseConnector, SatelliteAdapter } from '../types';
import { createSatelliteConnectStore } from './satelliteConnectStore';

const METAMASK = 'evm:metamask' as ConnectorType;
const RABBY = 'evm:rabbywallet' as ConnectorType;

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

const connectionOf = (connectorType: ConnectorType): BaseConnector => ({
  connectorType,
  address: `address of ${connectorType}`,
  chainId: 1,
  rpcURL: 'https://rpc.example',
  isContractAddress: false,
  isConnected: true,
});

/** A question to a person: stays open until the test answers it. */
const questionOf = () => {
  let pass!: () => void;
  let refuse!: (error: unknown) => void;
  const answer = new Promise<void>((resolve, reject) => {
    pass = resolve;
    refuse = reject;
  });
  return { answer, pass, refuse };
};

const createAdapter = () =>
  ({
    key: OrbitAdapter.EVM,
    getConnectors: () => ({ adapter: OrbitAdapter.EVM, connectors: [{ name: 'MetaMask' }, { name: 'Rabby Wallet' }] }),
    connect: vi.fn(async ({ connectorType }: { connectorType: ConnectorType }) => connectionOf(connectorType)),
    disconnect: vi.fn().mockResolvedValue(undefined),
    checkAndSwitchNetwork: vi.fn().mockResolvedValue(undefined),
    getBalance: vi.fn().mockResolvedValue({ value: '1', symbol: 'ETH' }),
    getExplorerUrl: vi.fn().mockReturnValue(undefined),
    switchConnection: vi.fn().mockResolvedValue(undefined),
  }) satisfies SatelliteAdapter<{ name: string }, BaseConnector>;

const lastSaved = () => lastConnectedConnectorHelpers.getLastConnectedConnector()?.connectorType;

describe('a connection gate', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { localStorage: createMemoryStorage(), sessionStorage: createMemoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // The window closed as connected and the wallet asked for a signature after that, and a refusal took the wallet back
  it('holds the wallet back until it passes', async () => {
    const adapter = createAdapter();
    const callbackAfterConnected = vi.fn();
    const store = createSatelliteConnectStore({ adapter, callbackAfterConnected });
    const question = questionOf();
    const gate = vi.fn(() => question.answer);
    store.getState().setConnectionGate(gate);

    const connecting = store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    await vi.waitFor(() => expect(gate).toHaveBeenCalled());

    expect(gate.mock.lastCall).toEqual([expect.objectContaining({ connectorType: METAMASK }), { isRestore: false }]);
    expect(store.getState().activeConnection).toBeUndefined();
    expect(store.getState().connections).toEqual({});
    expect(store.getState().connecting).toBe(true);
    expect(lastSaved()).toBeUndefined();
    expect(callbackAfterConnected).not.toHaveBeenCalled();

    question.pass();
    await connecting;

    expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
    expect(store.getState().connecting).toBe(false);
    expect(lastSaved()).toBe(METAMASK);
    expect(callbackAfterConnected).toHaveBeenCalledTimes(1);
  });

  it('goes on as if a refused wallet had never connected', async () => {
    const adapter = createAdapter();
    const callbackAfterConnected = vi.fn();
    const store = createSatelliteConnectStore({ adapter, callbackAfterConnected });
    store.getState().setConnectionGate(() => {
      throw new Error('User rejected the signature');
    });

    await store.getState().connect({ connectorType: METAMASK, chainId: 1 });

    const state = store.getState();
    expect(state.activeConnection).toBeUndefined();
    expect(state.connections).toEqual({});
    expect(state.connecting).toBe(false);
    expect(state.connectionError?.message).toContain('rejected');
    expect(lastSaved()).toBeUndefined();
    expect(callbackAfterConnected).not.toHaveBeenCalled();
    expect(adapter.disconnect).toHaveBeenCalledWith(expect.objectContaining({ connectorType: METAMASK }));
  });

  it('leaves the first wallet active when a second is refused', async () => {
    const adapter = createAdapter();
    const store = createSatelliteConnectStore({ adapter });
    await store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    store.getState().setConnectionGate(() => Promise.reject(new Error('User rejected the signature')));

    await store.getState().connect({ connectorType: RABBY, chainId: 1 });

    expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
    expect(store.getState().connections[RABBY]).toBeUndefined();
    expect(lastSaved()).toBe(METAMASK);
    expect(adapter.switchConnection).toHaveBeenLastCalledWith(METAMASK);
  });

  it('survives an update of the parameters, which a provider makes with its own', async () => {
    const adapter = createAdapter();
    const store = createSatelliteConnectStore({ adapter });
    const gate = vi.fn();
    store.getState().setConnectionGate(gate);

    store.getState().updateParameters({ adapter });
    await store.getState().connect({ connectorType: METAMASK, chainId: 1 });

    expect(gate).toHaveBeenCalledTimes(1);
  });

  it('changes nothing without a gate, and after it is removed', async () => {
    const store = createSatelliteConnectStore({ adapter: createAdapter() });
    const gate = vi.fn();
    store.getState().setConnectionGate(gate);
    store.getState().setConnectionGate(undefined);

    await store.getState().connect({ connectorType: METAMASK, chainId: 1 });

    expect(gate).not.toHaveBeenCalled();
    expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
  });

  describe('with a wallet left behind', () => {
    // It signed for a wallet the user had moved on from, and would take the place of the one chosen
    it('drops a wallet that passes after another was chosen', async () => {
      const adapter = createAdapter();
      const store = createSatelliteConnectStore({ adapter });
      const question = questionOf();
      const gate = vi.fn((connection: { connectorType: ConnectorType }) =>
        connection.connectorType === RABBY ? question.answer : undefined,
      );
      store.getState().setConnectionGate(gate);

      const leftBehind = store.getState().connect({ connectorType: RABBY, chainId: 1 });
      await vi.waitFor(() => expect(gate).toHaveBeenCalled());
      await store.getState().connect({ connectorType: METAMASK, chainId: 1 });
      question.pass();
      await leftBehind;

      expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
      expect(store.getState().connections[RABBY]).toBeUndefined();
      expect(adapter.disconnect).toHaveBeenCalledWith(expect.objectContaining({ connectorType: RABBY }));
      expect(store.getState().connectionError).toBeUndefined();
      expect(lastSaved()).toBe(METAMASK);
    });

    it('shows no refusal of a wallet the user moved on from', async () => {
      const store = createSatelliteConnectStore({ adapter: createAdapter() });
      const question = questionOf();
      const gate = vi.fn((connection: { connectorType: ConnectorType }) =>
        connection.connectorType === RABBY ? question.answer : undefined,
      );
      store.getState().setConnectionGate(gate);

      const leftBehind = store.getState().connect({ connectorType: RABBY, chainId: 1 });
      await vi.waitFor(() => expect(gate).toHaveBeenCalled());
      await store.getState().connect({ connectorType: METAMASK, chainId: 1 });
      question.refuse(new Error('User rejected the signature'));
      await leftBehind;

      expect(store.getState().connectionError).toBeUndefined();
    });

    it('asks nothing of a wallet that answers after another was chosen', async () => {
      const adapter = createAdapter();
      const store = createSatelliteConnectStore({ adapter });
      const prompt = questionOf();
      adapter.connect.mockImplementationOnce(async ({ connectorType }) => {
        await prompt.answer;
        return connectionOf(connectorType);
      });
      const gate = vi.fn();
      store.getState().setConnectionGate(gate);

      const leftBehind = store.getState().connect({ connectorType: RABBY, chainId: 1 });
      await store.getState().connect({ connectorType: METAMASK, chainId: 1 });
      prompt.pass();
      await leftBehind;

      expect(gate).toHaveBeenCalledTimes(1);
      expect(gate.mock.lastCall?.[0]).toMatchObject({ connectorType: METAMASK });
      expect(store.getState().connections[RABBY]).toBeUndefined();
    });
  });

  describe('on a restore', () => {
    const lastVisit = () =>
      lastConnectedConnectorHelpers.setLastConnectedConnector({ connectorType: METAMASK, chainId: 1, address: 'x' });

    it('restores a wallet that passes, and says it is a restore', async () => {
      lastVisit();
      const adapter = createAdapter();
      const store = createSatelliteConnectStore({
        adapter: { ...adapter, reconnect: vi.fn(async () => connectionOf(METAMASK)) },
      });
      const gate = vi.fn();
      store.getState().setConnectionGate(gate);

      await store.getState().initializeAutoConnect(true);

      expect(gate.mock.lastCall?.[1]).toEqual({ isRestore: true });
      expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
    });

    // A popup on every page load after a session ended, or a revoked permission of the site
    it('skips a refused wallet with no error and no disconnect, keeping its last connection', async () => {
      lastVisit();
      const adapter = createAdapter();
      const store = createSatelliteConnectStore({
        adapter: { ...adapter, reconnect: vi.fn(async () => connectionOf(METAMASK)) },
      });
      store.getState().setConnectionGate(() => {
        throw new Error('no session');
      });

      await store.getState().initializeAutoConnect(true);

      const state = store.getState();
      expect(state.activeConnection).toBeUndefined();
      expect(state.connections).toEqual({});
      expect(state.connectionError).toBeUndefined();
      expect(state.connecting).toBe(false);
      expect(state.isAutoConnectFinished).toBe(true);
      expect(adapter.disconnect).not.toHaveBeenCalled();
      expect(lastSaved()).toBe(METAMASK);
    });
  });

  describe('on a switch of the active wallet', () => {
    const twoWallets = async () => {
      const adapter = createAdapter();
      const store = createSatelliteConnectStore({ adapter });
      await store.getState().connect({ connectorType: METAMASK, chainId: 1 });
      await store.getState().connect({ connectorType: RABBY, chainId: 1 });
      return { adapter, store };
    };

    it('asks the wallet that takes over, after the adapter has moved to it', async () => {
      const { adapter, store } = await twoWallets();
      const gate = vi.fn(() => {
        expect(adapter.switchConnection).toHaveBeenLastCalledWith(METAMASK);
      });
      store.getState().setConnectionGate(gate);

      await store.getState().switchConnection(METAMASK);

      expect(gate).toHaveBeenCalledTimes(1);
      expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
      expect(lastSaved()).toBe(METAMASK);
    });

    it('stays on the active wallet after a refusal, which it tells', async () => {
      const { adapter, store } = await twoWallets();
      store.getState().setConnectionGate(() => {
        throw new Error('User rejected the signature');
      });

      await store.getState().switchConnection(METAMASK);

      expect(store.getState().activeConnection?.connectorType).toBe(RABBY);
      expect(store.getState().connections[METAMASK]).toBeDefined();
      expect(store.getState().connectionError?.message).toContain('rejected');
      expect(adapter.switchConnection).toHaveBeenLastCalledWith(RABBY);
      expect(lastSaved()).toBe(RABBY);
    });

    it('leaves no active wallet when the one that takes over after a disconnect is refused', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const { store } = await twoWallets();
      store.getState().setConnectionGate(() => {
        throw new Error('User rejected the signature');
      });

      await store.getState().disconnect(RABBY);

      expect(store.getState().activeConnection).toBeUndefined();
      expect(store.getState().connections[METAMASK]).toBeDefined();
    });
  });
});
