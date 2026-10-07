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

const OLD_ADDRESS = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B';
const NEW_ADDRESS = '0x1111111111111111111111111111111111111111';
const MATCHING_ADDRESS = '0x2222222222222222222222222222222222222222';

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
      address: NEW_ADDRESS,
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
          address: `eip155:1:${OLD_ADDRESS}`,
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
          address: OLD_ADDRESS,
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
    changeHandler!([{ accounts: [NEW_ADDRESS] }], []);

    expect(disconnect).toHaveBeenCalledWith(`${OrbitAdapter.EVM}:metamask`);
  });

  it('does not disconnect if new address matches active SIWX session', () => {
    let changeHandler: ((connections: any[], prevConnections: any[]) => void) | undefined;

    vi.mocked(wagmiCore.watchConnections).mockImplementation((_config, options) => {
      changeHandler = options.onChange as any;
      return () => {};
    });

    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      address: MATCHING_ADDRESS,
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
          address: `eip155:1:${MATCHING_ADDRESS}`,
        },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
          address: MATCHING_ADDRESS,
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

    changeHandler!([{ accounts: [MATCHING_ADDRESS] }], []);
    expect(disconnect).not.toHaveBeenCalled();
  });

  it.each([
    ['eip155:1', 1, false],
    ['1', 1, false],
    ['eip155:8453', 1, true],
    ['eip155:11', 1, true],
  ])('compares the session chain %s with the connected chain %s', (sessionChainId, chainId, disconnects) => {
    let changeHandler: ((connections: any[], prevConnections: any[]) => void) | undefined;
    vi.mocked(wagmiCore.watchConnections).mockImplementation((_config, options) => {
      changeHandler = options.onChange as any;
      return () => {};
    });
    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      address: MATCHING_ADDRESS,
      chainId,
      isConnected: true,
      connector: { name: 'MetaMask' } as any,
    } as any);
    const disconnect = vi.fn();

    createEVMConnectionsWatcher(
      {
        wagmiConfig: mockWagmiConfig,
        siwx: { enabled: true, isSignedIn: true, address: `eip155:1:${MATCHING_ADDRESS}`, chainId: sessionChainId },
      },
      {
        activeConnection: {
          connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
          address: MATCHING_ADDRESS,
          chainId,
          rpcURL: 'https://rpc',
          isContractAddress: false,
          isConnected: true,
        },
        disconnect,
        connectionError: undefined,
        updateActiveConnection: vi.fn(),
      },
    );
    changeHandler!([{ accounts: [MATCHING_ADDRESS] }], []);

    expect(disconnect).toHaveBeenCalledTimes(disconnects ? 1 : 0);
  });

  it('does not disconnect when SIWX is disabled', () => {
    let changeHandler: ((connections: any[], prevConnections: any[]) => void) | undefined;

    vi.mocked(wagmiCore.watchConnections).mockImplementation((_config, options) => {
      changeHandler = options.onChange as any;
      return () => {};
    });

    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      address: NEW_ADDRESS,
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
          address: OLD_ADDRESS,
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

    changeHandler!([{ accounts: [NEW_ADDRESS] }], []);
    expect(disconnect).not.toHaveBeenCalled();
  });

  it('reads the current store state on every wagmi event when getState is passed', () => {
    let changeHandler: ((connections: any[], prevConnections: any[]) => void) | undefined;
    vi.mocked(wagmiCore.watchConnections).mockImplementation((_config, options) => {
      changeHandler = options.onChange as any;
      return () => {};
    });
    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      address: '0xabc',
      chainId: 10,
      isConnected: true,
      connector: { name: 'MetaMask' } as any,
    } as any);

    const state: { activeConnection?: any; connectionError?: string } = { activeConnection: undefined };
    const disconnect = vi.fn();
    const updateActiveConnection = vi.fn();

    createEVMConnectionsWatcher(
      { wagmiConfig: mockWagmiConfig },
      { disconnect, updateActiveConnection, getState: () => state },
    );

    // The store connects a wallet after the watcher was created
    state.activeConnection = { connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType, address: '0xabc' };
    changeHandler?.([], []);
    expect(disconnect).toHaveBeenCalledWith(`${OrbitAdapter.EVM}:metamask`);

    // A connection error set later stops the sync
    state.connectionError = 'User rejected';
    changeHandler?.([{}], []);
    expect(updateActiveConnection).not.toHaveBeenCalled();

    state.connectionError = undefined;
    changeHandler?.([{}], []);
    expect(updateActiveConnection).toHaveBeenCalledWith(expect.objectContaining({ chainId: 10, address: '0xabc' }));
  });
});
