[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# Connection

> **Connection** = [`AllConnections`](../interfaces/AllConnections.md)\[keyof [`AllConnections`](../interfaces/AllConnections.md)\]

Defined in: [packages/satellite-react/src/types.ts:23](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-react/src/types.ts#L23)

Union type for all supported connection types.
It's created from the values of the AllConnections interface.
e.g., { evm: EVMConnection, solana: SolanaConnection } -> EVMConnection | SolanaConnection
