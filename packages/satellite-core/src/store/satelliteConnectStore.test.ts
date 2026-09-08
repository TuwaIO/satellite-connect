import { ConnectorType, normalizeError, OrbitAdapter } from '@tuwaio/orbit-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BaseConnector, SatelliteAdapter } from '../types';
import { createSatelliteConnectStore } from './satelliteConnectStore';

describe('SatelliteConnectStore', () => {
  let mockEvmAdapter: SatelliteAdapter<{ name: string }, BaseConnector>;
  let mockSolanaAdapter: SatelliteAdapter<{ name: string }, BaseConnector>;

  beforeEach(() => {
    mockEvmAdapter = {
      key: OrbitAdapter.EVM,
      getConnectors: () => ({
        adapter: OrbitAdapter.EVM,
        connectors: [{ name: 'MetaMask' }, { name: 'Coinbase Wallet' }],
      }),
      connect: vi.fn().mockResolvedValue({
        connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
        address: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        rpcURL: 'https://eth.llamarpc.com',
        isContractAddress: false,
        isConnected: true,
      }),
      disconnect: vi.fn().mockResolvedValue(undefined),
      checkAndSwitchNetwork: vi.fn().mockResolvedValue(undefined),
      getBalance: vi.fn().mockResolvedValue({ value: '1.5', symbol: 'ETH' }),
      getExplorerUrl: vi.fn().mockReturnValue('https://etherscan.io'),
      switchConnection: vi.fn().mockResolvedValue(undefined),
      checkIsContractAddress: vi.fn().mockResolvedValue(false),
    };

    mockSolanaAdapter = {
      key: OrbitAdapter.SOLANA,
      getConnectors: () => ({
        adapter: OrbitAdapter.SOLANA,
        connectors: [{ name: 'Phantom' }],
      }),
      connect: vi.fn().mockResolvedValue({
        connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
        address: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
        chainId: 'solana:mainnet',
        rpcURL: 'https://api.mainnet-beta.solana.com',
        isContractAddress: false,
        isConnected: true,
      }),
      disconnect: vi.fn().mockResolvedValue(undefined),
      checkAndSwitchNetwork: vi.fn().mockResolvedValue(undefined),
      getBalance: vi.fn().mockResolvedValue({ value: '10.5', symbol: 'SOL' }),
      getExplorerUrl: vi.fn().mockReturnValue('https://solscan.io'),
      switchConnection: vi.fn().mockResolvedValue(undefined),
    };
  });

  it('initializes store with clean default state', () => {
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });
    const state = store.getState();

    expect(state.activeConnection).toBeUndefined();
    expect(state.connections).toEqual({});
    expect(state.connectionError).toBeUndefined();
    expect(state.switchNetworkError).toBeUndefined();
    expect(state.connecting).toBe(false);
    expect(state.disconnecting).toBe(false);
  });

  it('retrieves connectors for single adapter', () => {
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });
    const connectors = store.getState().getConnectors();

    expect(connectors[OrbitAdapter.EVM]).toHaveLength(2);
    expect(connectors[OrbitAdapter.EVM]?.[0].name).toBe('MetaMask');
  });

  it('retrieves connectors for multi-adapter array', () => {
    const store = createSatelliteConnectStore({ adapter: [mockEvmAdapter, mockSolanaAdapter] });
    const connectors = store.getState().getConnectors();

    expect(connectors[OrbitAdapter.EVM]).toHaveLength(2);
    expect(connectors[OrbitAdapter.SOLANA]).toHaveLength(1);
    expect(connectors[OrbitAdapter.SOLANA]?.[0].name).toBe('Phantom');
  });

  it('retrieves specific adapter by key', () => {
    const store = createSatelliteConnectStore({ adapter: [mockEvmAdapter, mockSolanaAdapter] });
    const evm = store.getState().getAdapter(OrbitAdapter.EVM);
    const solana = store.getState().getAdapter(OrbitAdapter.SOLANA);

    expect(evm?.key).toBe(OrbitAdapter.EVM);
    expect(solana?.key).toBe(OrbitAdapter.SOLANA);
  });

  it('connects to connector, updates state, and invokes callbackAfterConnected', async () => {
    const callbackAfterConnected = vi.fn();
    const store = createSatelliteConnectStore({
      adapter: mockEvmAdapter,
      callbackAfterConnected,
    });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    const state = store.getState();
    expect(state.activeConnection?.address).toBe('0x1234567890123456789012345678901234567890');
    expect(state.activeConnection?.isConnected).toBe(true);
    expect(state.connections[`${OrbitAdapter.EVM}:metamask` as ConnectorType]).toBeDefined();
    expect(state.connecting).toBe(false);
    expect(callbackAfterConnected).toHaveBeenCalledWith(
      expect.objectContaining({
        address: '0x1234567890123456789012345678901234567890',
      }),
    );
  });

  it('checks contract address during connection if adapter supports it', async () => {
    if (mockEvmAdapter.checkIsContractAddress) {
      vi.mocked(mockEvmAdapter.checkIsContractAddress).mockResolvedValueOnce(true);
    }
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    expect(mockEvmAdapter.checkIsContractAddress).toHaveBeenCalledWith({
      address: '0x1234567890123456789012345678901234567890',
      chainId: 1,
    });
    expect(store.getState().activeConnection?.isContractAddress).toBe(true);
  });

  it('sets connectionError when connect fails', async () => {
    mockEvmAdapter.connect = vi.fn().mockRejectedValue(new Error('User rejected connection'));
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    const state = store.getState();
    expect(state.connectionError).toBeDefined();
    expect(state.connectionError?.message).toContain('User rejected connection');
    expect(state.connecting).toBe(false);
  });

  it('handles connecting when no adapter is configured gracefully', async () => {
    const store = createSatelliteConnectStore({ adapter: [] });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
      chainId: 1,
    });

    const state = store.getState();
    expect(state.connectionError).toBeDefined();
    expect(state.connectionError?.message).toContain('No adapter found');
    expect(state.connecting).toBe(false);
  });

  it('switches connection if connecting to an already connected connector', async () => {
    const store = createSatelliteConnectStore({ adapter: [mockEvmAdapter, mockSolanaAdapter] });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });
    await store.getState().connect({
      connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
      chainId: 'solana:mainnet',
    });

    expect(store.getState().activeConnection?.connectorType).toBe(`${OrbitAdapter.SOLANA}:phantom`);

    // Connect to EVM again - should switch without calling adapter.connect again
    const evmConnectCount = vi.mocked(mockEvmAdapter.connect).mock.calls.length;
    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    expect(vi.mocked(mockEvmAdapter.connect).mock.calls.length).toBe(evmConnectCount);
    expect(store.getState().activeConnection?.connectorType).toBe(`${OrbitAdapter.EVM}:metamask`);
  });

  it('disconnects active connector and resets activeConnection when single connection', async () => {
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    await store.getState().disconnect();

    const state = store.getState();
    expect(state.activeConnection).toBeUndefined();
    expect(state.connections).toEqual({});
    expect(mockEvmAdapter.disconnect).toHaveBeenCalled();
  });

  it('disconnects specific connector and switches to remaining connector', async () => {
    const store = createSatelliteConnectStore({ adapter: [mockEvmAdapter, mockSolanaAdapter] });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });
    await store.getState().connect({
      connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
      chainId: 'solana:mainnet',
    });

    expect(store.getState().activeConnection?.connectorType).toBe(`${OrbitAdapter.SOLANA}:phantom`);

    // Disconnect active phantom connector
    await store.getState().disconnect(`${OrbitAdapter.SOLANA}:phantom`);

    const state = store.getState();
    expect(state.connections[`${OrbitAdapter.SOLANA}:phantom` as ConnectorType]).toBeUndefined();
    expect(state.connections[`${OrbitAdapter.EVM}:metamask` as ConnectorType]).toBeDefined();
    expect(state.activeConnection?.connectorType).toBe(`${OrbitAdapter.EVM}:metamask`);
  });

  it('disconnectAll cleans up all adapters and resets state', async () => {
    const store = createSatelliteConnectStore({ adapter: [mockEvmAdapter, mockSolanaAdapter] });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    await store.getState().disconnectAll();

    const state = store.getState();
    expect(state.activeConnection).toBeUndefined();
    expect(state.connections).toEqual({});
    expect(mockEvmAdapter.disconnect).toHaveBeenCalled();
    expect(mockSolanaAdapter.disconnect).toHaveBeenCalled();
  });

  it('delegates switchNetwork to adapter', async () => {
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    await store.getState().switchNetwork(137);

    expect(mockEvmAdapter.checkAndSwitchNetwork).toHaveBeenCalledWith(137, 1, expect.any(Function));
  });

  it('sets switchNetworkError when switchNetwork fails', async () => {
    mockEvmAdapter.checkAndSwitchNetwork = vi.fn().mockRejectedValue(new Error('Switch chain failed'));
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    await store.getState().switchNetwork(137);

    expect(store.getState().switchNetworkError).toBeDefined();
    expect(store.getState().switchNetworkError?.message).toContain('Switch chain failed');

    store.getState().resetSwitchNetworkError();
    expect(store.getState().switchNetworkError).toBeUndefined();
  });

  it('updates active connection properties via updateActiveConnection', async () => {
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });

    await store.getState().connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    store.getState().updateActiveConnection({ chainId: 10 });
    expect(store.getState().activeConnection?.chainId).toBe(10);
    expect(store.getState().connections[`${OrbitAdapter.EVM}:metamask` as ConnectorType]?.chainId).toBe(10);
  });

  it('allows resetting connection error', () => {
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });

    store.getState().setConnectionError(normalizeError(new Error('Custom error')));
    expect(store.getState().connectionError?.message).toBe('Custom error');

    store.getState().resetConnectionError();
    expect(store.getState().connectionError).toBeUndefined();
  });

  it('updates parameters dynamically', () => {
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });
    store.getState().updateParameters({ adapter: mockSolanaAdapter });

    const connectors = store.getState().getConnectors();
    expect(connectors[OrbitAdapter.SOLANA]).toHaveLength(1);
  });

  it('executes initializeAutoConnect without crashing', async () => {
    const store = createSatelliteConnectStore({ adapter: mockEvmAdapter });
    await expect(store.getState().initializeAutoConnect(false)).resolves.not.toThrow();
  });
});
