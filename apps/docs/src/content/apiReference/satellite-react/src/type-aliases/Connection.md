[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# Connection

> **Connection** = [`AllConnections`](../interfaces/AllConnections.md)\[keyof [`AllConnections`](../interfaces/AllConnections.md)\]

Defined in: [packages/satellite-react/src/types.ts:23](https://github.com/TuwaIO/satellite-connect/blob/9f4f7e34240bb6bcc8762ec09eac60f20f6396f5/packages/satellite-react/src/types.ts#L23)

Union type for all supported connection types.
It's created from the values of the AllConnections interface.
e.g., { evm: EVMConnection, solana: SolanaConnection } -> EVMConnection | SolanaConnection
