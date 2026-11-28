import { afterEach, describe, expect, it, vi } from 'vitest';

import { satelliteSolanaAdapter } from './solanaAdapter';

// The adapter with the real @tuwaio/orbit-solana: by default its names and avatars send nothing anywhere
const ADDRESS = 'So11111111111111111111111111111111111111112';

describe('the names and avatars of the Solana adapter, by default', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('are the address and an identicon drawn here, with no request', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('A test sends nothing over the network'));
    const adapter = satelliteSolanaAdapter({ rpcUrls: { mainnet: 'https://rpc.example.com' } });

    expect(await adapter.getName?.(ADDRESS)).toBe(ADDRESS);
    expect(await adapter.getAvatar?.(ADDRESS)).toMatch(/^data:image\/svg\+xml,/);
    expect(await adapter.getAvatar?.('name.sol')).toMatch(/^data:image\/svg\+xml,/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
