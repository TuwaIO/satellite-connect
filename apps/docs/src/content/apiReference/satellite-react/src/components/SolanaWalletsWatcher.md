[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SolanaWalletsWatcher()

> **SolanaWalletsWatcher**(): `null`

Defined in: [packages/satellite-react/src/components/SolanaWalletsWatcher.tsx:17](https://github.com/TuwaIO/satellite-connect/blob/4db4fd2faf1732916ae8fd5a07ca3381fe492a8f/packages/satellite-react/src/components/SolanaWalletsWatcher.tsx#L17)

React component that monitors Solana wallet connections and updates the Satellite store

## Returns

`null`

null - This is a headless component

## Remarks

This component watches for changes in connected Solana wallets using the Wallet Standard.
Currently handles the first active wallet only, with multi-wallet support planned for future.
It's a headless component that manages state synchronization between Wallet Standard and Satellite store.
