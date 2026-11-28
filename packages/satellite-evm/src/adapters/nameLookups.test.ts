import type { Config } from '@wagmi/core';
import { mainnet } from 'viem/chains';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { satelliteEVMAdapter } from './evmAdapter';

// The adapter with the real @tuwaio/orbit-evm: by default it looks no ENS avatar up, whose record can point at any host
describe('the ENS avatar of the EVM adapter, by default', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is null, with no request', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('A test sends nothing over the network'));
    const config = { state: { connections: new Map(), current: null } } as unknown as Config;

    expect(await satelliteEVMAdapter(config, [mainnet]).getAvatar?.('vitalik.eth')).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
