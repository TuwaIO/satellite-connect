import { BaseConnector } from '@tuwaio/satellite-core';
import { UiWallet, UiWalletAccount } from '@wallet-standard/ui';

/**
 * A Solana connection in the Satellite Connect store: `BaseConnector` from `@tuwaio/satellite-core` plus the Wallet
 * Standard handles of the wallet and account. `chainId` is a cluster moniker (for example `"devnet"`) and
 * `signMessage` returns a base58 signature.
 */
export interface SolanaConnection extends BaseConnector {
  /** Wallet Standard UI handle of the connected account (the first account of the wallet). */
  connectedAccount?: UiWalletAccount;
  /** Wallet Standard UI handle of the connected wallet. */
  connectedWallet?: UiWallet;
}

/** A Wallet Standard `UiWallet` from `@wallet-standard/ui`: the wallets returned by `getConnectors` of the Solana adapter. */
export type ConnectorSolana = UiWallet;
