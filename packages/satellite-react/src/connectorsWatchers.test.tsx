import { createEVMConnectionsWatcher } from '@tuwaio/satellite-evm';
import { createSolanaConnectionsWatcher } from '@tuwaio/satellite-solana';
import type { Config } from '@wagmi/core';
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

const wagmiConfig = {} as Config;
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
