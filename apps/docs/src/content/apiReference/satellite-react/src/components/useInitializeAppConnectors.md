[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useInitializeAppConnectors()

> **useInitializeAppConnectors**(`props`): `void`

Defined in: [packages/satellite-react/src/hooks/useInitializeConnectors.tsx:40](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-react/src/hooks/useInitializeConnectors.tsx#L40)

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
