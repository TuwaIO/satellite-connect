[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# Wallet

> **Wallet** = [`AllWallets`](../interfaces/AllWallets.md)\[keyof [`AllWallets`](../interfaces/AllWallets.md)\]

Defined in: [packages/satellite-react/src/types.ts:23](https://github.com/TuwaIO/satellite-connect/blob/f5b462c7dc3303fb7f6769f339389e88bb5e74c2/packages/satellite-react/src/types.ts#L23)

Union type for all supported wallet types.
It's created from the values of the AllWallets interface.
e.g., { evm: EVMWallet, solana: SolanaWallet } -> EVMWallet | SolanaWallet
