[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteConnectProvider()

> **SatelliteConnectProvider**(`props`): `Element`

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:51](https://github.com/TuwaIO/satellite-connect/blob/5586aa3a39b71bb0d598cced97f2ca6d1a05cc84/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L51)

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
