# AllConnectors

Defined in: [satellite-react/src/types.ts:14](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/types.ts#L14)

Wallet connector types by chain family, filled by module augmentation like [AllConnections](/packages/satellite-react/react/interfaces/AllConnections.md): the wagmi
`Connector` for EVM and the Wallet Standard `UiWallet` for Solana.

## Properties

### evm

> **evm**: [`ConnectorEVM`](/packages/satellite-evm/type-aliases/ConnectorEVM.md)

Defined in: [satellite-react/src/evm/index.ts:27](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/evm/index.ts#L27)

wagmi connectors (`ConnectorEVM` from `@tuwaio/satellite-evm`), added by `@tuwaio/satellite-react/evm`.

***

### solana

> **solana**: `UiWallet`

Defined in: [satellite-react/src/solana/index.ts:27](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/solana/index.ts#L27)

Wallet Standard wallets (`ConnectorSolana` from `@tuwaio/satellite-solana`), added by `@tuwaio/satellite-react/solana`.
