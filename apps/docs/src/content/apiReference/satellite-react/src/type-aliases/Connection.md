[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# Connection

> **Connection** = [`AllConnections`](../interfaces/AllConnections.md)\[keyof [`AllConnections`](../interfaces/AllConnections.md)\]

Defined in: [packages/satellite-react/src/types.ts:23](https://github.com/TuwaIO/satellite-connect/blob/04bc1577f48691732cc4a47367fe11e97b8591f0/packages/satellite-react/src/types.ts#L23)

Union type for all supported connection types.
It's created from the values of the AllConnections interface.
e.g., { evm: EVMConnection, solana: SolanaConnection } -> EVMConnection | SolanaConnection
