import { createViemClient } from '@tuwaio/orbit-evm';
import type { Config } from '@wagmi/core';
import { getBytecode } from '@wagmi/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { checkIsWalletAddressContract } from './checkIsWalletAddressContract';

vi.mock('@tuwaio/orbit-evm', () => ({
  createViemClient: vi.fn(),
}));

vi.mock('@wagmi/core', () => ({
  getBytecode: vi.fn(),
}));

describe('checkIsWalletAddressContract', () => {
  const mockConfig = {} as Config;
  const mockChains = [{ id: 1, name: 'Mainnet' }] as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false when client creation fails', async () => {
    vi.mocked(createViemClient).mockReturnValue(undefined as any);

    const result = await checkIsWalletAddressContract({
      config: mockConfig,
      address: '0x0000000000000000000000000000000000000001',
      chainId: 1,
      chains: mockChains,
    });

    expect(result).toBe(false);
  });

  it('returns true when bytecode exists and caches the result', async () => {
    vi.mocked(createViemClient).mockReturnValue({} as any);
    vi.mocked(getBytecode).mockResolvedValueOnce('0x6080604052' as any);

    const address = '0xContractAddress1234567890123456789012';
    const result1 = await checkIsWalletAddressContract({
      config: mockConfig,
      address,
      chainId: 1,
      chains: mockChains,
    });

    expect(result1).toBe(true);
    expect(getBytecode).toHaveBeenCalledTimes(1);

    // Second call should return cached value without calling getBytecode again
    const result2 = await checkIsWalletAddressContract({
      config: mockConfig,
      address,
      chainId: 1,
      chains: mockChains,
    });

    expect(result2).toBe(true);
    expect(getBytecode).toHaveBeenCalledTimes(1);
  });

  it('returns false when bytecode is undefined or empty and caches it', async () => {
    vi.mocked(createViemClient).mockReturnValue({} as any);
    vi.mocked(getBytecode).mockResolvedValueOnce(undefined);

    const address = '0xEOAAddress1234567890123456789012345678';
    const result = await checkIsWalletAddressContract({
      config: mockConfig,
      address,
      chainId: 1,
      chains: mockChains,
    });

    expect(result).toBe(false);

    // Second call from cache
    const resultCached = await checkIsWalletAddressContract({
      config: mockConfig,
      address,
      chainId: 1,
      chains: mockChains,
    });
    expect(resultCached).toBe(false);
    expect(getBytecode).toHaveBeenCalledTimes(1);
  });
});
