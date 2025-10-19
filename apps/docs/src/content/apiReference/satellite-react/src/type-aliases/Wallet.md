[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# Wallet

> **Wallet** = [`AllWallets`](../interfaces/AllWallets.md)\[keyof [`AllWallets`](../interfaces/AllWallets.md)\]

Defined in: [packages/satellite-react/src/types.ts:23](https://github.com/TuwaIO/satellite-connect/blob/a751bf7909b1d5dc4468eac1be6a109ddcd81c6e/packages/satellite-react/src/types.ts#L23)

Union type for all supported wallet types.
It's created from the values of the AllWallets interface.
e.g., { evm: EVMWallet, solana: SolanaWallet } -> EVMWallet | SolanaWallet
