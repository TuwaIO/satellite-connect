[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getCluster()

> **getCluster**(`walletCluster`): `string`

Defined in: [packages/orbit-solana/src/utils/clusterHelpers.ts:12](https://github.com/TuwaIO/satellite-connect/blob/8fde9e197b7a14ec109c9b43b6cba4ec9463a434/packages/orbit-solana/src/utils/clusterHelpers.ts#L12)

Safely extracts the cluster moniker from a chain identifier.
Handles both full chain IDs ('solana:mainnet-beta') and simple monikers ('mainnet-beta').

## Parameters

### walletCluster

#### cluster?

`string`

#### walletCluster?

`string`

## Returns

`string`

The extracted cluster moniker.
