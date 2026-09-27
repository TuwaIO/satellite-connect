import { impersonatedHelpers } from '@tuwaio/orbit-core';
import { ChainNotConfiguredError, createConnector } from '@wagmi/core';
import {
  type Address,
  custom,
  type EIP1193RequestFn,
  fromHex,
  getAddress,
  type Hex,
  numberToHex,
  RpcRequestError,
  SwitchChainError,
  type Transport,
  UserRejectedRequestError,
  type WalletRpcSchema,
  zeroAddress,
} from 'viem';
import { rpc } from 'viem/utils';

/**
 * Options of {@link impersonated}.
 */
export type ImpersonatedParameters = {
  /**
   * Simulated wallet errors. `true` throws a `UserRejectedRequestError` from `viem`; an `Error` is thrown as is.
   */
  features?: {
    /** Error thrown by `connect`. */
    connectError?: boolean | Error;
    /** Error thrown by `wallet_switchEthereumChain`. */
    switchChainError?: boolean | Error;
    /** Error thrown by `personal_sign`. */
    signMessageError?: boolean | Error;
    /** Error thrown by `eth_signTypedData_v4`. */
    signTypedDataError?: boolean | Error;
    /** Not used by the connector. */
    reconnect?: boolean;
  };
};

impersonated.type = 'impersonated' as const;
/**
 * Creates a wagmi connector that acts as a wallet for any address, for development and testing (for example against
 * an Anvil or Hardhat node that impersonates accounts). Add it to the `connectors` of your wagmi config; it appears
 * in Satellite Connect as `"evm:impersonatedwallet"` and is never reconnected automatically.
 *
 * On every provider request the connector reads the address to impersonate from `localStorage`
 * (`satellite-connect:impersonatedAddress`, set with `impersonatedHelpers.setImpersonated` from `@tuwaio/orbit-core`)
 * and returns it for `eth_accounts` and `eth_requestAccounts` (no account when the key is empty). `eth_chainId` and
 * `wallet_switchEthereumChain` are answered locally (only chains of the wagmi config can be selected). `personal_sign`
 * is sent as `eth_sign`, and every other request (for example `eth_sendTransaction`) is sent as is to the first
 * default RPC URL of the chain wagmi asks for (the first chain of the wagmi config by default). Public RPC nodes reject
 * signing requests; use a local node that impersonates the address.
 *
 * @param parameters - Connector options. `features` simulate wallet errors.
 * @returns A wagmi connector factory with the id `impersonated` and the name `Impersonated Connector`.
 *
 * @example
 * ```ts
 * import { impersonatedHelpers } from '@tuwaio/orbit-core';
 * import { impersonated } from '@tuwaio/satellite-evm';
 * import { createConfig, http } from '@wagmi/core';
 * import { foundry } from 'viem/chains';
 *
 * export const wagmiConfig = createConfig({
 *   chains: [foundry],
 *   connectors: [impersonated({ features: { signMessageError: false } })],
 *   transports: { [foundry.id]: http() },
 * });
 *
 * impersonatedHelpers.setImpersonated('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
 * ```
 */
