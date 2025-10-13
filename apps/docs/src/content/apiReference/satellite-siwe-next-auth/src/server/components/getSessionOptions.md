[**@tuwaio/satellite-connect-monorepo**](../../../../README.md)

***

# getSessionOptions()

> **getSessionOptions**(`userConfig`): `SessionOptions`

Defined in: [packages/satellite-siwe-next-auth/src/server/session.config.ts:11](https://github.com/TuwaIO/satellite-connect/blob/f94c2625c57906fb32a7af7d50c1a2d7e58a105b/packages/satellite-siwe-next-auth/src/server/session.config.ts#L11)

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
