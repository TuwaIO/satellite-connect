/**
 * @file The RPC URLs of a cluster, over the real clients of `@tuwaio/orbit-solana`: a read goes to the next one when one
 * does not answer, and the connection keeps the first.
 */

import { decimalFixedPointToString, lamports, lamportsToSol } from '@solana/kit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { satelliteSolanaAdapter } from './solanaAdapter';

const MAIN = 'https://main.example/';
const SPARE = 'https://spare.example/';
const ADDRESS = '11111111111111111111111111111111';
const BALANCE = 1_500_000_000;

describe('the RPC URLs of a cluster', () => {
  const asked: string[] = [];

  beforeEach(() => {
    asked.length = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        const url = String(input instanceof Request ? input.url : input);
        asked.push(url);
        if (url === MAIN) return new Response('too many requests', { status: 429 });
        return Response.json({ jsonrpc: '2.0', id: '1', result: { context: { slot: 1 }, value: BALANCE } });
      }),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads the balance through the next one when the first does not answer', async () => {
    const adapter = satelliteSolanaAdapter({ rpcUrls: { devnet: [MAIN, SPARE] } });

    await expect(adapter.getBalance(ADDRESS, 'solana:devnet')).resolves.toEqual({
      value: decimalFixedPointToString(lamportsToSol(lamports(BigInt(BALANCE)))),
      symbol: 'SOL',
    });
    expect(asked).toEqual([MAIN, SPARE]);
  });

  it('gives the connection the first of them', async () => {
    const updateActiveWallet = vi.fn();
    const adapter = satelliteSolanaAdapter({ rpcUrls: { devnet: [MAIN, SPARE] } });

    await adapter.checkAndSwitchNetwork('solana:devnet', 'mainnet', updateActiveWallet);

    expect(updateActiveWallet).toHaveBeenCalledWith({ chainId: 'devnet', rpcURL: MAIN });
    expect(asked).toEqual([]);
  });
});
