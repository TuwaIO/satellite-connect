[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# InitializeConnectorsProvider()

> **InitializeConnectorsProvider**(`props`): `null`

Defined in: [packages/satellite-react/src/providers/InitializeConnectorsProvider.tsx:26](https://github.com/TuwaIO/satellite-connect/blob/d5f27c9ecfc7c137261f9e98cbe815c1fb13b3f0/packages/satellite-react/src/providers/InitializeConnectorsProvider.tsx#L26)

Provider component that handles wallet connectors initialization

## Parameters

### props

`InitializeConnectorsProviderProps`

Component properties

## Returns

`null`

null - This is a headless component

## Remarks

This is a headless component that initializes wallet connectors when mounted.
It integrates with the Satellite Connect store and supports automatic reconnection
to the last used wallet via the autoConnect prop.
