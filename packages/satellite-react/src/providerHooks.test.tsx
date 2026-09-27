import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useInitializeAutoConnect } from './hooks/useInitializeAutoConnect';
import { SatelliteConnectProvider } from './providers/SatelliteConnectProvider';
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
  updateParameters: vi.fn(),
  initializeAutoConnect: vi.fn(() => Promise.resolve()),
}));

vi.mock('@tuwaio/satellite-core', () => ({
  createSatelliteConnectStore: vi.fn(() => ({ getState: () => store })),
}));

type ProviderProps = Parameters<typeof SatelliteConnectProvider>[0];
const adapterA = { key: 'evm' } as unknown as ProviderProps['adapter'];
const adapterB = { key: 'solana' } as unknown as ProviderProps['adapter'];

function AutoConnectProbe(props: Parameters<typeof useInitializeAutoConnect>[0]) {
  useInitializeAutoConnect(props);
  return null;
}

describe('SatelliteConnectProvider', () => {
  beforeEach(() => {
    harness.unmount();
    vi.clearAllMocks();
  });

  it('creates the store once and updates it only when adapter or callback change', async () => {
    const render = (adapter: ProviderProps['adapter']) =>
      harness.render((<SatelliteConnectProvider adapter={adapter}>{null}</SatelliteConnectProvider>) as ReactElement);

    render(adapterA);
    render(adapterA);
    render(adapterA);
    await harness.settle();

    expect(createSatelliteConnectStore).toHaveBeenCalledTimes(1);
    expect(store.updateParameters).toHaveBeenCalledTimes(1);

    render(adapterB);

    expect(store.updateParameters).toHaveBeenCalledTimes(2);
    expect(store.updateParameters).toHaveBeenLastCalledWith({ adapter: adapterB, callbackAfterConnected: undefined });
    expect(store.initializeAutoConnect).toHaveBeenCalledTimes(1);
    expect(store.initializeAutoConnect).toHaveBeenCalledWith(false);
  });
});

describe('useInitializeAutoConnect', () => {
  beforeEach(() => {
    harness.unmount();
    vi.clearAllMocks();
  });

  it('initializes once and reports a rejection to the onError of the latest render', async () => {
    let reject: (error: Error) => void = () => undefined;
    const initializeAutoConnect = vi.fn(
      () =>
        new Promise<void>((_resolve, rejectPromise) => {
          reject = rejectPromise;
        }),
    );
    const firstOnError = vi.fn();
    const latestOnError = vi.fn();

    harness.render(
      (<AutoConnectProbe initializeAutoConnect={initializeAutoConnect} onError={firstOnError} />) as ReactElement,
    );
    harness.render(
      (<AutoConnectProbe initializeAutoConnect={initializeAutoConnect} onError={latestOnError} />) as ReactElement,
    );
    reject(new Error('No wallet'));
    await harness.settle();

    expect(initializeAutoConnect).toHaveBeenCalledTimes(1);
    expect(firstOnError).not.toHaveBeenCalled();
    expect(latestOnError).toHaveBeenCalledWith(new Error('No wallet'));
  });

  it('reports a synchronous throw of initializeAutoConnect to onError', async () => {
    const onError = vi.fn();
    const initializeAutoConnect = () => {
      throw new Error('Not ready');
    };

    harness.render(
      (<AutoConnectProbe initializeAutoConnect={initializeAutoConnect} onError={onError} />) as ReactElement,
    );
    await harness.settle();

    expect(onError).toHaveBeenCalledWith(new Error('Not ready'));
  });
});
