[**@tuwaio/satellite-connect-monorepo**](../../../../README.md)

***

# getSessionOptions()

> **getSessionOptions**(`userConfig`): `SessionOptions`

Defined in: [packages/satellite-siwe-next-auth/src/server/session.config.ts:11](https://github.com/TuwaIO/satellite-connect/blob/27bf7601bbc771740e373d686705e36d975d9cee/packages/satellite-siwe-next-auth/src/server/session.config.ts#L11)

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
