# useSatelliteConnectStore()

> **useSatelliteConnectStore**\<`T`\>(`selector`): `T`

Defined in: [satellite-react/src/hooks/satelliteHook.ts:52](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/hooks/satelliteHook.ts#L52)

Reads a value from the store of [SatelliteConnectProvider](/packages/satellite-react/react/functions/SatelliteConnectProvider.md) and re-renders the component when it changes
(compared with `Object.is`, through `useStore` from `zustand`). Return stable values from the selector: a new
object or array on every call causes endless re-renders (use `useShallow` from `zustand/react/shallow`).

## Type Parameters

### T

`T`

Type of the selected value.

## Parameters

### selector

(`state`) => `T`

Selects a value from the store state (`ISatelliteConnectStore` from `@tuwaio/satellite-core`).

## Returns

`T`

The selected value.

## Throws

`useSatelliteConnectStore must be used within a SatelliteConnectProvider` outside the provider.

## Example

```tsx
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

export function ActiveAddress() {
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
  return <span>{activeConnection?.address ?? 'Not connected'}</span>;
}
```
