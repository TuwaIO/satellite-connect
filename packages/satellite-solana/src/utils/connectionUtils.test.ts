import * as orbitSolana from '@tuwaio/orbit-solana';
import type { UiWallet, UiWalletAccount } from '@wallet-standard/ui';
import * as walletStandardUi from '@wallet-standard/ui';
import * as registry from '@wallet-standard/ui-registry';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { connect, disconnect, unwrapUiWalletHandles } from './connectionUtils';

vi.mock('@tuwaio/orbit-solana', () => ({
  getAvailableSolanaConnectors: vi.fn(),
}));

vi.mock('@wallet-standard/ui', () => ({
  getWalletFeature: vi.fn(),
}));

vi.mock('@wallet-standard/ui-registry', () => ({
  getWalletForHandle: vi.fn(),
  getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: vi.fn(),
  getOrCreateUiWalletAccountForStandardWalletAccount: vi.fn(),
}));

describe('connectionUtils', () => {
  const mockUiWallet = {
    name: 'Phantom',
    accounts: [{ address: 'PhantomAddress123' }],
  } as unknown as UiWallet;

  const mockUiAccount = {
    address: 'PhantomAddress123',
  } as unknown as UiWalletAccount;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('unwrapUiWalletHandles', () => {
    it('unwraps raw wallet and raw account successfully', () => {
      const mockRawWallet = { name: 'RawPhantom' };
      const mockRawAccount = { address: 'RawAddress' };

      vi.mocked(registry.getWalletForHandle).mockReturnValue(mockRawWallet as any);
      vi.mocked(registry.getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED).mockReturnValue(
        mockRawAccount as any,
      );

      const result = unwrapUiWalletHandles(mockUiWallet, mockUiAccount);
      expect(result.wallet).toBe(mockRawWallet);
      expect(result.account).toBe(mockRawAccount);
    });

    it('falls back to handles if unwrap throws', () => {
      vi.mocked(registry.getWalletForHandle).mockImplementation(() => {
        throw new Error('Unwrap failed');
      });

      const result = unwrapUiWalletHandles(mockUiWallet, mockUiAccount);
      expect(result.wallet).toBe(mockUiWallet);
      expect(result.account).toBe(mockUiAccount);
    });
  });

  describe('connect', () => {
    it('connects via StandardConnect and returns uiWallet and accounts', async () => {
      const mockConnectFeature = {
        connect: vi.fn().mockResolvedValue({
          accounts: [{ address: 'PhantomAddress123' }],
        }),
      };

      vi.mocked(walletStandardUi.getWalletFeature).mockReturnValue(mockConnectFeature as any);
      vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([mockUiWallet]);
      vi.mocked(registry.getWalletForHandle).mockReturnValue({} as any);
      vi.mocked(registry.getOrCreateUiWalletAccountForStandardWalletAccount).mockReturnValue(mockUiAccount);

      const result = await connect(mockUiWallet);

      expect(mockConnectFeature.connect).toHaveBeenCalled();
      expect(result.uiWallet).toBe(mockUiWallet);
      expect(result.accounts).toEqual([mockUiAccount]);
    });
  });

  describe('disconnect', () => {
    it('disconnects via StandardDisconnect if supported', async () => {
      const mockDisconnectFeature = {
        disconnect: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(walletStandardUi.getWalletFeature).mockReturnValue(mockDisconnectFeature as any);

      await disconnect(mockUiWallet);

      expect(mockDisconnectFeature.disconnect).toHaveBeenCalled();
    });

    it('does not fail if StandardDisconnect is not supported', async () => {
      vi.mocked(walletStandardUi.getWalletFeature).mockReturnValue(undefined);

      await expect(disconnect(mockUiWallet)).resolves.not.toThrow();
    });
  });
});
