[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# Wallet

> **Wallet** = [`AllWallets`](../interfaces/AllWallets.md)\[keyof [`AllWallets`](../interfaces/AllWallets.md)\]

Defined in: [packages/satellite-react/src/types.ts:23](https://github.com/TuwaIO/satellite-connect/blob/7152f5954aced9a2f352b283101af590ca9b12b7/packages/satellite-react/src/types.ts#L23)

Union type for all supported wallet types.
It's created from the values of the AllWallets interface.
e.g., { evm: EVMWallet, solana: SolanaWallet } -> EVMWallet | SolanaWallet
