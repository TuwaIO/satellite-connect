# Connection

> **Connection** = [`AllConnections`](/packages/satellite-react/react/interfaces/AllConnections.md)\[keyof [`AllConnections`](/packages/satellite-react/react/interfaces/AllConnections.md)\]

Defined in: [satellite-react/src/types.ts:20](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/types.ts#L20)

Union of the connection types in [AllConnections](/packages/satellite-react/react/interfaces/AllConnections.md), for example `EVMConnection | SolanaConnection`. The store of
`SatelliteConnectProvider` uses it for `activeConnection` and `connections`.
