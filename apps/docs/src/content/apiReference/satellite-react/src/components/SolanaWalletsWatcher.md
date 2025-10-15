[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SolanaWalletsWatcher()

> **SolanaWalletsWatcher**(): `null`

Defined in: [packages/satellite-react/src/components/SolanaWalletsWatcher.tsx:23](https://github.com/TuwaIO/satellite-connect/blob/ad1c386a1ceca62d7daa5c4247777e23ab533b39/packages/satellite-react/src/components/SolanaWalletsWatcher.tsx#L23)

React component that monitors Solana wallet connections and updates the Satellite store

## Returns

`null`

null - This is a headless component

## Remarks

This component watches for changes in connected Solana wallets using the Wallet Standard.
Currently handles the first active wallet only, with multi-wallet support planned for future.
It's a headless component that manages state synchronization between Wallet Standard and Satellite store.
