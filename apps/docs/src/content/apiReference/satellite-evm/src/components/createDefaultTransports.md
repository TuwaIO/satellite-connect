[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createDefaultTransports()

> **createDefaultTransports**(`chains`): `Record`\<`number`, `Transport`\>

Defined in: [packages/satellite-evm/src/utils/createDefaultTransports.ts:12](https://github.com/TuwaIO/satellite-connect/blob/18f7905e8a053e9b9f65ecb30d52056ce522074c/packages/satellite-evm/src/utils/createDefaultTransports.ts#L12)

Creates default HTTP transports for each chain in the configuration

## Parameters

### chains

readonly \[`Chain`, `Chain`\]

Array of chain configurations from wagmi

## Returns

`Record`\<`number`, `Transport`\>

Object mapping chain IDs to their corresponding HTTP transport instances
