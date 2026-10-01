import { createEVMConnectionsWatcher } from '@tuwaio/satellite-evm';
import { createSolanaConnectionsWatcher } from '@tuwaio/satellite-solana';
import { type Config, hydrate } from '@wagmi/core';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EVMConnectorsWatcher } from './evm/EVMConnectorsWatcher';
import { SolanaConnectorsWatcher } from './solana/SolanaConnectorsWatcher';
import { harness } from './testing/hookHarness';

vi.mock('react', async (importOriginal) => {
  const { harness } = await import('./testing/hookHarness');
  return {
    ...(await importOriginal<typeof import('react')>()),
    useState: harness.useState,
    useMemo: harness.useMemo,
    useEffect: harness.useEffect,
    useEffectEvent: harness.useEffectEvent,
    useContext: harness.useContext,
  };
});

const store = vi.hoisted(() => ({
  state: {
    activeConnection: undefined as { connectorType: string } | undefined,
    connectionError: undefined,
    disconnect: () => Promise.resolve(),
    updateActiveConnection: () => undefined,
  },
}));

vi.mock('./hooks/satelliteHook', () => ({
  SatelliteStoreContext: {},
  useSatelliteConnectStore: (selector: (state: typeof store.state) => unknown) => selector(store.state),
}));

const unwatch = vi.hoisted(() => ({ evm: vi.fn(), solana: vi.fn() }));
const wallets = vi.hoisted(() => [] as unknown[]);

vi.mock('@tuwaio/satellite-evm', () => ({ createEVMConnectionsWatcher: vi.fn(() => unwatch.evm) }));
vi.mock('@tuwaio/satellite-solana', () => ({ createSolanaConnectionsWatcher: vi.fn(() => unwatch.solana) }));
vi.mock('@wallet-standard/react', () => ({ useWallets: () => wallets }));

const onMount = vi.hoisted(() => ({ fn: vi.fn(() => Promise.resolve()) }));
vi.mock('@wagmi/core', () => ({ hydrate: vi.fn(() => ({ onMount: onMount.fn })) }));

/** A wagmi config with the parts of `_internal` the watcher reads, and a way to start its hydration elsewhere. */
function createWagmiConfig({ ssr = true, hydrated = false, storage = true } = {}) {
  const hydrationListeners = new Set<() => void>();
  const persist = {
    hasHydrated: () => hydrated,
    onHydrate: (listener: () => void) => {
      hydrationListeners.add(listener);
      return () => hydrationListeners.delete(listener);
    },
  };
  const config = { _internal: { ssr, store: storage ? { persist } : {} } } as unknown as Config;
  // What `WagmiProvider` does: its `hydrate(...).onMount()` starts the rehydration of the persist store
  const hydrateElsewhere = () => hydrationListeners.forEach((listener) => listener());
  return { config, hydrateElsewhere };
}

const wagmiConfig = createWagmiConfig({ ssr: false }).config;
const signedOut = () => ({ status: 'idle', session: null, error: null, isAuthenticated: false });
const signedIn = () => ({
  status: 'authenticated',
  session: { address: 'eip155:1:0x1234567890123456789012345678901234567890', chainId: 'eip155:1' },
  error: null,
  isAuthenticated: true,
});

