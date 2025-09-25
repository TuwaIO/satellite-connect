import { OrbitAdapter } from '@tuwaio/orbit-core';

export function getWalletTypeFromConnectorName(adapter: OrbitAdapter, name: string) {
  return `${adapter}:${name.replace(/\s+/g, '').toLowerCase()}`;
}
