[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# SatelliteConnectProvider()

> **SatelliteConnectProvider**(`props`): `Element`

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:51](https://github.com/TuwaIO/satellite-connect/blob/18a41d0da5bc9fbf434539f77d51ec315a3d9d55/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L51)

Provider component that manages connector connections and state

## Parameters

### props

[`SatelliteConnectProviderProps`](../interfaces/SatelliteConnectProviderProps.md)

Component properties including store parameters and children

## Returns

`Element`

## Remarks

This component creates and provides the Satellite Connect store context to its children.
It handles connector connections, state management, and automatic reconnection functionality.
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
