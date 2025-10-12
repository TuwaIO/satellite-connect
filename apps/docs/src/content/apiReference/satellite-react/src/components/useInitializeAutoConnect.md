[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useInitializeAutoConnect()

> **useInitializeAutoConnect**(`props`): `void`

Defined in: [packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx:42](https://github.com/TuwaIO/satellite-connect/blob/330d436180fd8c24c21d7c546c36112e47df500b/packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx#L42)

Custom hook for initializing wallet auto-connection with error handling.

## Parameters

### props

`InitializeAutoConnectProps`

Hook configuration

## Returns

`void`

## Remarks

This hook handles the initial connection logic (e.g., checking for a previously
connected wallet) when a component mounts.
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
