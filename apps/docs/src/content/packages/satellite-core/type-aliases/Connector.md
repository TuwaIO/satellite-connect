# Connector\<W\>

> **Connector**\<`W`\> = [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md) \| `W`

Defined in: [types.ts:66](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L66)

A connection in the store: the base fields, or a chain-specific connection type `W`.

## Type Parameters

### W

`W` *extends* [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md)

Chain-specific connection type, for example `EVMConnection` from `@tuwaio/satellite-evm`.
