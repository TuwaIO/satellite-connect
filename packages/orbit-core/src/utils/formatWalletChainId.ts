import { OrbitAdapter } from '../types';

export function formatWalletChainId(chainId: string | number, connectedAdapter: OrbitAdapter) {
  if (typeof chainId === 'string') {
    return `${connectedAdapter}:${chainId}`;
  } else {
    return chainId;
  }
}
