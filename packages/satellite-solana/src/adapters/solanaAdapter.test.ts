import { address as adr, decimalFixedPointToString, lamportsToSol } from '@solana/kit';
import { ConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import * as orbitSolana from '@tuwaio/orbit-solana';
import type { UiWallet, UiWalletAccount } from '@wallet-standard/ui';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as connectionUtils from '../utils/connectionUtils';
import * as signerUtils from '../utils/signerUtils';
import { satelliteSolanaAdapter } from './solanaAdapter';

vi.mock('@solana/kit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@solana/kit')>();
  return {
    ...actual,
    address: vi.fn((a) => a),
    lamportsToSol: vi.fn(actual.lamportsToSol),
    decimalFixedPointToString: vi.fn(actual.decimalFixedPointToString),
  };
});

vi.mock('@tuwaio/orbit-solana', async (importOriginal) => ({
  getAvailableSolanaConnectors: vi.fn(),
  // The real parser: the adapter must turn every chain ID form into a cluster moniker
  getCluster: (await importOriginal<typeof import('@tuwaio/orbit-solana')>()).getCluster,
  getRpcUrlForCluster: vi.fn(() => 'https://api.mainnet-beta.solana.com'),
  createSolanaRPC: vi.fn(),
  getSolanaExplorerLink: vi.fn(),
  getSolanaAddressName: vi.fn(),
  getSolanaAddressAvatar: vi.fn(),
  watchAvailableSolanaConnectors: vi.fn(),
}));

vi.mock('../utils/signerUtils', () => ({
  createSolanaMessageSigner: vi.fn(() => vi.fn().mockResolvedValue('mockSig')),
}));

vi.mock('../utils/connectionUtils', () => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  unwrapUiWalletHandles: vi.fn(() => ({ wallet: {}, account: {} })),
}));

