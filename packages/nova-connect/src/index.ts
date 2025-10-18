export * from './components';
export * from './i18n/en';
export * from './i18n/types';
export * from './i18n/ua';
export * from './types';
export * from './utils';

// Conditional exports using dynamic imports
// This approach allows optional dependencies

// Check if EVM dependencies are available and export if they are
let evmExports: any = {};
try {
  require.resolve('viem/chains');
  require.resolve('@tuwaio/orbit-core');
  require.resolve('@tuwaio/orbit-evm');
  // eslint-disable-next-line
  evmExports = require('./evm');
} catch {
  // viem not available - skip EVM exports
}

// Check if Solana dependencies are available and export if they are
let solanaExports: any = {};
try {
  require.resolve('gill');
  require.resolve('@tuwaio/orbit-core');
  require.resolve('@tuwaio/orbit-solana');
  // eslint-disable-next-line
  solanaExports = require('./solana');
} catch {
  // gill or orbit-solana not available - skip Solana exports
}

// Re-export all EVM utilities if available
export const { Chain: EvmChain, getEvmChains, isEvmChainList, ...restEvmExports } = evmExports;

// Re-export all Solana utilities if available
export const {
  SolanaClusterMoniker,
  getSolanaClusters,
  isSolanaChainList,
  getAvailableSolanaClusters,
  isValidSolanaCluster,
  ...restSolanaExports
} = solanaExports;
