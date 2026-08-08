[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# Connection

> **Connection** = \[keyof [`AllConnections`](../interfaces/AllConnections.md)\] *extends* \[`never`\] ? `BaseConnector` : [`AllConnections`](../interfaces/AllConnections.md)\[keyof [`AllConnections`](../interfaces/AllConnections.md)\]

Defined in: [packages/satellite-react/src/types.ts:25](https://github.com/TuwaIO/satellite-connect/blob/22adf069ed75795efa77b02fc7c5f28791f37973/packages/satellite-react/src/types.ts#L25)

Union type for all supported connection types.
It's created from the values of the AllConnections interface.
e.g., { evm: EVMConnection, solana: SolanaConnection } -> EVMConnection | SolanaConnection
