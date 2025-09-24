/**
 * Checks whether the given chain ID belongs to a Solana network.
 * Supports common Solana network names: 'devnet', 'testnet', 'mainnet-beta', 'mainnet'.
 *
 * @param {number | string} chainId - The chain ID or chain name.
 * @returns {boolean} - True if the chain ID corresponds to a Solana network, false otherwise.
 */
export function isSolanaChain(chainId: number | string): boolean {
  if (typeof chainId === 'string') {
    return ['devnet', 'testnet', 'mainnet-beta', 'mainnet'].includes(chainId);
  }
  return false;
}

/**
 * Sets the chain ID to a Solana-specific format if the chain is a Solana network.
 *
 * @param {number | string} chainId - The original chain ID or name.
 * @returns {string | number} - The formatted chain ID prefixed with 'solana:' if Solana, otherwise the original.
 */
export function setChainId(chainId: number | string): string | number {
  if (isSolanaChain(chainId)) {
    return `solana:${chainId}`;
  } else {
    return chainId;
  }
}
