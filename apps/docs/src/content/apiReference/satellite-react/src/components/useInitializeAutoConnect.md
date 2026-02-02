[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useInitializeAutoConnect()

> **useInitializeAutoConnect**(`props`): `void`

Defined in: [packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx:42](https://github.com/TuwaIO/satellite-connect/blob/5165cfe1709d78008f46e258905376857c41e22e/packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx#L42)

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
