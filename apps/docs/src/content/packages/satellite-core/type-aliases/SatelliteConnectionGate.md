# SatelliteConnectionGate\<W\>

> **SatelliteConnectionGate**\<`W`\> = (`connection`, `context`) => `Promise`\<`void`\> \| `void`

Defined in: [types.ts:476](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L476)

What a wallet must pass to count as connected, such as a sign-in. It runs after the wallet has connected and before the
store shows it: while it runs `connecting` stays `true` and neither `activeConnection` nor `connections` hold the wallet.
Throw or reject to refuse it, and the store goes on as if it had never connected.

## Type Parameters

### W

`W` *extends* [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md) = [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md)

Chain-specific connection type.

## Parameters

### connection

[`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>

The wallet, which can already sign with `signMessage`.

### context

Why it is asked.

#### isRestore

`boolean`

Whether the wallet comes back after a page load, when nobody has asked for it: refuse a wallet
that needs something of a person instead of asking.

## Returns

`Promise`\<`void`\> \| `void`

Resolves when it passes.

## Throws

What it throws is the refusal: it goes to `connectionError`, except for a restore.
