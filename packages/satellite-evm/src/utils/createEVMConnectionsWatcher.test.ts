import { ConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import type { Config } from '@wagmi/core';
import * as wagmiCore from '@wagmi/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createEVMConnectionsWatcher } from './createEVMConnectionsWatcher';

vi.mock('@wagmi/core', () => ({
  watchConnections: vi.fn(),
  getConnection: vi.fn(),
  signMessage: vi.fn(),
}));

describe('createEVMConnectionsWatcher', () => {
  const mockWagmiConfig = {} as Config;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggers disconnect on initial SIWX rejection', () => {
    const disconnect = vi.fn();
    const updateActiveConnection = vi.fn();

    createEVMConnectionsWatcher(
      {
        wagmiConfig: mockWagmiConfig,
        siwx: {
          enabled: true,
          isSignedIn: false,
          isRejected: true,
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
          address: '0x123',
          chainId: 1,
          rpcURL: 'https://rpc',
          isContractAddress: false,
          isConnected: true,
        },
        disconnect,
        connectionError: undefined,
        updateActiveConnection,
      },
    );

    expect(disconnect).toHaveBeenCalledWith(`${OrbitAdapter.EVM}:metamask`);
  });

  it('disconnects if account switches to an address not matching the SIWX session', () => {
    let changeHandler: ((connections: any[], prevConnections: any[]) => void) | undefined;

    vi.mocked(wagmiCore.watchConnections).mockImplementation((_config, options) => {
      changeHandler = options.onChange as any;
      return () => {};
    });

    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      address: '0xNewAddress',
      chainId: 1,
      isConnected: true,
      connector: { name: 'MetaMask' } as any,
    } as any);

    const disconnect = vi.fn();
    const updateActiveConnection = vi.fn();

    createEVMConnectionsWatcher(
      {
        wagmiConfig: mockWagmiConfig,
        siwx: {
          enabled: true,
          isSignedIn: true,
          address: 'eip155:1:0xOldAddress',
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
          address: '0xOldAddress',
          chainId: 1,
          rpcURL: 'https://rpc',
          isContractAddress: false,
          isConnected: true,
        },
        disconnect,
        connectionError: undefined,
        updateActiveConnection,
      },
    );

    expect(changeHandler).toBeDefined();
    // Simulate wagmi connection change
    changeHandler!([{ accounts: ['0xNewAddress'] }], []);

    expect(disconnect).toHaveBeenCalledWith(`${OrbitAdapter.EVM}:metamask`);
  });

  it('does not disconnect if new address matches active SIWX session', () => {
    let changeHandler: ((connections: any[], prevConnections: any[]) => void) | undefined;

    vi.mocked(wagmiCore.watchConnections).mockImplementation((_config, options) => {
      changeHandler = options.onChange as any;
      return () => {};
    });

    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      address: '0xMatchingAddress',
      chainId: 1,
      isConnected: true,
      connector: { name: 'MetaMask' } as any,
    } as any);

    const disconnect = vi.fn();
    const updateActiveConnection = vi.fn();

    createEVMConnectionsWatcher(
      {
        wagmiConfig: mockWagmiConfig,
        siwx: {
          enabled: true,
          isSignedIn: true,
          address: 'eip155:1:0xMatchingAddress',
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
          address: '0xMatchingAddress',
          chainId: 1,
          rpcURL: 'https://rpc',
          isContractAddress: false,
          isConnected: true,
        },
        disconnect,
        connectionError: undefined,
        updateActiveConnection,
      },
    );

    changeHandler!([{ accounts: ['0xMatchingAddress'] }], []);
    expect(disconnect).not.toHaveBeenCalled();
  });

  it('does not disconnect when SIWX is disabled', () => {
    let changeHandler: ((connections: any[], prevConnections: any[]) => void) | undefined;

    vi.mocked(wagmiCore.watchConnections).mockImplementation((_config, options) => {
      changeHandler = options.onChange as any;
      return () => {};
    });

    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      address: '0xNewAddress',
      chainId: 1,
      isConnected: true,
      connector: { name: 'MetaMask' } as any,
    } as any);

    const disconnect = vi.fn();
    const updateActiveConnection = vi.fn();

    createEVMConnectionsWatcher(
      {
        wagmiConfig: mockWagmiConfig,
        siwx: {
          enabled: false,
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
          address: '0xOldAddress',
          chainId: 1,
          rpcURL: 'https://rpc',
          isContractAddress: false,
          isConnected: true,
        },
        disconnect,
        connectionError: undefined,
        updateActiveConnection,
      },
    );

    changeHandler!([{ accounts: ['0xNewAddress'] }], []);
    expect(disconnect).not.toHaveBeenCalled();
  });
});
