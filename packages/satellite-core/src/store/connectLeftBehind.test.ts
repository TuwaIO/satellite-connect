import { ConnectorType, lastConnectedConnectorHelpers, OrbitAdapter } from '@tuwaio/orbit-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BaseConnector, SatelliteAdapter } from '../types';
import { createSatelliteConnectStore } from './satelliteConnectStore';

const METAMASK = 'evm:metamask' as ConnectorType;
const RABBY = 'evm:rabbywallet' as ConnectorType;
const PHANTOM = 'solana:phantom' as ConnectorType;

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

/** A wallet prompt: stays open until the test answers it. */
const promptOf = () => {
  let approve!: () => void;
  let reject!: (error: unknown) => void;
  const answer = new Promise<void>((resolve, rejectPromise) => {
    approve = resolve;
    reject = rejectPromise;
  });
  return { answer, approve, reject };
};

const createAdapter = (key: OrbitAdapter, connectors: { name: string }[]) => {
  const prompts = new Map<ConnectorType, ReturnType<typeof promptOf>>();
  const adapter = {
    key,
    getConnectors: () => ({ adapter: key, connectors }),
    connect: vi.fn(async ({ connectorType }: { connectorType: ConnectorType }) => {
      await prompts.get(connectorType)?.answer;
      return connectionOf(connectorType);
    }),
    disconnect: vi.fn().mockResolvedValue(undefined),
    checkAndSwitchNetwork: vi.fn().mockResolvedValue(undefined),
    getBalance: vi.fn().mockResolvedValue({ value: '1', symbol: 'ETH' }),
    getExplorerUrl: vi.fn().mockReturnValue(undefined),
    switchConnection: vi.fn().mockResolvedValue(undefined),
    checkIsContractAddress: vi.fn().mockResolvedValue(true),
  } satisfies SatelliteAdapter<{ name: string }, BaseConnector>;
  const open = (connectorType: ConnectorType) => {
    const prompt = promptOf();
    prompts.set(connectorType, prompt);
    return prompt;
  };
  return { adapter, open };
};

const lastSaved = () => lastConnectedConnectorHelpers.getLastConnectedConnector()?.connectorType;

