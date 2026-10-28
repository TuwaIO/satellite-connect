import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import { createConfig, createStorage, http, injected, noopStorage } from '@wagmi/core';
import type { EIP1193Provider } from 'viem';
import { mainnet } from 'viem/chains';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ConnectorEVM, EVMConnection } from '../types';
import { satelliteEVMAdapter } from './evmAdapter';

// The real wagmi, not a mock: pins the store that `watchConnectors` follows, which is the one wagmi updates when it
// adds the installed EIP-6963 wallets of a config created with `ssr: true` (`hydrate`, `mipd`) and the one
// `addInstalledWallets` of `@tuwaio/satellite-react` updates

const fakeWallet = (id: string, name: string) => {
  const provider = { request: async () => null, on: () => undefined, removeListener: () => undefined };
  return injected({ target: () => ({ id, name, provider: provider as unknown as EIP1193Provider }) });
};

const setup = () => {
  const config = createConfig({
    chains: [mainnet],
    connectors: [injected()],
    transports: { [mainnet.id]: http() },
    ssr: true,
    storage: createStorage({ storage: noopStorage }),
  });
  // What wagmi does when a wallet announces itself (EIP-6963)
  const addWallet = (id: string, name: string) =>
    config._internal.connectors.setState((connectors) => [
      ...connectors,
      config._internal.connectors.setup(fakeWallet(id, name)),
    ]);
  return { config, adapter: satelliteEVMAdapter(config, [mainnet]), addWallet };
};

const names = (connectors: readonly { name: string }[] | undefined) => connectors?.map(({ name }) => name);

describe('watchConnectors with wagmi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls back when wagmi changes the connectors of the config, until it is stopped', () => {
    const { adapter, addWallet } = setup();
    const onChange = vi.fn();

    const stop = adapter.watchConnectors?.(onChange);
    addWallet('io.metamask', 'MetaMask');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith();

    stop?.();
    addWallet('io.rabby', 'Rabby Wallet');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('lets a store subscriber read the new list from inside the callback', () => {
    const { adapter, addWallet } = setup();
    // The store follows the wallets only in the browser; the config is created before, so wagmi does not listen for
    // EIP-6963 announcements on this stand-in
    vi.stubGlobal('window', {});
    const store = createSatelliteConnectStore<ConnectorEVM, EVMConnection>({ adapter });
    const seen: (string[] | undefined)[] = [];

    const stop = store.getState().watchConnectors(() => {
      seen.push(names(store.getState().getConnectors()[OrbitAdapter.EVM]));
    });
    expect(names(store.getState().getConnectors()[OrbitAdapter.EVM])).toEqual(['Injected']);

    addWallet('io.metamask', 'MetaMask');
    expect(seen).toEqual([['Injected', 'MetaMask']]);

    stop();
    addWallet('io.rabby', 'Rabby Wallet');
    expect(seen).toHaveLength(1);
  });
});
