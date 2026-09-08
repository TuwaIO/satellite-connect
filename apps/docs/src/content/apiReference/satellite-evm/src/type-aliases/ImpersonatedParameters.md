[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# ImpersonatedParameters

> **ImpersonatedParameters** = `object`

Defined in: [packages/satellite-evm/src/connectors/ImpersonatedConnector.ts:23](https://github.com/TuwaIO/satellite-connect/blob/a24a5bcfe7208bf3a88225e8ffcd1f09f200e658/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L23)

Configuration parameters for impersonated wallet connector

## Properties

### features?

> `optional` **features?**: `object`

Defined in: [packages/satellite-evm/src/connectors/ImpersonatedConnector.ts:25](https://github.com/TuwaIO/satellite-connect/blob/a24a5bcfe7208bf3a88225e8ffcd1f09f200e658/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L25)

Optional feature flags for testing error scenarios

#### connectError?

> `optional` **connectError?**: `boolean` \| `Error`

Simulate connection error

#### reconnect?

> `optional` **reconnect?**: `boolean`

Enable reconnection behavior

#### signMessageError?

> `optional` **signMessageError?**: `boolean` \| `Error`

Simulate message signing error

#### signTypedDataError?

> `optional` **signTypedDataError?**: `boolean` \| `Error`

Simulate typed data signing error

#### switchChainError?

> `optional` **switchChainError?**: `boolean` \| `Error`

Simulate chain switching error
