import { ConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import type { UiWallet } from '@wallet-standard/ui';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSolanaConnectionsWatcher } from '../utils/createSolanaConnectionsWatcher';

describe('createSolanaConnectionsWatcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggers disconnect on initial SIWX rejection', () => {
    const disconnect = vi.fn();
    const updateActiveConnection = vi.fn();

    createSolanaConnectionsWatcher(
      {
        wallets: [],
        siwx: {
          enabled: true,
          isSignedIn: false,
          isRejected: true,
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
          address: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
          chainId: 'solana:mainnet',
          rpcURL: 'https://api.mainnet-beta.solana.com',
          isContractAddress: false,
          isConnected: true,
        },
        disconnect,
        connectionError: undefined,
        updateActiveConnection,
      },
    );

    expect(disconnect).toHaveBeenCalledWith(`${OrbitAdapter.SOLANA}:phantom`);
  });

  it('disconnects if Solana account address does not match active SIWX session', () => {
    const disconnect = vi.fn();
    const updateActiveConnection = vi.fn();

    const mockWallet = {
      name: 'Phantom',
      icon: 'data:image/svg+xml;base64,...',
      version: '1.0.0',
      chains: ['solana:mainnet'],
      features: ['standard:connect'],
      accounts: [
        {
          address: 'NewSolanaAddress111111111111111111111111111',
          publicKey: new Uint8Array(32),
          chains: ['solana:mainnet'],
          features: ['solana:signMessage'],
        },
      ],
    } as unknown as UiWallet;

    createSolanaConnectionsWatcher(
      {
        wallets: [mockWallet],
        siwx: {
          enabled: true,
          isSignedIn: true,
          address: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK:OldSolanaAddress111111111111111111111111111',
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
          address: 'OldSolanaAddress111111111111111111111111111',
          chainId: 'solana:mainnet',
          rpcURL: 'https://api.mainnet-beta.solana.com',
          isContractAddress: false,
          isConnected: true,
        },
        disconnect,
        connectionError: undefined,
        updateActiveConnection,
      },
    );

    expect(disconnect).toHaveBeenCalledWith(`${OrbitAdapter.SOLANA}:phantom`);
  });

  it('does not disconnect if Solana account address matches active SIWX session', () => {
    const disconnect = vi.fn();
    const updateActiveConnection = vi.fn();

    const mockWallet = {
      name: 'Phantom',
      icon: 'data:image/svg+xml;base64,...',
      version: '1.0.0',
      chains: ['solana:mainnet'],
      features: ['standard:connect'],
      accounts: [
        {
          address: 'MatchingSolanaAddress111111111111111111111111',
          publicKey: new Uint8Array(32),
          chains: ['solana:mainnet'],
          features: ['solana:signMessage'],
        },
      ],
    } as unknown as UiWallet;

    createSolanaConnectionsWatcher(
      {
        wallets: [mockWallet],
        siwx: {
          enabled: true,
          isSignedIn: true,
          address: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK:MatchingSolanaAddress111111111111111111111111',
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
          address: 'MatchingSolanaAddress111111111111111111111111',
          chainId: 'solana:mainnet',
          rpcURL: 'https://api.mainnet-beta.solana.com',
          isContractAddress: false,
          isConnected: true,
        },
        disconnect,
        connectionError: undefined,
        updateActiveConnection,
      },
    );

    expect(disconnect).not.toHaveBeenCalled();
  });

  it('does not disconnect if SIWX is disabled', () => {
    const disconnect = vi.fn();
    const updateActiveConnection = vi.fn();

    const mockWallet = {
      name: 'Phantom',
      icon: 'data:image/svg+xml;base64,...',
      version: '1.0.0',
      chains: ['solana:mainnet'],
      features: ['standard:connect'],
      accounts: [
        {
          address: 'NewSolanaAddress111111111111111111111111111',
          publicKey: new Uint8Array(32),
          chains: ['solana:mainnet'],
          features: ['solana:signMessage'],
        },
      ],
    } as unknown as UiWallet;

    createSolanaConnectionsWatcher(
      {
        wallets: [mockWallet],
        siwx: {
          enabled: false,
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
          address: 'OldSolanaAddress111111111111111111111111111',
          chainId: 'solana:mainnet',
          rpcURL: 'https://api.mainnet-beta.solana.com',
          isContractAddress: false,
          isConnected: true,
        },
        disconnect,
        connectionError: undefined,
        updateActiveConnection,
      },
    );

    expect(disconnect).not.toHaveBeenCalled();
  });
});
