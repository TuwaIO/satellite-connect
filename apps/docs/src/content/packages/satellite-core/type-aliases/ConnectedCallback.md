# ConnectedCallback\<W\>

> **ConnectedCallback**\<`W`\> = (`connector`) => `void` \| `Promise`\<`void`\>

Defined in: [types.ts:323](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L323)

Callback run by `connect` after a new wallet is connected, with the connection (including `isContractAddress`).
`connect` awaits it; if it throws or rejects, the error is stored in `connectionError` and the connection is not
saved as the last connection.

## Type Parameters

### W

`W` *extends* [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md) = [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md)

Chain-specific connection type.

## Parameters

### connector

[`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>

The new active connection.

## Returns

`void` \| `Promise`\<`void`\>

Nothing, or a promise that `connect` awaits.