describe('satelliteSolanaAdapter', () => {
  const mockRpcUrls = {
    rpcUrls: {
      mainnet: 'https://api.mainnet-beta.solana.com',
      devnet: 'https://api.devnet.solana.com',
      testnet: 'https://api.testnet.solana.com',
    },
  };

  const mockPhantomWallet = {
    name: 'Phantom',
    icon: 'data:image/svg+xml;base64,mock',
    accounts: [{ address: 'PhantomSolanaAddress111111111111111111111' }],
  } as unknown as UiWallet;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with OrbitAdapter.SOLANA key', () => {
    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    expect(adapter.key).toBe(OrbitAdapter.SOLANA);
  });

  it('returns available connectors for Solana', () => {
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([mockPhantomWallet]);

    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    const result = adapter.getConnectors();

    expect(result.adapter).toBe(OrbitAdapter.SOLANA);
    expect(result.connectors).toHaveLength(1);
    expect(result.connectors[0].name).toBe('Phantom');
  });

  it('connects to connector successfully', async () => {
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([mockPhantomWallet]);
    vi.mocked(connectionUtils.connect).mockResolvedValue({
      uiWallet: mockPhantomWallet,
      accounts: [{ address: 'PhantomSolanaAddress111111111111111111111' } as any],
    });

    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    const connection = await adapter.connect({
      connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
      chainId: 'solana:mainnet',
    });

    expect(connection.address).toBe('PhantomSolanaAddress111111111111111111111');
    expect(connection.chainId).toBe('mainnet');
    expect(connection.isConnected).toBe(true);
    expect(connection.signMessage).toBeDefined();
    expect(signerUtils.createSolanaMessageSigner).toHaveBeenCalled();
  });

  it('throws error when connector cannot be found', async () => {
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([]);

    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    await expect(
      adapter.connect({
        connectorType: `${OrbitAdapter.SOLANA}:solflare` as ConnectorType,
        chainId: 'solana:mainnet',
      }),
    ).rejects.toThrow('Cannot find connector with this wallet type');
  });

  it('disconnects active wallet', async () => {
    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    await adapter.disconnect({
      connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
      connectedWallet: mockPhantomWallet,
    } as any);

    expect(connectionUtils.disconnect).toHaveBeenCalledWith(mockPhantomWallet);
  });

  // This test used to expect `standard:disconnect` for every registered wallet with accounts. A wallet can have
  // accounts because another store, library or tab connected it, so only the wallets this adapter connected are
  // disconnected.
  it('does not send standard:disconnect to a wallet with accounts that it did not connect', async () => {
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([mockPhantomWallet]);

    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    await adapter.disconnect();

    expect(connectionUtils.disconnect).not.toHaveBeenCalled();
    expect(await adapter.getLiveConnections?.()).toEqual([]);
  });

  it('disconnects the wallets it connected when no wallet is given, and only those', async () => {
    const mockSolflareWallet = {
      name: 'Solflare',
      accounts: [{ address: 'SolflareAddress1111111111111111111111111111' }],
    } as unknown as UiWallet;
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([mockPhantomWallet, mockSolflareWallet]);
    vi.mocked(connectionUtils.connect).mockResolvedValue({
      uiWallet: mockPhantomWallet,
      accounts: [{ address: 'PhantomSolanaAddress111111111111111111111' } as unknown as UiWalletAccount],
    });
    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    await adapter.connect({ connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType, chainId: 'mainnet' });
    expect(await adapter.getLiveConnections?.()).toEqual([
      expect.objectContaining({ connectorType: `${OrbitAdapter.SOLANA}:phantom`, connectedWallet: mockPhantomWallet }),
    ]);

    await adapter.disconnect();

    expect(connectionUtils.disconnect).toHaveBeenCalledTimes(1);
    expect(connectionUtils.disconnect).toHaveBeenCalledWith(mockPhantomWallet);
    expect(await adapter.getLiveConnections?.()).toEqual([]);

    // Disconnected wallets are forgotten
    await adapter.disconnect();
    expect(connectionUtils.disconnect).toHaveBeenCalledTimes(1);
  });

  it('forgets a wallet disconnected through its connection', async () => {
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([mockPhantomWallet]);
    vi.mocked(connectionUtils.connect).mockResolvedValue({
      uiWallet: mockPhantomWallet,
      accounts: [{ address: 'PhantomSolanaAddress111111111111111111111' } as unknown as UiWalletAccount],
    });
    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    const connection = await adapter.connect({
      connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
      chainId: 'mainnet',
    });

    await adapter.disconnect(connection);
    await adapter.disconnect();

    expect(connectionUtils.disconnect).toHaveBeenCalledTimes(1);
    expect(await adapter.getLiveConnections?.()).toEqual([]);
  });

  it('reconnects a wallet that still authorizes the app with a silent standard:connect', async () => {
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([mockPhantomWallet]);
    vi.mocked(connectionUtils.connect).mockResolvedValue({
      uiWallet: mockPhantomWallet,
      accounts: [{ address: 'PhantomSolanaAddress111111111111111111111' } as unknown as UiWalletAccount],
    });
    const adapter = satelliteSolanaAdapter(mockRpcUrls);

    const connection = await adapter.reconnect?.({
      connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
      chainId: 'solana:devnet',
    });

    expect(connectionUtils.connect).toHaveBeenCalledWith(mockPhantomWallet, { silent: true });
    expect(connection).toMatchObject({
      connectorType: `${OrbitAdapter.SOLANA}:phantom`,
      address: 'PhantomSolanaAddress111111111111111111111',
      chainId: 'devnet',
      isConnected: true,
    });
    expect(await adapter.getLiveConnections?.()).toHaveLength(1);
  });

  it('does not reconnect a wallet that refuses a silent standard:connect', async () => {
    // Phantom rejects a silent connect when the app is not trusted; other wallets return no accounts
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([mockPhantomWallet]);
    vi.mocked(connectionUtils.connect).mockRejectedValue(new Error('User rejected the request.'));
    const adapter = satelliteSolanaAdapter(mockRpcUrls);

    const connection = await adapter.reconnect?.({
      connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
      chainId: 'mainnet',
    });

    expect(connection).toBeUndefined();
    expect(await adapter.getLiveConnections?.()).toEqual([]);
  });

  it('updates active wallet on checkAndSwitchNetwork', async () => {
    const updateActiveWallet = vi.fn();
    const adapter = satelliteSolanaAdapter(mockRpcUrls);

    await adapter.checkAndSwitchNetwork('solana:devnet', 'mainnet', updateActiveWallet);

    expect(updateActiveWallet).toHaveBeenCalledWith({
      chainId: 'devnet',
      rpcURL: 'https://api.mainnet-beta.solana.com',
    });
  });

  it('keeps the cluster moniker as chainId when connecting with a genesis-hash chain ID', async () => {
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([mockPhantomWallet]);
    vi.mocked(connectionUtils.connect).mockResolvedValue({
      uiWallet: mockPhantomWallet,
      accounts: [{ address: 'PhantomSolanaAddress111111111111111111111' } as any],
    });

    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    const connection = await adapter.connect({
      connectorType: `${OrbitAdapter.SOLANA}:phantom` as ConnectorType,
      chainId: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    });

    expect(connection.chainId).toBe('devnet');
    expect(orbitSolana.getRpcUrlForCluster).toHaveBeenCalledWith({ cluster: 'devnet', rpcUrls: mockRpcUrls.rpcUrls });
  });

  it('switches to the cluster of a genesis-hash chain ID', async () => {
    const updateActiveWallet = vi.fn();
    const adapter = satelliteSolanaAdapter(mockRpcUrls);

    await adapter.checkAndSwitchNetwork('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1', 'mainnet', updateActiveWallet);

    expect(updateActiveWallet).toHaveBeenCalledWith({
      chainId: 'devnet',
      rpcURL: 'https://api.mainnet-beta.solana.com',
    });
  });

  it('does not update the connection when the requested chain ID names its current cluster', async () => {
    const updateActiveWallet = vi.fn();
    const adapter = satelliteSolanaAdapter(mockRpcUrls);

    await adapter.checkAndSwitchNetwork('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1', 'devnet', updateActiveWallet);
    await adapter.checkAndSwitchNetwork('solana:devnet', 'devnet', updateActiveWallet);

    expect(updateActiveWallet).not.toHaveBeenCalled();
  });

  it('retrieves balance via @solana/kit and formats to SOL string', async () => {
    const mockSend = vi.fn().mockResolvedValue({ value: 2500000000n });
    const mockGetBalance = vi.fn().mockReturnValue({ send: mockSend });
    vi.mocked(orbitSolana.createSolanaRPC).mockReturnValue({
      getBalance: mockGetBalance,
    } as any);

    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    const balance = await adapter.getBalance('PhantomAddress', 'solana:mainnet');

    expect(adr).toHaveBeenCalledWith('PhantomAddress');
    expect(lamportsToSol).toHaveBeenCalledWith(2500000000n);
    expect(decimalFixedPointToString).toHaveBeenCalled();
    expect(balance).toEqual({
      value: '2.5',
      symbol: 'SOL',
    });
  });

  it('correctly handles zero balance (0n) as "0"', async () => {
    const mockSend = vi.fn().mockResolvedValue({ value: 0n });
    const mockGetBalance = vi.fn().mockReturnValue({ send: mockSend });
    vi.mocked(orbitSolana.createSolanaRPC).mockReturnValue({
      getBalance: mockGetBalance,
    } as any);

    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    const balance = await adapter.getBalance('EmptyAccountAddress', 'solana:mainnet');

    expect(balance).toEqual({
      value: '0',
      symbol: 'SOL',
    });
  });

  it('correctly handles fractional lamports (1n) without precision loss', async () => {
    const mockSend = vi.fn().mockResolvedValue({ value: 1n });
    const mockGetBalance = vi.fn().mockReturnValue({ send: mockSend });
    vi.mocked(orbitSolana.createSolanaRPC).mockReturnValue({
      getBalance: mockGetBalance,
    } as any);

    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    const balance = await adapter.getBalance('MicroAccountAddress', 'solana:mainnet');

    expect(balance).toEqual({
      value: '0.000000001',
      symbol: 'SOL',
    });
  });

  it('delegates getExplorerUrl, getName, and getAvatar to orbit-solana', async () => {
    vi.mocked(orbitSolana.getSolanaExplorerLink).mockReturnValue('https://solscan.io/tx/123');
    vi.mocked(orbitSolana.getSolanaAddressName).mockResolvedValue('alex.sol');
    vi.mocked(orbitSolana.getSolanaAddressAvatar).mockResolvedValue('https://avatar.png');

    const adapter = satelliteSolanaAdapter(mockRpcUrls);

    expect(adapter.getExplorerUrl?.('123', 'solana:mainnet')).toBe('https://solscan.io/tx/123');
    expect(await adapter.getName?.('address')).toBe('alex.sol');
    expect(await adapter.getAvatar?.('alex.sol')).toBe('https://avatar.png');
  });

  it('switches connection to specified connector type', async () => {
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([mockPhantomWallet]);
    const adapter = satelliteSolanaAdapter(mockRpcUrls);

    await adapter.switchConnection?.(`${OrbitAdapter.SOLANA}:phantom` as ConnectorType);
    expect(connectionUtils.connect).toHaveBeenCalledWith(mockPhantomWallet);
  });

  it('throws when switching to unknown connector type', async () => {
    vi.mocked(orbitSolana.getAvailableSolanaConnectors).mockReturnValue([]);
    const adapter = satelliteSolanaAdapter(mockRpcUrls);

    await expect(adapter.switchConnection?.(`${OrbitAdapter.SOLANA}:phantom` as ConnectorType)).rejects.toThrow(
      'Cannot find connector with type',
    );
  });

  it('watches Wallet Standard registrations with orbit-solana and returns its stop', () => {
    const stop = vi.fn();
    vi.mocked(orbitSolana.watchAvailableSolanaConnectors).mockReturnValue(stop);
    const adapter = satelliteSolanaAdapter(mockRpcUrls);
    const onChange = vi.fn();

    const result = adapter.watchConnectors?.(onChange);

    expect(orbitSolana.watchAvailableSolanaConnectors).toHaveBeenCalledTimes(1);
    expect(result).toBe(stop);
    const [forwarded] = vi.mocked(orbitSolana.watchAvailableSolanaConnectors).mock.calls[0];
    forwarded();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith();
    expect(stop).not.toHaveBeenCalled();
  });
});
