import { impersonatedHelpers } from '@tuwaio/orbit-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { impersonated, safeSdkOptions } from './index';

vi.mock('@tuwaio/orbit-core', () => ({
  impersonatedHelpers: {
    getImpersonated: vi.fn(),
  },
}));

describe('ImpersonatedConnector & safeSdkOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports valid safeSdkOptions', () => {
    expect(safeSdkOptions.allowedDomains).toHaveLength(3);
    expect(safeSdkOptions.debug).toBe(false);
  });

  it('creates an impersonated connector with correct metadata', () => {
    const connectorFn = impersonated({});
    const mockEmitter = { emit: vi.fn(), on: vi.fn() };
    const mockConfig = {
      chains: [{ id: 1, name: 'Mainnet', rpcUrls: { default: { http: ['https://rpc'] } } }],
      emitter: mockEmitter,
    } as any;

    const connector = connectorFn(mockConfig);

    expect(connector.id).toBe('impersonated');
    expect(connector.name).toBe('Impersonated Connector');
    expect(connector.type).toBe('impersonated');
  });

  it('handles connect and disconnect lifecycle', async () => {
    vi.mocked(impersonatedHelpers.getImpersonated).mockReturnValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');

    const connectorFn = impersonated({});
    const mockEmitter = { emit: vi.fn(), on: vi.fn() };
    const mockConfig = {
      chains: [{ id: 1, name: 'Mainnet', rpcUrls: { default: { http: ['https://rpc'] } } }],
      emitter: mockEmitter,
    } as any;

    const connector = connectorFn(mockConfig);
    await connector.setup?.();

    const connectResult = await connector.connect();
    expect(connectResult.chainId).toBe(1);

    const isAuth = await connector.isAuthorized();
    expect(isAuth).toBe(true);

    const accounts = await connector.getAccounts();
    expect(accounts[0].toLowerCase()).toBe('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');

    await connector.disconnect();
    const isAuthAfterDisconnect = await connector.isAuthorized();
    expect(isAuthAfterDisconnect).toBe(false);
  });

  it('throws connect error when connectError feature flag is enabled', async () => {
    const connectorFn = impersonated({
      features: {
        connectError: true,
      },
    });

    const mockConfig = {
      chains: [{ id: 1, name: 'Mainnet', rpcUrls: { default: { http: ['https://rpc'] } } }],
      emitter: { emit: vi.fn() },
    } as any;

    const connector = connectorFn(mockConfig);
    await expect(connector.connect()).rejects.toThrow('Failed to connect.');
  });
});
