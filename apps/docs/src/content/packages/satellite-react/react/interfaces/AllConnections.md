# AllConnections

Defined in: [satellite-react/src/types.ts:7](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/types.ts#L7)

Connection types by chain family, filled by module augmentation. Importing `@tuwaio/satellite-react/evm` adds
`EVMConnection` from `@tuwaio/satellite-evm`, and importing `@tuwaio/satellite-react/solana` adds `SolanaConnection`
from `@tuwaio/satellite-solana`. It is empty until one of them is imported.

## Properties

### evm

> **evm**: [`EVMConnection`](/packages/satellite-evm/interfaces/EVMConnection.md)

Defined in: [satellite-react/src/evm/index.ts:23](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/evm/index.ts#L23)

EVM connections (`EVMConnection` from `@tuwaio/satellite-evm`), added by `@tuwaio/satellite-react/evm`.

***

### solana

> **solana**: [`SolanaConnection`](/packages/satellite-solana/interfaces/SolanaConnection.md)

Defined in: [satellite-react/src/solana/index.ts:23](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/solana/index.ts#L23)

Solana connections (`SolanaConnection` from `@tuwaio/satellite-solana`), added by `@tuwaio/satellite-react/solana`.
