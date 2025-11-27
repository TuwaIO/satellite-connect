[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createDefaultTransports()

> **createDefaultTransports**(`chains`): `Record`\<`number`, `Transport`\>

Defined in: [packages/satellite-evm/src/utils/createDefaultTransports.ts:12](https://github.com/TuwaIO/satellite-connect/blob/a5851f3886a2dc5393e77ccbe9b58f8c344ba1aa/packages/satellite-evm/src/utils/createDefaultTransports.ts#L12)

Creates default HTTP transports for each chain in the configuration

## Parameters

### chains

readonly \[`Chain`, `Chain`\]

Array of chain configurations from wagmi

## Returns

`Record`\<`number`, `Transport`\>

Object mapping chain IDs to their corresponding HTTP transport instances
