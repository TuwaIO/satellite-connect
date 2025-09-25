[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# EVMWalletsWatcher()

> **EVMWalletsWatcher**(`props`): `null`

Defined in: [packages/satellite-react/src/components/EVMWalletsWatcher.tsx:19](https://github.com/TuwaIO/satellite-connect/blob/3665b1d14479f81479de58c9ee0423967cf0e219/packages/satellite-react/src/components/EVMWalletsWatcher.tsx#L19)

React component that watches for EVM wallet account changes and updates the Satellite store

## Parameters

### props

Component properties

#### wagmiConfig

`Config`

Wagmi configuration instance

## Returns

`null`

null - This is a headless component

## Remarks

This component acts as a bridge between Wagmi account state and Satellite store.
It doesn't render anything visible but maintains wallet state synchronization.
