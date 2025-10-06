[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getCluster()

> **getCluster**(`__namedParameters`): `string`

Defined in: [packages/orbit-solana/src/utils/clusterHelpers.ts:12](https://github.com/TuwaIO/satellite-connect/blob/4db4fd2faf1732916ae8fd5a07ca3381fe492a8f/packages/orbit-solana/src/utils/clusterHelpers.ts#L12)

Safely extracts the cluster moniker from a chain identifier.
Handles both full chain IDs ('solana:mainnet-beta') and simple monikers ('mainnet-beta').

## Parameters

### \_\_namedParameters

#### cluster?

`string`

#### walletCluster?

`string`

## Returns

`string`

The extracted cluster moniker.
