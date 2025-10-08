[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useInitializeAutoConnect()

> **useInitializeAutoConnect**(`props`): `void`

Defined in: [packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx:42](https://github.com/TuwaIO/satellite-connect/blob/ab7853a2b67d56c430b290eecda2a29d74515c99/packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx#L42)

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
