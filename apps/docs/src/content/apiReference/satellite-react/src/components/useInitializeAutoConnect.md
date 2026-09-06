[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# useInitializeAutoConnect()

> **useInitializeAutoConnect**(`props`): `void`

Defined in: [packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx:42](https://github.com/TuwaIO/satellite-connect/blob/2c21a9769a545a040d3a9c69ab8d5776bece2752/packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx#L42)

Custom hook for initializing connector auto-connection with error handling.

## Parameters

### props

`InitializeAutoConnectProps`

Hook configuration

## Returns

`void`

## Remarks

This hook handles the initial connection logic (e.g., checking for a previously
connected connector) when a component mounts.
It provides default error handling with console.error if no custom handler is provided.
The initialization runs only once when the component mounts.

## Example

```tsx
// Basic usage with default error handling
useInitializeAutoConnect({
 initializeAutoConnect: store.initializeAutoConnect
});

// With custom error handling
useInitializeAutoConnect({
 initializeAutoConnect: store.initializeAutoConnect,
 onError: (error) => {
   toast.error(`Failed to auto-connect: ${error.message}`);
}
});
```
