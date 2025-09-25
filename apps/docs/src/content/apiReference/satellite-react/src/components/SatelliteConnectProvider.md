[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteConnectProvider()

> **SatelliteConnectProvider**(`props`): `Element`

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:50](https://github.com/TuwaIO/satellite-connect/blob/5ea2bf35da638317e8edf885c3993433cb84e778/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L50)

Provider component that manages wallet connections and state

## Parameters

### props

`SatelliteConnectProviderProps`

Component properties including store parameters and children

## Returns

`Element`

## Remarks

This component creates and provides the Satellite Connect store context to its children.
It handles wallet connections, state management, and automatic reconnection functionality.
The store is memoized to ensure stable reference across renders.

## Example

```tsx
// Basic usage with single adapter
<SatelliteConnectProvider adapter={solanaAdapter}>
  <App />
</SatelliteConnectProvider>

// With auto-connect and multiple adapters
<SatelliteConnectProvider
  adapter={[solanaAdapter, evmAdapter]}
  autoConnect={true}
  callbackAfterConnected={(wallet) => {
    console.log('Wallet connected:', wallet.address);
  }}
>
  <App />
</SatelliteConnectProvider>
```
