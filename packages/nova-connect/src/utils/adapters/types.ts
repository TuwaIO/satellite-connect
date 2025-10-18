/**
 * Generic chain adapter interface that provides blockchain-specific functionality.
 *
 * This interface abstracts the differences between various blockchain architectures
 * (EVM, Solana, Starknet, etc.) while providing a consistent API for chain operations.
 * Each adapter implementation handles the specifics of its blockchain type.
 *
 * @interface ChainAdapter
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // EVM adapter usage
 * const evmAdapter = await createEvmAdapter();
 * const evmChains = evmAdapter.getChains([
 *   { id: 1, name: 'Ethereum' },
 *   { id: 137, name: 'Polygon' }
 * ]);
 *
 * // Solana adapter usage
 * const solanaAdapter = await createSolanaAdapter();
 * const solanaClusters = solanaAdapter.getChains({
 *   'mainnet-beta': 'https://api.mainnet-beta.solana.com'
 * });
 * ```
 */
export interface ChainAdapter {
  /**
   * Extracts chain identifiers from the provided configuration.
   *
   * The exact behavior depends on the blockchain type:
   * - EVM: Extracts numeric chain IDs from chain objects or arrays
   * - Solana: Extracts cluster names from RPC URL configurations
   * - Others: Implementation-specific logic
   *
   * @param config Chain configuration data (format varies by blockchain)
   * @param chains Optional array of specific chains to filter or process
   * @returns Array of chain identifiers (numbers for EVM, strings for Solana)
   *
   * @example
   * ```typescript
   * // EVM chains
   * const evmChains = adapter.getChains([
   *   { id: 1, name: 'Ethereum' },
   *   { id: 56, name: 'BSC' }
   * ]);
   * // Returns: [1, 56]
   *
   * // Solana clusters
   * const solanaClusters = adapter.getChains({
   *   'mainnet-beta': 'https://api.mainnet-beta.solana.com',
   *   devnet: 'https://api.devnet.solana.com'
   * });
   * // Returns: ['mainnet-beta', 'devnet']
   * ```
   */
  getChains(config: any, chains?: any): (string | number)[];

  /**
   * Validates whether a chain identifier array conforms to this adapter's expected format.
   *
   * Different blockchains use different identifier formats:
   * - EVM: Typically numeric chain IDs (e.g., 1, 137, 56)
   * - Solana: String cluster names (e.g., 'mainnet-beta', 'devnet')
   * - Others: Implementation-specific validation rules
   *
   * @param chains Array of chain identifiers to validate
   * @returns True if the chain list format is valid for this blockchain type
   *
   * @example
   * ```typescript
   * // EVM validation
   * const evmValid = evmAdapter.isChainList([1, 137, 56]); // true
   * const evmInvalid = evmAdapter.isChainList(['mainnet']); // false
   *
   * // Solana validation
   * const solanaValid = solanaAdapter.isChainList(['mainnet-beta', 'devnet']); // true
   * const solanaInvalid = solanaAdapter.isChainList([1, 2]); // false
   * ```
   */
  isChainList(chains: (string | number)[]): boolean;

  /**
   * Gets all available clusters for Solana-based adapters.
   *
   * This method is specific to Solana and returns the configured cluster names
   * that can be used for connections. Not applicable to other blockchain types.
   *
   * @returns Array of available cluster names
   * @optional This method is only available on Solana adapters
   *
   * @example
   * ```typescript
   * const solanaAdapter = await createSolanaAdapter();
   * const clusters = solanaAdapter.getAvailableClusters?.();
   * // Might return: ['mainnet-beta', 'devnet', 'testnet', 'localnet']
   * ```
   */
  getAvailableClusters?(): string[];

  /**
   * Validates whether a cluster name is valid for Solana.
   *
   * This method is specific to Solana and checks if the provided cluster name
   * is a known/valid Solana cluster moniker. Not applicable to other blockchain types.
   *
   * @param cluster Cluster name to validate
   * @returns True if the cluster name is valid for Solana
   * @optional This method is only available on Solana adapters
   *
   * @example
   * ```typescript
   * const solanaAdapter = await createSolanaAdapter();
   * const isValid = solanaAdapter.isValidCluster?.('mainnet-beta'); // true
   * const isInvalid = solanaAdapter.isValidCluster?.('invalid-cluster'); // false
   * ```
   */
  isValidCluster?(cluster: string): boolean;
}

/**
 * Represents the current loading state of a blockchain adapter.
 *
 * The adapter lifecycle progresses through these states:
 * - `idle`: Adapter hasn't been requested yet
 * - `loading`: Adapter is currently being loaded/initialized
 * - `loaded`: Adapter is successfully loaded and ready for use
 * - `error`: Adapter failed to load due to missing dependencies or errors
 *
 * @type AdapterLoadStatus
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * import { adapterRegistry } from './registry';
 *
 * const status = adapterRegistry.getAdapterStatus(OrbitAdapter.EVM);
 *
 * switch (status) {
 *   case 'idle':
 *     console.log('EVM adapter not yet requested');
 *     break;
 *   case 'loading':
 *     console.log('EVM adapter is loading...');
 *     break;
 *   case 'loaded':
 *     console.log('EVM adapter ready for use');
 *     break;
 *   case 'error':
 *     console.log('EVM adapter failed to load');
 *     break;
 * }
 * ```
 */
export type AdapterLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Complete information about an adapter's loading state and instance.
 *
 * This interface tracks both the loading status and the actual adapter instance
 * (if successfully loaded), along with any error information if loading failed.
 *
 * @interface AdapterInfo
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Internal registry usage (not typically used directly)
 * const adapterInfo: AdapterInfo = {
 *   status: 'loaded',
 *   adapter: evmAdapterInstance
 * };
 *
 * // Error case
 * const errorInfo: AdapterInfo = {
 *   status: 'error',
 *   error: new Error('EVM utilities not available')
 * };
 * ```
 */
export interface AdapterInfo {
  /** Current loading status of the adapter */
  status: AdapterLoadStatus;

  /** The loaded adapter instance (only present when status is 'loaded') */
  adapter?: ChainAdapter;

  /** Error information (only present when status is 'error') */
  error?: Error;
}