export function impersonated(parameters: ImpersonatedParameters) {
  const features = parameters.features ?? {};

  type Provider = ReturnType<Transport<'custom', NonNullable<unknown>, EIP1193RequestFn<WalletRpcSchema>>>;
  let connected = false;
  let connectedChainId: number;
  let accountAddress: Hex[] | undefined = undefined;

  return createConnector<Provider>((config) => ({
    id: 'impersonated',
    name: 'Impersonated Connector',
    type: impersonated.type,

    /**
     * Initial setup - sets default chain ID
     */
    async setup() {
      connectedChainId = config.chains[0].id;
    },
    /**
     * Simulates wallet connection
     * @throws {UserRejectedRequestError} When connection is rejected
     */
    // @ts-expect-error - not typed correctly
    async connect({ chainId } = {}) {
      if (features.connectError) {
        if (typeof features.connectError === 'boolean')
          throw new UserRejectedRequestError(new Error('Failed to connect.'));
        throw features.connectError;
      }

      const { request } = await this.getProvider();
      const accounts = await request({
        method: 'eth_requestAccounts',
      });

      let currentChainId = await this.getChainId();
      if (chainId && currentChainId !== chainId) {
        const chain = await this.switchChain!({ chainId });
        currentChainId = chain.id;
      }

      connected = true;
      return { accounts, chainId: currentChainId };
    },

    /**
     * Simulates wallet disconnection
     */
    async disconnect() {
      connected = false;
      accountAddress = undefined;
    },

    /**
     * Returns impersonated accounts
     * @throws {Error} When not connected
     */
    async getAccounts() {
      if (!connected) throw new Error('Not connected connector');
      const { request } = await this.getProvider();
      const accounts = await request({ method: 'eth_accounts' });
      return accounts.map(getAddress);
    },

    /**
     * Returns current chain ID
     */
    async getChainId() {
      const { request } = await this.getProvider();
      const hexChainId = await request({ method: 'eth_chainId' });
      return fromHex(hexChainId, 'number');
    },

    /**
     * Checks if wallet is connected and authorized
     */
    async isAuthorized() {
      if (!connected) return false;
      const accounts = await this.getAccounts();
      return !!accounts.length;
    },

    /**
     * Simulates switching to a different chain
     * @throws {SwitchChainError} When chain is not configured
     * @throws {UserRejectedRequestError} When switch is rejected
     */
    async switchChain({ chainId }) {
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
      // @ts-expect-error - request is not typed correctly
      const { request } = await this.getProvider();
      await request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: numberToHex(chainId) }],
      });
      return chain;
    },

    /**
     * Handles account changes
     */
    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect();
      else config.emitter.emit('change', { accounts: accounts.map(getAddress) });
    },

    /**
     * Handles chain changes
     */
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit('change', { chainId });
    },

    /**
     * Handles disconnection
     */
    async onDisconnect() {
      config.emitter.emit('disconnect');
      connected = false;
      accountAddress = undefined;
    },

    /**
     * Creates an EIP-1193 compatible provider
     * @returns Custom provider instance
     */
    async getProvider({ chainId }: { chainId?: number } = {}) {
      accountAddress = impersonatedHelpers?.getImpersonated()
        ? [(impersonatedHelpers.getImpersonated() as Address) || zeroAddress]
        : undefined;
      const chain = config.chains.find((x) => x.id === chainId) ?? config.chains[0];
      const url = chain.rpcUrls.default.http[0]!;

      const request: EIP1193RequestFn = async ({ method, params }) => {
        // eth methods
        if (method === 'eth_chainId') return numberToHex(connectedChainId);
        if (method === 'eth_requestAccounts' || method === 'eth_accounts') return accountAddress ?? [];
        if (method === 'eth_signTypedData_v4')
          if (features.signTypedDataError) {
            if (typeof features.signTypedDataError === 'boolean')
              throw new UserRejectedRequestError(new Error('Failed to sign typed data.'));
            throw features.signTypedDataError;
          }

        // wallet methods
        if (method === 'wallet_switchEthereumChain') {
          if (features.switchChainError) {
            if (typeof features.switchChainError === 'boolean')
              throw new UserRejectedRequestError(new Error('Failed to switch chain.'));
            throw features.switchChainError;
          }
          type Params = [{ chainId: Hex }];
          connectedChainId = fromHex((params as Params)[0].chainId, 'number');
          this.onChainChanged(connectedChainId.toString());
          return;
        }

        // other methods
        if (method === 'personal_sign') {
          if (features.signMessageError) {
            if (typeof features.signMessageError === 'boolean')
              throw new UserRejectedRequestError(new Error('Failed to sign message.'));
            throw features.signMessageError;
          }
          // Change `personal_sign` to `eth_sign` and swap params
          method = 'eth_sign';
          type Params = [data: Hex, address: Address];
          params = [(params as Params)[1], (params as Params)[0]];
        }

        const body = { method, params };
        const { error, result } = await rpc.http(url, { body });
        if (error) throw new RpcRequestError({ body, error, url });

        return result;
      };
      return custom({ request })({ retryCount: 1 });
    },
  }));
}
