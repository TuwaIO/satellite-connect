import { getBase58Decoder, getUtf8Encoder } from '@solana/kit';
import { describe, expect, it, vi } from 'vitest';

import { createSolanaMessageSigner } from './signerUtils';

describe('createSolanaMessageSigner', () => {
  it('signs message using Wallet Standard solana:signMessage feature on wallet', async () => {
    const mockSig = new Uint8Array([1, 2, 3, 4]);
    const mockSignMessage = vi.fn().mockResolvedValue([{ signature: mockSig }]);

    const wallet = {
      features: {
        'solana:signMessage': {
          signMessage: mockSignMessage,
        },
      },
    };
    const account = { address: 'mock-account' };

    const signer = createSolanaMessageSigner({ wallet, account });
    const result = await signer('Hello Solana');

    expect(mockSignMessage).toHaveBeenCalledWith({
      account,
      message: getUtf8Encoder().encode('Hello Solana'),
    });
    expect(result).toBe(getBase58Decoder().decode(mockSig));
  });

  it('signs message using Wallet Standard solana:signMessage feature on account', async () => {
    const mockSig = new Uint8Array([5, 6, 7, 8]);
    const mockSignMessage = vi.fn().mockResolvedValue([{ signature: mockSig }]);

    const wallet = {};
    const account = {
      address: 'mock-account',
      features: {
        'solana:signMessage': {
          signMessage: mockSignMessage,
        },
      },
    };

    const signer = createSolanaMessageSigner({ wallet, account });
    const result = await signer('Test Message');

    expect(result).toBe(getBase58Decoder().decode(mockSig));
  });

  it('falls back to wallet.signMessages if feature not present', async () => {
    const mockSig = new Uint8Array([9, 10, 11, 12]);
    const mockSignMessages = vi.fn().mockResolvedValue([{ signature: mockSig }]);

    const wallet = { signMessages: mockSignMessages };
    const account = { address: 'mock-account' };

    const signer = createSolanaMessageSigner({ wallet, account });
    const result = await signer('Fallback');

    expect(result).toBe(getBase58Decoder().decode(mockSig));
  });

  it('falls back to legacy signMessage adapter if provided', async () => {
    const mockSig = new Uint8Array([13, 14, 15, 16]);
    const mockLegacy = vi.fn().mockResolvedValue(mockSig);

    const wallet = { signMessage: mockLegacy };

    const signer = createSolanaMessageSigner({ wallet });
    const result = await signer('Legacy');

    expect(result).toBe(getBase58Decoder().decode(mockSig));
  });

  it('throws descriptive error if target lacks signing capability', async () => {
    const signer = createSolanaMessageSigner({ wallet: {}, account: {} });
    await expect(signer('Fail')).rejects.toThrow('[SATELLITE-SOLANA] Signer lacks known message signing capabilities.');
  });
});
