# SatelliteStoreContext

> `const` **SatelliteStoreContext**: `Context`\<[`SatelliteContextType`](/packages/satellite-react/react/type-aliases/SatelliteContextType.md)\>

Defined in: [satellite-react/src/hooks/satelliteHook.ts:29](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/hooks/satelliteHook.ts#L29)

React context that holds the store of [SatelliteConnectProvider](/packages/satellite-react/react/functions/SatelliteConnectProvider.md). Use [useSatelliteConnectStore](/packages/satellite-react/react/functions/useSatelliteConnectStore.md) to read
it in components; read the context directly to call `getState()` or `subscribe` without re-rendering.

The context object is created once and saved on `globalThis` (`Symbol.for('tuwaio.satellite.context')`), so
packages that bundle their own copy of `@tuwaio/satellite-react` share the same context.
