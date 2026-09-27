# ImpersonatedParameters

> **ImpersonatedParameters** = `object`

Defined in: [satellite-evm/src/connectors/ImpersonatedConnector.ts:23](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L23)

Options of [impersonated](/packages/satellite-evm/functions/impersonated.md).

## Properties

### features?

> `optional` **features?**: `object`

Defined in: [satellite-evm/src/connectors/ImpersonatedConnector.ts:27](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L27)

Simulated wallet errors. `true` throws a `UserRejectedRequestError` from `viem`; an `Error` is thrown as is.

#### connectError?

> `optional` **connectError?**: `boolean` \| `Error`

Error thrown by `connect`.

#### reconnect?

> `optional` **reconnect?**: `boolean`

Not used by the connector.

#### signMessageError?

> `optional` **signMessageError?**: `boolean` \| `Error`

Error thrown by `personal_sign`.

#### signTypedDataError?

> `optional` **signTypedDataError?**: `boolean` \| `Error`

Error thrown by `eth_signTypedData_v4`.

#### switchChainError?

> `optional` **switchChainError?**: `boolean` \| `Error`

Error thrown by `wallet_switchEthereumChain`.
