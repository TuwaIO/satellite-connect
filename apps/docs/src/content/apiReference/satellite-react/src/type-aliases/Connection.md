[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# Connection

> **Connection** = [`AllConnections`](../interfaces/AllConnections.md)\[keyof [`AllConnections`](../interfaces/AllConnections.md)\]

Defined in: [packages/satellite-react/src/types.ts:23](https://github.com/TuwaIO/satellite-connect/blob/82df95a5dc3a3bae59d1d18b3a499206af825e4b/packages/satellite-react/src/types.ts#L23)

Union type for all supported connection types.
It's created from the values of the AllConnections interface.
e.g., { evm: EVMConnection, solana: SolanaConnection } -> EVMConnection | SolanaConnection
