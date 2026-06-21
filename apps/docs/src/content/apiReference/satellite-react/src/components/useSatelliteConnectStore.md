[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# useSatelliteConnectStore()

> **useSatelliteConnectStore**\<`T`\>(`selector`): `T`

Defined in: [packages/satellite-react/src/hooks/satelliteHook.ts:34](https://github.com/TuwaIO/satellite-connect/blob/4dc5e53b7865b93ff739877e5e76169fb4e1bfaa/packages/satellite-react/src/hooks/satelliteHook.ts#L34)

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
// Get the active connection
const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
```
