import { type Chain, mainnet, sepolia } from 'viem/chains';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createDefaultTransports } from './createDefaultTransports';

const MAIN = 'https://main.example';
const SPARE = 'https://spare.example';
const over = (http: [string, ...string[]]) => ({ ...sepolia, rpcUrls: { default: { http } } }) as Chain;

describe('createDefaultTransports', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads a chain through the next of its default RPC URLs when one does not answer', async () => {
    const asked: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        asked.push(String(input instanceof Request ? input.url : input).replace(/\/$/, ''));
        if (asked.at(-1) === MAIN) return new Response('{}', { status: 403 });
        return Response.json({ jsonrpc: '2.0', id: 1, result: '0x7' });
      }),
    );
    const chain = over([MAIN, SPARE]);
    const transport = createDefaultTransports([chain])[chain.id]({ chain, retryCount: 0 });

    expect(await transport.request({ method: 'eth_blockNumber' })).toBe('0x7');
    expect(asked).toEqual([MAIN, SPARE]);
  });

  it('gives every chain a transport, a plain one over a single URL', () => {
    const chain = over([MAIN]);
    const transports = createDefaultTransports([chain, mainnet]);

    expect(Object.keys(transports).map(Number).sort()).toEqual([mainnet.id, chain.id].sort());
    expect(transports[chain.id]({ chain }).value).toMatchObject({ url: MAIN });
  });
});
