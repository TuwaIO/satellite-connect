import { ConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import * as orbitEvm from '@tuwaio/orbit-evm';
import type { Config, Connector as WagmiConnector } from '@wagmi/core';
import * as wagmiCore from '@wagmi/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as contractUtils from '../utils/checkIsWalletAddressContract';
import { satelliteEVMAdapter } from './evmAdapter';

vi.mock('@wagmi/core', () => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  getBalance: vi.fn(),
  getChains: vi.fn(),
  getConnection: vi.fn(),
  getConnectors: vi.fn(),
  signMessage: vi.fn(),
  switchChain: vi.fn(),
  switchConnection: vi.fn(),
}));

vi.mock('@tuwaio/orbit-evm', () => ({
  checkAndSwitchChain: vi.fn(),
  getAddress: vi.fn(),
  getAvatar: vi.fn(),
  getName: vi.fn(),
}));

vi.mock('../utils/checkIsWalletAddressContract', () => ({
  checkIsWalletAddressContract: vi.fn(),
}));

describe('satelliteEVMAdapter', () => {
  // A wagmi config holds its connections in `state`
  const mockConfig = { state: { connections: new Map(), current: null } } as unknown as Config;
  const mockChains = [{ id: 1, name: 'Mainnet' }] as any;

  const mockMetaMaskConnector = {
    name: 'MetaMask',
    icon: 'data:image/svg+xml;base64,icon',
    getChainId: vi.fn().mockResolvedValue(1),
  } as unknown as WagmiConnector;

  const mockSafeConnector = {
    name: 'Safe',
    getChainId: vi.fn().mockResolvedValue(5),
  } as unknown as WagmiConnector;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws an error if wagmi config is not provided', () => {
    expect(() => satelliteEVMAdapter(undefined as any, mockChains)).toThrow(
      'Satellite EVM adapter requires a wagmi config object.',
    );
  });

  it('initializes with OrbitAdapter.EVM key', () => {
    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    expect(adapter.key).toBe(OrbitAdapter.EVM);
  });

  it('returns connectors for EVM', () => {
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([mockMetaMaskConnector]);
    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    const result = adapter.getConnectors();

    expect(result.adapter).toBe(OrbitAdapter.EVM);
    expect(result.connectors).toHaveLength(1);
    expect(result.connectors[0].name).toBe('MetaMask');
  });

  it('connects to connector successfully', async () => {
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([mockMetaMaskConnector]);
    vi.mocked(wagmiCore.connect).mockResolvedValue({} as any);
    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      isConnected: true,
      chain: {
        rpcUrls: {
          default: {
            http: ['https://eth.llamarpc.com'],
          },
        },
      },
    } as any);

    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    const connection = await adapter.connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    expect(wagmiCore.connect).toHaveBeenCalledWith(mockConfig, {
      connector: mockMetaMaskConnector,
      chainId: 1,
    });
    expect(connection.address).toBe('0x1234567890123456789012345678901234567890');
    expect(connection.isConnected).toBe(true);
    expect(connection.rpcURL).toBe('https://eth.llamarpc.com');
  });

  it('throws an error if connector is not found on connect', async () => {
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([]);
    const adapter = satelliteEVMAdapter(mockConfig, mockChains);

    await expect(
      adapter.connect({
        connectorType: `${OrbitAdapter.EVM}:nonexistent` as ConnectorType,
        chainId: 1,
      }),
    ).rejects.toThrow('Cannot find connector with this wallet type');
  });

  it('disconnects active connector', async () => {
    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    await adapter.disconnect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      address: '0x123',
      chainId: 1,
      rpcURL: 'https://rpc',
      isContractAddress: false,
      isConnected: true,
      connector: mockMetaMaskConnector,
    } as any);

    expect(wagmiCore.disconnect).toHaveBeenCalledWith(mockConfig, {
      connector: mockMetaMaskConnector,
    });
  });

  // This test used to expect a disconnect of every connector of the config. wagmi asks each connector it disconnects to
  // revoke the app's permission, which MetaMask applies to the whole origin, so only the live connections this adapter
  // opened are disconnected.
  it('disconnects only the live wagmi connections it opened when no active connector is provided', async () => {
    const metaMask = { ...mockMetaMaskConnector, uid: 'metamask-uid' } as unknown as WagmiConnector;
    const safe = { ...mockSafeConnector, uid: 'safe-uid' } as unknown as WagmiConnector;
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([metaMask, safe]);
    vi.mocked(wagmiCore.getConnection).mockReturnValue({ address: '0x1', chainId: 1, isConnected: true } as any);
    // Safe is live too, but opened by other code (for example `WagmiProvider` restored it)
    const config = {
      state: {
        connections: new Map([[safe.uid, { connector: safe, accounts: ['0x2'], chainId: 1 }]]),
        current: safe.uid,
      },
    } as unknown as Config;
    vi.mocked(wagmiCore.connect).mockImplementationOnce(async (_config, parameters) => {
      const connector = parameters.connector as WagmiConnector;
      config.state.connections.set(connector.uid, { connector, accounts: ['0x1'], chainId: 1 });
      return {} as any;
    });
    const adapter = satelliteEVMAdapter(config, mockChains);
    await adapter.connect({ connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType, chainId: 1 });

    await adapter.disconnect();

    expect(wagmiCore.disconnect).toHaveBeenCalledTimes(1);
    expect(wagmiCore.disconnect).toHaveBeenCalledWith(config, { connector: metaMask });
  });

  it('never disconnects connectors without a live connection or connections saved by an earlier page load', async () => {
    const metaMask = { ...mockMetaMaskConnector, uid: 'metamask-uid' } as unknown as WagmiConnector;
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([metaMask]);
    // wagmi rehydrates the connections of its storage with plain `{ id, name, type, uid }` connectors of the last page
    const saved = { id: 'io.metamask', name: 'MetaMask', type: 'injected', uid: 'old-uid' };
    const config = {
      state: { connections: new Map([['old-uid', { connector: saved, accounts: ['0x1'], chainId: 1 }]]) },
    } as unknown as Config;

    await satelliteEVMAdapter(config, mockChains).disconnect();

    expect(wagmiCore.disconnect).not.toHaveBeenCalled();
  });

  it('lists the live wagmi connections it opened as connections', async () => {
    const metaMask = { ...mockMetaMaskConnector, uid: 'metamask-uid' } as unknown as WagmiConnector;
    const safe = { ...mockSafeConnector, uid: 'safe-uid' } as unknown as WagmiConnector;
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([metaMask, safe]);
    vi.mocked(wagmiCore.getConnection).mockReturnValue({ address: '0xAbc', chainId: 10, isConnected: true } as any);
    vi.mocked(wagmiCore.getChains).mockReturnValue([
      { id: 10, rpcUrls: { default: { http: ['https://mainnet.optimism.io'] } } },
    ] as unknown as ReturnType<typeof wagmiCore.getChains>);
    const config = {
      state: {
        connections: new Map([
          [metaMask.uid, { connector: metaMask, accounts: ['0xAbc'], chainId: 10 }],
          [safe.uid, { connector: safe, accounts: ['0xDef'], chainId: 10 }],
        ]),
        current: metaMask.uid,
      },
    } as unknown as Config;
    const adapter = satelliteEVMAdapter(config, mockChains);
    await adapter.connect({ connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType, chainId: 10 });

    const connections = await adapter.getLiveConnections?.();

    expect(connections).toEqual([
      expect.objectContaining({
        connectorType: `${OrbitAdapter.EVM}:metamask`,
        address: '0xAbc',
        chainId: 10,
        rpcURL: 'https://mainnet.optimism.io',
        isConnected: true,
        connector: metaMask,
      }),
    ]);
  });

  it('takes over a connection that wagmi already holds instead of asking the wallet to connect again', async () => {
    const metaMask = { ...mockMetaMaskConnector, uid: 'metamask-uid' } as unknown as WagmiConnector;
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([metaMask]);
    vi.mocked(wagmiCore.getConnection).mockReturnValue({ address: '0xAbc', chainId: 1, isConnected: true } as any);
    vi.mocked(wagmiCore.switchChain).mockRejectedValueOnce(new Error('User rejected the request.'));
    const config = {
      state: {
        connections: new Map([[metaMask.uid, { connector: metaMask, accounts: ['0xAbc'], chainId: 1 }]]),
        current: 'other-uid',
      },
    } as unknown as Config;

    const connection = await satelliteEVMAdapter(config, mockChains).connect({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 10,
    });

    expect(wagmiCore.connect).not.toHaveBeenCalled();
    expect(wagmiCore.switchConnection).toHaveBeenCalledWith(config, { connector: metaMask });
    expect(wagmiCore.switchChain).toHaveBeenCalledWith(config, { chainId: 10, connector: metaMask });
    // The wallet declined the chain: the connection stays on its chain
    expect(connection).toMatchObject({ address: '0xAbc', chainId: 1, isConnected: true });
  });

  it('reconnects a wallet that still authorizes the app without asking it for accounts', async () => {
    const getAccounts = vi.fn().mockResolvedValue(['0x1234567890123456789012345678901234567890']);
    const metaMask = { ...mockMetaMaskConnector, uid: 'metamask-uid', getAccounts } as unknown as WagmiConnector;
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([metaMask]);
    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      isConnected: true,
      chain: { rpcUrls: { default: { http: ['https://eth.llamarpc.com'] } } },
    } as unknown as ReturnType<typeof wagmiCore.getConnection>);
    const config = { state: { connections: new Map(), current: null } } as unknown as Config;

    const connection = await satelliteEVMAdapter(config, mockChains).reconnect?.({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    expect(wagmiCore.connect).toHaveBeenCalledWith(config, { connector: metaMask, isReconnecting: true });
    expect(wagmiCore.switchChain).not.toHaveBeenCalled();
    expect(connection).toMatchObject({ address: '0x1234567890123456789012345678901234567890', chainId: 1 });
  });

  it('does not reconnect a wallet without authorized accounts', async () => {
    const metaMask = {
      ...mockMetaMaskConnector,
      uid: 'metamask-uid',
      getAccounts: vi.fn().mockResolvedValue([]),
    } as unknown as WagmiConnector;
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([metaMask]);
    const config = { state: { connections: new Map(), current: null } } as unknown as Config;

    const connection = await satelliteEVMAdapter(config, mockChains).reconnect?.({
      connectorType: `${OrbitAdapter.EVM}:metamask` as ConnectorType,
      chainId: 1,
    });

    expect(connection).toBeUndefined();
    expect(wagmiCore.connect).not.toHaveBeenCalled();
  });

  it('delegates checkAndSwitchNetwork to orbit-evm', async () => {
    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    await adapter.checkAndSwitchNetwork(137);

    expect(orbitEvm.checkAndSwitchChain).toHaveBeenCalledWith(137, mockConfig);
  });

  it('retrieves balance and formats units', async () => {
    vi.mocked(wagmiCore.getBalance).mockResolvedValue({
      value: 1500000000000000000n,
      decimals: 18,
      symbol: 'ETH',
    });

    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    const balance = await adapter.getBalance('0x123', 1);

    expect(balance).toEqual({
      value: '1.5',
      symbol: 'ETH',
    });
  });

  it('generates explorer URLs', () => {
    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      chain: {
        blockExplorers: {
          default: {
            url: 'https://etherscan.io',
          },
        },
      },
    } as any);

    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    expect(adapter.getExplorerUrl?.('tx/0x123')).toBe('https://etherscan.io/tx/0x123');
    expect(adapter.getExplorerUrl?.('')).toBe('https://etherscan.io');
  });

  it('returns undefined instead of an "undefined/..." URL when the chain has no explorer', () => {
    vi.mocked(wagmiCore.getConnection).mockReturnValue({ chain: { id: 31337, name: 'Anvil' } } as any);

    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    expect(adapter.getExplorerUrl('/tx/0x123')).toBeUndefined();
    expect(adapter.getExplorerUrl()).toBeUndefined();
  });

  it('joins explorer paths with a single slash', () => {
    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      chain: { blockExplorers: { default: { url: 'https://etherscan.io/' } } },
    } as any);

    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    expect(adapter.getExplorerUrl('/address/0xabc')).toBe('https://etherscan.io/address/0xabc');
  });

  it('builds the explorer URL for the requested chain', () => {
    vi.mocked(wagmiCore.getConnection).mockReturnValue({
      chain: { id: 1, blockExplorers: { default: { url: 'https://etherscan.io' } } },
    } as any);
    vi.mocked(wagmiCore.getChains).mockReturnValue([
      { id: 10, blockExplorers: { default: { url: 'https://optimistic.etherscan.io' } } },
    ] as any);

    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    expect(adapter.getExplorerUrl('/tx/0x1', 10)).toBe('https://optimistic.etherscan.io/tx/0x1');
    expect(adapter.getExplorerUrl('/tx/0x1', '10')).toBe('https://optimistic.etherscan.io/tx/0x1');
  });

  it('delegates getName, getAvatar, and getAddress', async () => {
    vi.mocked(orbitEvm.getName).mockResolvedValue('vitalik.eth');
    vi.mocked(orbitEvm.getAvatar).mockResolvedValue('https://avatar.png');
    vi.mocked(orbitEvm.getAddress).mockResolvedValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');

    const adapter = satelliteEVMAdapter(mockConfig, mockChains);

    expect(await adapter.getName?.('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe('vitalik.eth');
    expect(await adapter.getAvatar?.('vitalik.eth')).toBe('https://avatar.png');
    expect(await adapter.getAddress?.('vitalik.eth')).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  });

  it('checks contract address via checkIsWalletAddressContract', async () => {
    vi.mocked(wagmiCore.getChains).mockReturnValue(mockChains);
    vi.mocked(contractUtils.checkIsWalletAddressContract).mockResolvedValue(true);

    const adapter = satelliteEVMAdapter(mockConfig, mockChains);
    const isContract = await adapter.checkIsContractAddress?.({
      address: '0xContract',
      chainId: 1,
    });

    expect(isContract).toBe(true);
  });

  it('retrieves safe connector chain ID when Safe is available', async () => {
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([mockSafeConnector]);
    const adapter = satelliteEVMAdapter(mockConfig, mockChains);

    const safeChainId = await adapter.getSafeConnectorChainId?.();
    expect(safeChainId).toBe(5);
  });

  it('returns undefined safe connector chain ID when Safe is not available', async () => {
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([mockMetaMaskConnector]);
    const adapter = satelliteEVMAdapter(mockConfig, mockChains);

    const safeChainId = await adapter.getSafeConnectorChainId?.();
    expect(safeChainId).toBeUndefined();
  });

  it('switches connection to specified connector type', async () => {
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([mockMetaMaskConnector]);
    const adapter = satelliteEVMAdapter(mockConfig, mockChains);

    await adapter.switchConnection?.(`${OrbitAdapter.EVM}:metamask` as ConnectorType);
    expect(wagmiCore.switchConnection).toHaveBeenCalledWith(mockConfig, {
      connector: mockMetaMaskConnector,
    });
  });

  it('throws when switching to an unknown connector type', async () => {
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([]);
    const adapter = satelliteEVMAdapter(mockConfig, mockChains);

    await expect(adapter.switchConnection?.(`${OrbitAdapter.EVM}:phantom` as ConnectorType)).rejects.toThrow(
      'Cannot find connector with type',
    );
  });
});
