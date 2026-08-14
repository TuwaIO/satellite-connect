[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# createDefaultTransports()

> **createDefaultTransports**(`chains`): `Record`\<`number`, `Transport`\>

Defined in: [packages/satellite-evm/src/utils/createDefaultTransports.ts:12](https://github.com/TuwaIO/satellite-connect/blob/3f5b07315cb97c4319f66a4a3cf4b3c1646a1d35/packages/satellite-evm/src/utils/createDefaultTransports.ts#L12)

Creates default HTTP transports for each chain in the configuration

## Parameters

### chains

readonly \[`Chain`, `Chain`\]

Array of chain configurations from wagmi

## Returns

`Record`\<`number`, `Transport`\>

Object mapping chain IDs to their corresponding HTTP transport instances
