# InitializeAutoConnectProps

Defined in: [satellite-react/src/hooks/useInitializeAutoConnect.tsx:6](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx#L6)

Parameters of [useInitializeAutoConnect](/packages/satellite-react/react/functions/useInitializeAutoConnect.md).

## Properties

### initializeAutoConnect

> **initializeAutoConnect**: () => `Promise`\<`void`\>

Defined in: [satellite-react/src/hooks/useInitializeAutoConnect.tsx:12](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx#L12)

Restores the connection, for example `() => store.getState().initializeAutoConnect(true)`.

#### Returns

`Promise`\<`void`\>

Resolves when done.

***

### onError?

> `optional` **onError?**: (`error`) => `void`

Defined in: [satellite-react/src/hooks/useInitializeAutoConnect.tsx:19](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx#L19)

Called when `initializeAutoConnect` rejects; the function of the latest render is used. Defaults to
`console.error`.

#### Parameters

##### error

`Error`

The rejection reason.

#### Returns

`void`
