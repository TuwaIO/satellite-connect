[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useInitializeAppConnectors()

> **useInitializeAppConnectors**(`props`): `void`

Defined in: [packages/satellite-react/src/hooks/useInitializeConnectors.tsx:40](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-react/src/hooks/useInitializeConnectors.tsx#L40)

Custom hook for initializing wallet connectors with error handling

## Parameters

### props

`InitializeConnectorsProps`

Hook configuration

## Returns

`void`

## Remarks

This hook handles the initialization of blockchain wallet connectors when a component mounts.
It provides default error handling with console.error if no custom handler is provided.
The initialization runs only once when the component mounts.

## Example

```tsx
// Basic usage with default error handling
useInitializeAppConnectors({
  initializeAppConnectors: store.initializeAppConnectors
});
// With custom error handling
useInitializeAppConnectors({
  initializeAppConnectors: store.initializeAppConnectors,
  onError: (error) => {
    toast.error(`Failed to initialize wallets: ${error.message}`);
  }
});
```
