[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ImpersonatedParameters

> **ImpersonatedParameters** = `object`

Defined in: [packages/satellite-evm/src/connectors/ImpersonatedConnector.ts:19](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L19)

## Properties

### features?

> `optional` **features**: `object`

Defined in: [packages/satellite-evm/src/connectors/ImpersonatedConnector.ts:21](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L21)

#### connectError?

> `optional` **connectError**: `boolean` \| `Error`

#### reconnect?

> `optional` **reconnect**: `boolean`

#### signMessageError?

> `optional` **signMessageError**: `boolean` \| `Error`

#### signTypedDataError?

> `optional` **signTypedDataError**: `boolean` \| `Error`

#### switchChainError?

> `optional` **switchChainError**: `boolean` \| `Error`

***

### getAccountAddress()

> **getAccountAddress**: () => `string` \| `undefined`

Defined in: [packages/satellite-evm/src/connectors/ImpersonatedConnector.ts:20](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L20)

#### Returns

`string` \| `undefined`
