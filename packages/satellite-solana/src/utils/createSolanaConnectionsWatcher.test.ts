import { ConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import type { UiWallet } from '@wallet-standard/ui';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSolanaConnectionsWatcher } from './createSolanaConnectionsWatcher';

const MAINNET = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
const OLD_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const NEW_ADDRESS = '4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZAMdL4VZHirAn';
const MATCHING_ADDRESS = '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV';

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
          address: NEW_ADDRESS,
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
          address: `${MAINNET}:${OLD_ADDRESS}`,
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
          address: OLD_ADDRESS,
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
          address: MATCHING_ADDRESS,
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
          address: `${MAINNET}:${MATCHING_ADDRESS}`,
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
          address: MATCHING_ADDRESS,
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

  it('disconnects if the session account only ends with the Solana account address', () => {
    const disconnect = vi.fn();

    const mockWallet = {
      name: 'Phantom',
      icon: 'data:image/svg+xml;base64,...',
      version: '1.0.0',
      chains: ['solana:mainnet'],
      features: ['standard:connect'],
      accounts: [
        {
          address: MATCHING_ADDRESS,
          publicKey: new Uint8Array(32),
          chains: ['solana:mainnet'],
          features: ['solana:signMessage'],
        },
      ],
    } as unknown as UiWallet;

    createSolanaConnectionsWatcher(
      {
        wallets: [mockWallet],
        siwx: { enabled: true, isSignedIn: true, address: `${MAINNET}:2${MATCHING_ADDRESS}` },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
          address: MATCHING_ADDRESS,
          chainId: 'solana:mainnet',
          rpcURL: 'https://api.mainnet-beta.solana.com',
          isContractAddress: false,
          isConnected: true,
        },
        disconnect,
        connectionError: undefined,
        updateActiveConnection: vi.fn(),
      },
    );

    expect(disconnect).toHaveBeenCalledWith(`${OrbitAdapter.SOLANA}:phantom`);
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
          address: NEW_ADDRESS,
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
          address: OLD_ADDRESS,
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

  it('reads the store state from getState when it is passed', () => {
    const disconnect = vi.fn();
    const updateActiveConnection = vi.fn();
    const wallet = { name: 'Phantom', accounts: [] } as unknown as UiWallet;

    createSolanaConnectionsWatcher(
      { wallets: [wallet] },
      {
        disconnect,
        updateActiveConnection,
        getState: () => ({
          activeConnection: {
            connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
            address: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
            chainId: 'devnet',
            rpcURL: 'https://api.devnet.solana.com',
            isContractAddress: false,
            isConnected: true,
          },
        }),
      },
    );

    // The wallet of the active connection has no accounts left
    expect(disconnect).toHaveBeenCalledWith(`${OrbitAdapter.SOLANA}:phantom`);
  });
});