describe('a connect left behind by a connect of another wallet', () => {
  const evmWallets = [{ name: 'MetaMask' }, { name: 'Rabby Wallet' }];

  beforeEach(() => {
    vi.stubGlobal('window', { localStorage: createMemoryStorage(), sessionStorage: createMemoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('takes nothing from the wallet chosen later when it answers after it', async () => {
    const { adapter, open } = createAdapter(OrbitAdapter.EVM, evmWallets);
    const callbackAfterConnected = vi.fn();
    const store = createSatelliteConnectStore({ adapter, callbackAfterConnected });
    const rabby = open(RABBY);

    const leftBehind = store.getState().connect({ connectorType: RABBY, chainId: 1 });
    await store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    rabby.approve();
    await leftBehind;

    const state = store.getState();
    expect(state.activeConnection?.connectorType).toBe(METAMASK);
    expect(lastSaved()).toBe(METAMASK);
    expect(callbackAfterConnected).toHaveBeenCalledTimes(1);
    expect(callbackAfterConnected.mock.lastCall?.[0].connectorType).toBe(METAMASK);
    // It is there as a second wallet, and the adapter went back to the wallet that signs
    expect(state.connections[RABBY]?.isContractAddress).toBe(true);
    expect(adapter.switchConnection).toHaveBeenLastCalledWith(METAMASK);
    expect(adapter.disconnect).not.toHaveBeenCalled();
  });

  it('leaves the place and `connecting` to the wallet chosen later when it answers first', async () => {
    const { adapter, open } = createAdapter(OrbitAdapter.EVM, evmWallets);
    const store = createSatelliteConnectStore({ adapter });
    const rabby = open(RABBY);
    const metaMask = open(METAMASK);

    const leftBehind = store.getState().connect({ connectorType: RABBY, chainId: 1 });
    const chosen = store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    rabby.approve();
    await leftBehind;

    expect(store.getState().activeConnection).toBeUndefined();
    expect(store.getState().connecting).toBe(true);

    metaMask.approve();
    await chosen;

    expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
    expect(store.getState().connecting).toBe(false);
    expect(store.getState().connectionError).toBeUndefined();
  });

  it('shows no error of a prompt nobody is looking at', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { adapter, open } = createAdapter(OrbitAdapter.EVM, evmWallets);
    const store = createSatelliteConnectStore({ adapter });
    const rabby = open(RABBY);
    const metaMask = open(METAMASK);

    const leftBehind = store.getState().connect({ connectorType: RABBY, chainId: 1 });
    const chosen = store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    rabby.reject(new Error('User rejected the request'));
    await leftBehind;

    expect(store.getState().connectionError).toBeUndefined();
    expect(store.getState().connecting).toBe(true);
    expect(warn).toHaveBeenCalled();

    metaMask.approve();
    await chosen;
    expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
  });

  it('still shows the error of the wallet chosen last', async () => {
    const { adapter, open } = createAdapter(OrbitAdapter.EVM, evmWallets);
    const store = createSatelliteConnectStore({ adapter });
    const metaMask = open(METAMASK);

    const chosen = store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    metaMask.reject(new Error('User rejected the request'));
    await chosen;

    expect(store.getState().connectionError?.message).toContain('User rejected');
    expect(store.getState().connecting).toBe(false);
  });

  // A double click: the wallet answers the prompt that is open and refuses the second request
  it('does not take a second click on the same wallet for another choice', async () => {
    const { adapter, open } = createAdapter(OrbitAdapter.EVM, evmWallets);
    const store = createSatelliteConnectStore({ adapter });
    const prompt = open(METAMASK);

    const first = store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    const second = store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    prompt.approve();
    await Promise.all([first, second]);

    expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
    expect(lastSaved()).toBe(METAMASK);
    expect(store.getState().connecting).toBe(false);
  });

  // Connecting a wallet of one family changes nothing for the other: Solana has no current connection to go back to
  it('leaves the adapter of another chain family alone', async () => {
    const evm = createAdapter(OrbitAdapter.EVM, evmWallets);
    const solana = createAdapter(OrbitAdapter.SOLANA, [{ name: 'Phantom' }]);
    const store = createSatelliteConnectStore({ adapter: [evm.adapter, solana.adapter] });
    const phantom = solana.open(PHANTOM);

    const leftBehind = store.getState().connect({ connectorType: PHANTOM, chainId: 'devnet' });
    await store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    phantom.approve();
    await leftBehind;

    expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
    expect(store.getState().connections[PHANTOM]).toBeDefined();
    expect(evm.adapter.switchConnection).not.toHaveBeenCalled();
    expect(solana.adapter.switchConnection).not.toHaveBeenCalled();
  });

  // The callback can be a sign-in that waits for the wallet: the wrong wallet was saved under the address of another
  it('saves nothing for a wallet whose callback ends after another wallet was chosen', async () => {
    const { adapter } = createAdapter(OrbitAdapter.EVM, evmWallets);
    const signIn = promptOf();
    const callbackAfterConnected = vi.fn(({ connectorType }: { connectorType: ConnectorType }) =>
      connectorType === RABBY ? signIn.answer : Promise.resolve(),
    );
    const store = createSatelliteConnectStore({ adapter, callbackAfterConnected });

    const first = store.getState().connect({ connectorType: RABBY, chainId: 1 });
    await vi.waitFor(() => expect(callbackAfterConnected).toHaveBeenCalledTimes(1));
    await store.getState().connect({ connectorType: METAMASK, chainId: 1 });
    signIn.approve();
    await first;

    expect(store.getState().activeConnection?.connectorType).toBe(METAMASK);
    expect(lastSaved()).toBe(METAMASK);
    expect(store.getState().connecting).toBe(false);
  });

  describe('a restore of the last visit', () => {
    const lastVisit = () =>
      lastConnectedConnectorHelpers.setLastConnectedConnector({
        connectorType: METAMASK,
        chainId: 1,
        address: 'address of evm:metamask',
      });

    it('gives way to a wallet the user chooses while it runs', async () => {
      lastVisit();
      const { adapter } = createAdapter(OrbitAdapter.EVM, evmWallets);
      const prompt = promptOf();
      const reconnect = vi.fn(async () => {
        await prompt.answer;
        return connectionOf(METAMASK);
      });
      const store = createSatelliteConnectStore({ adapter: { ...adapter, reconnect } });

      const restoring = store.getState().initializeAutoConnect(true);
      await vi.waitFor(() => expect(reconnect).toHaveBeenCalled());
      await store.getState().connect({ connectorType: RABBY, chainId: 1 });
      prompt.approve();
      await restoring;

      expect(store.getState().activeConnection?.connectorType).toBe(RABBY);
      expect(store.getState().connections[METAMASK]).toBeDefined();
      expect(lastSaved()).toBe(RABBY);
      expect(store.getState().isAutoConnectFinished).toBe(true);
    });

    // Its prompt is still open, so the last connection in the storage is still the wallet of the last visit
    it('does not start when the user chose a wallet before it', async () => {
      lastVisit();
      const { adapter, open } = createAdapter(OrbitAdapter.EVM, evmWallets);
      const reconnect = vi.fn(async () => connectionOf(METAMASK));
      const store = createSatelliteConnectStore({ adapter: { ...adapter, reconnect } });
      const rabby = open(RABBY);

      const restoring = store.getState().initializeAutoConnect(true);
      const chosen = store.getState().connect({ connectorType: RABBY, chainId: 1 });
      await restoring;

      expect(reconnect).not.toHaveBeenCalled();

      rabby.approve();
      await chosen;
      expect(store.getState().activeConnection?.connectorType).toBe(RABBY);
      expect(store.getState().isAutoConnectFinished).toBe(true);
    });
  });
});
