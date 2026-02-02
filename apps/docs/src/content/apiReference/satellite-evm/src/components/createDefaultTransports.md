[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createDefaultTransports()

> **createDefaultTransports**(`chains`): `Record`\<`number`, `Transport`\>

Defined in: [packages/satellite-evm/src/utils/createDefaultTransports.ts:12](https://github.com/TuwaIO/satellite-connect/blob/5165cfe1709d78008f46e258905376857c41e22e/packages/satellite-evm/src/utils/createDefaultTransports.ts#L12)

Creates default HTTP transports for each chain in the configuration

## Parameters

### chains

readonly \[`Chain`, `Chain`\]

Array of chain configurations from wagmi

## Returns

`Record`\<`number`, `Transport`\>

Object mapping chain IDs to their corresponding HTTP transport instances
