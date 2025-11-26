[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# Wallet

> **Wallet** = [`AllWallets`](../interfaces/AllWallets.md)\[keyof [`AllWallets`](../interfaces/AllWallets.md)\]

Defined in: [packages/satellite-react/src/types.ts:23](https://github.com/TuwaIO/satellite-connect/blob/1351903076ca2b07210ecabc0ddd83e3f344643b/packages/satellite-react/src/types.ts#L23)

Union type for all supported wallet types.
It's created from the values of the AllWallets interface.
e.g., { evm: EVMWallet, solana: SolanaWallet } -> EVMWallet | SolanaWallet
