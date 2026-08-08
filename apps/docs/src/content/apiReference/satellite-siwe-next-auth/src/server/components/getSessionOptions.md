[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../../README.md)

***

# getSessionOptions()

> **getSessionOptions**(`userConfig`): `SessionOptions`

Defined in: [packages/satellite-siwe-next-auth/src/server/session.config.ts:11](https://github.com/TuwaIO/satellite-connect/blob/81bccc56b48f1d18d7388a185ae863d6b44a36b3/packages/satellite-siwe-next-auth/src/server/session.config.ts#L11)

**`Function`**

getSessionOptions

## Parameters

### userConfig

[`SiweApiConfig`](../../interfaces/SiweApiConfig.md)

The complete user configuration including session settings.

## Returns

`SessionOptions`

SessionOptions The options required by `getIronSession`.

## Description

Generates the Iron Session options object based on user configuration.