describe('connectors watchers', () => {
  beforeEach(() => {
    harness.unmount();
    vi.clearAllMocks();
    store.state.activeConnection = { connectorType: 'evm:metamask' };
    harness.setContextValue({ getState: () => store.state });
  });

  it('lets the EVM watcher read the current store state', async () => {
    harness.render((<EVMConnectorsWatcher wagmiConfig={wagmiConfig} />) as ReactElement);
    await harness.settle();

    const { getState } = vi.mocked(createEVMConnectionsWatcher).mock.calls[0][1];
    store.state.activeConnection = { connectorType: 'evm:rabby' };

    expect(getState?.().activeConnection).toEqual({ connectorType: 'evm:rabby' });
  });

  it('restarts the EVM watcher with the latest SIWX state', async () => {
    harness.render((<EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={signedOut()} />) as ReactElement);
    await harness.settle();
    expect(createEVMConnectionsWatcher).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createEVMConnectionsWatcher).mock.calls[0][0].siwx).toMatchObject({ isAuthenticated: false });

    harness.render((<EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={signedIn()} />) as ReactElement);

    expect(createEVMConnectionsWatcher).toHaveBeenCalledTimes(2);
    expect(unwatch.evm).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createEVMConnectionsWatcher).mock.calls[1][0]).toMatchObject({
      wagmiConfig,
      siwx: { isAuthenticated: true, session: { chainId: 'eip155:1' } },
    });
  });

  it('keeps the EVM watcher running when an equal SIWX object is passed on a new render', async () => {
    harness.render((<EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={signedIn()} />) as ReactElement);
    await harness.settle();
    harness.render((<EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={signedIn()} />) as ReactElement);

    expect(createEVMConnectionsWatcher).toHaveBeenCalledTimes(1);
    expect(unwatch.evm).not.toHaveBeenCalled();
  });

  it('runs the Solana watcher with the latest SIWX state', async () => {
    store.state.activeConnection = { connectorType: 'solana:phantom' };
    harness.render((<SolanaConnectorsWatcher siwx={signedOut()} />) as ReactElement);
    await harness.settle();
    harness.render((<SolanaConnectorsWatcher siwx={signedIn()} />) as ReactElement);
    await harness.settle();

    const calls = vi.mocked(createSolanaConnectionsWatcher).mock.calls;
    expect(calls).toHaveLength(2);
    expect(calls[1][0]).toMatchObject({ wallets, siwx: { isAuthenticated: true } });
  });

  it('does not run the Solana watcher again when an equal SIWX object is passed on a new render', async () => {
    store.state.activeConnection = { connectorType: 'solana:phantom' };
    harness.render((<SolanaConnectorsWatcher siwx={signedIn()} />) as ReactElement);
    await harness.settle();
    harness.render((<SolanaConnectorsWatcher siwx={signedIn()} />) as ReactElement);
    await harness.settle();

    expect(createSolanaConnectionsWatcher).toHaveBeenCalledTimes(1);
  });
});

describe('EVMConnectorsWatcher wagmi hydration', () => {
  beforeEach(() => {
    harness.unmount();
    vi.clearAllMocks();
    store.state.activeConnection = undefined;
    harness.setContextValue({ getState: () => store.state });
  });

  it('hydrates a config created with ssr: true after mount, without the wagmi reconnect', async () => {
    const { config } = createWagmiConfig();
    harness.render((<EVMConnectorsWatcher wagmiConfig={config} />) as ReactElement);
    expect(hydrate).not.toHaveBeenCalled();

    await harness.settle();

    expect(hydrate).toHaveBeenCalledExactlyOnceWith(config, { reconnectOnMount: false });
    expect(onMount.fn).toHaveBeenCalledOnce();
  });

  it('leaves the hydration to WagmiProvider when the config starts hydrating after mount', async () => {
    const { config, hydrateElsewhere } = createWagmiConfig();
    harness.render((<EVMConnectorsWatcher wagmiConfig={config} />) as ReactElement);
    // The effect of WagmiProvider, a parent of the watcher, runs after the effect of the watcher
    hydrateElsewhere();
    await harness.settle();

    expect(hydrate).not.toHaveBeenCalled();
  });

  it.each([
    ['created without ssr: true', { ssr: false }],
    ['already hydrated', { hydrated: true }],
    ['without storage', { storage: false }],
  ])('does not hydrate a config %s', async (_, options) => {
    harness.render((<EVMConnectorsWatcher wagmiConfig={createWagmiConfig(options).config} />) as ReactElement);
    await harness.settle();

    expect(hydrate).not.toHaveBeenCalled();
  });

  it('hydrates a config once when the watcher mounts again', async () => {
    const { config } = createWagmiConfig();
    // React Strict Mode: mount, unmount before the hydration task, mount again
    harness.render((<EVMConnectorsWatcher wagmiConfig={config} />) as ReactElement);
    harness.unmount();
    // Concurrent dynamic imports of a mocked module can return the real module in Vitest
    await vi.dynamicImportSettled();
    harness.render((<EVMConnectorsWatcher wagmiConfig={config} />) as ReactElement);
    await harness.settle();
    harness.unmount();
    harness.render((<EVMConnectorsWatcher wagmiConfig={config} />) as ReactElement);
    await harness.settle();

    expect(hydrate).toHaveBeenCalledOnce();
  });

  it('logs a warning when the hydration fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    onMount.fn.mockRejectedValueOnce(new Error('storage unavailable'));
    harness.render((<EVMConnectorsWatcher wagmiConfig={createWagmiConfig().config} />) as ReactElement);
    await harness.settle();

    expect(warn).toHaveBeenCalledWith('Failed to hydrate the wagmi config:', expect.any(Error));
    warn.mockRestore();
  });
});
