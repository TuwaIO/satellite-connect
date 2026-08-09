[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# useSatelliteConnectStore()

> **useSatelliteConnectStore**\<`T`\>(`selector`): `T`

Defined in: [packages/satellite-react/src/hooks/satelliteHook.ts:44](https://github.com/TuwaIO/satellite-connect/blob/3100b674a54b85a17ea4c0ad08b2dc3831c543a9/packages/satellite-react/src/hooks/satelliteHook.ts#L44)

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
