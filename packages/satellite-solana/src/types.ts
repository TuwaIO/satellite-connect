import { BaseWallet } from '@tuwaio/satellite-core';
import { UiWallet, UiWalletAccount } from '@wallet-standard/ui';

/**
 * Extended wallet interface for Solana-specific properties
 */
export interface SolanaWallet extends BaseWallet {
  /** Connected Wallet Standard account */
  connectedAccount?: UiWalletAccount;
  /** Connected Wallet Standard wallet instance */
  connectedWallet?: UiWallet;
}

/** Solana-specific connector type */
export type ConnectorSolana = UiWallet;
