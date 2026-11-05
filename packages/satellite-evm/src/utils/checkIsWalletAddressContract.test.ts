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

  it('returns false, warns and requests nothing when the chain is not in the app chains', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await checkIsWalletAddressContract({
      config: mockConfig,
      address: '0x0000000000000000000000000000000000000001',
      chainId: 999,
      chains: mockChains,
    });

    expect(result).toBe(false);
    expect(getBytecode).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('999'));
    warn.mockRestore();
  });

  it('does not create a viem public client, so all its actions stay out of the bundle', async () => {
    vi.mocked(getBytecode).mockResolvedValueOnce('0x6080604052');

    const result = await checkIsWalletAddressContract({
      config: mockConfig,
      address: '0x0000000000000000000000000000000000000002',
      chainId: 1,
      chains: mockChains,
    });

    expect(result).toBe(true);
    expect(createViemClient).not.toHaveBeenCalled();
  });

  it('accepts the chain ID as a numeric string', async () => {
    vi.mocked(getBytecode).mockResolvedValueOnce('0x6080604052');
    const address = '0x0000000000000000000000000000000000000003';

    const result = await checkIsWalletAddressContract({
      config: mockConfig,
      address,
      chainId: '1',
      chains: mockChains,
    });

    expect(result).toBe(true);
    expect(getBytecode).toHaveBeenCalledWith(mockConfig, { address, chainId: 1 });
  });

  it('returns true when bytecode exists and caches the result', async () => {
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

  it('checks and caches each chain separately', async () => {
    vi.mocked(getBytecode)
      .mockResolvedValueOnce('0x6080604052' as any)
      .mockResolvedValueOnce(undefined);
    const chains = [
      { id: 1, name: 'Mainnet' },
      { id: 10, name: 'OP Mainnet' },
    ] as any;
    const address = '0x00000000000000000000000000000000000000Aa';

    const onMainnet = await checkIsWalletAddressContract({ config: mockConfig, address, chainId: 1, chains });
    const onOptimism = await checkIsWalletAddressContract({ config: mockConfig, address, chainId: 10, chains });

    expect(onMainnet).toBe(true);
    expect(onOptimism).toBe(false);
    expect(getBytecode).toHaveBeenNthCalledWith(1, mockConfig, { address, chainId: 1 });
    expect(getBytecode).toHaveBeenNthCalledWith(2, mockConfig, { address, chainId: 10 });
  });

  it('returns false when bytecode is undefined or empty and caches it', async () => {
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
