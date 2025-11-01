[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useSatelliteConnectStore()

> **useSatelliteConnectStore**\<`T`\>(`selector`): `T`

Defined in: [packages/satellite-react/src/hooks/satteliteHook.ts:32](https://github.com/TuwaIO/satellite-connect/blob/1db3ae446421f606d3fb60c08e8ea3374b90edd2/packages/satellite-react/src/hooks/satteliteHook.ts#L32)

Custom hook for accessing the Satellite Connect store state

## Type Parameters

### T

`T`

The type of the selected state slice

## Parameters

### selector

(`state`) => `T`

Function that selects a slice of the store state

## Returns

`T`

Selected state slice

## Remarks

This hook provides type-safe access to the Satellite store state and must be used
within a component that is wrapped by SatelliteConnectProvider.

## Throws

Error if used outside of SatelliteConnectProvider

## Example

```tsx
// Get the active wallet
const activeWallet = useSatelliteConnectStore((state) => state.activeWallet);
```
