[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# delay()

> **delay**\<`T`\>(`value`, `ms`): `Promise`\<`T`\>

Defined in: [packages/orbit-core/src/utils/delay.ts:30](https://github.com/TuwaIO/satellite-connect/blob/ab7853a2b67d56c430b290eecda2a29d74515c99/packages/orbit-core/src/utils/delay.ts#L30)

## Type Parameters

### T

`T`

The type of the value being resolved.

## Parameters

### value

`T`

The value to resolve the Promise with after the delay.

### ms

`number`

The number of milliseconds (delay) to wait before resolving the Promise after 'window' is available.

## Returns

`Promise`\<`T`\>

A Promise that resolves with the provided `value` after both the 'window' check and the delay (`ms`) are complete.

## Name

delay

Ensures the global 'window' object is available (if running in a browser-like environment),
then pauses execution for a specified duration, and finally resolves the Promise with the given value.

This utility function is designed to be safe for use in Server-Side Rendering (SSR) environments.
It asynchronously waits for the 'window' object to be defined before starting the actual timer,
helping to prevent errors during the initial server render while still providing a time delay on the client.

## Example

```typescript
// Use this in an environment where 'window' might not be immediately available (e.g., Next.js component).
async function waitForWindowAndDelay() {
console.log("Start wait...");
// This will wait for window, and then wait 100ms.
const data = await delay("Ready to connect", 100);
console.log(data);
}
waitForWindowAndDelay();
```
