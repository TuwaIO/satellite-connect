# ImpersonatedProvider

> **ImpersonatedProvider** = `object`

Defined in: [satellite-evm/src/connectors/ImpersonatedConnector.ts:44](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L44)

The provider that the [impersonated](/packages/satellite-evm/functions/impersonated.md) connector returns from `getProvider`: a `custom` transport of `viem`.

## Properties

### config

> **config**: `TransportConfig`\<`"custom"`, `EIP1193RequestFn`\>

Defined in: [satellite-evm/src/connectors/ImpersonatedConnector.ts:46](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L46)

Settings of the `custom` transport of `viem` (one retry).

***

### request

> **request**: `EIP1193RequestFn`\<`WalletRpcSchema`\>

Defined in: [satellite-evm/src/connectors/ImpersonatedConnector.ts:52](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L52)

Answers `eth_accounts`, `eth_requestAccounts`, `eth_chainId` and `wallet_switchEthereumChain` locally, sends
`personal_sign` as `eth_sign` and every other request to the first default RPC URL of the chain. The errors that
`features` simulate are thrown locally, before anything is sent.

***

### value?

> `optional` **value?**: `NonNullable`\<`unknown`\>

Defined in: [satellite-evm/src/connectors/ImpersonatedConnector.ts:54](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L54)

Not set by the connector: the key is present with the value `undefined`, as in every `viem` transport.
