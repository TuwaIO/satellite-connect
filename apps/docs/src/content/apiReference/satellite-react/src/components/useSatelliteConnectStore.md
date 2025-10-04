[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useSatelliteConnectStore()

> **useSatelliteConnectStore**\<`T`\>(`selector`): `T`

Defined in: [packages/satellite-react/src/hooks/satteliteHook.ts:30](https://github.com/TuwaIO/satellite-connect/blob/b5a5df814a87c8fe0a316d5477bd4d7f974c2f09/packages/satellite-react/src/hooks/satteliteHook.ts#L30)

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
