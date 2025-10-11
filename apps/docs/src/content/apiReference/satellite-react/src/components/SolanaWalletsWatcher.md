[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SolanaWalletsWatcher()

> **SolanaWalletsWatcher**(): `null`

Defined in: [packages/satellite-react/src/components/SolanaWalletsWatcher.tsx:18](https://github.com/TuwaIO/satellite-connect/blob/c337f9a8a23e924ee23b20305a08360b40fce7b0/packages/satellite-react/src/components/SolanaWalletsWatcher.tsx#L18)

React component that monitors Solana wallet connections and updates the Satellite store

## Returns

`null`

null - This is a headless component

## Remarks

This component watches for changes in connected Solana wallets using the Wallet Standard.
Currently handles the first active wallet only, with multi-wallet support planned for future.
It's a headless component that manages state synchronization between Wallet Standard and Satellite store.
