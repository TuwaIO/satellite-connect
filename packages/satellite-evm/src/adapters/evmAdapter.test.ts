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
  const mockConfig = {} as Config;
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

  it('disconnects all connectors when no active connector provided', async () => {
    vi.mocked(wagmiCore.getConnectors).mockReturnValue([mockMetaMaskConnector, mockSafeConnector]);
    const adapter = satelliteEVMAdapter(mockConfig, mockChains);

    await adapter.disconnect();

    expect(wagmiCore.disconnect).toHaveBeenCalledTimes(2);
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
