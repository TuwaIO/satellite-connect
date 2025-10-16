[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createWagmiConfig()

> **createWagmiConfig**(`config`): `Config`

Defined in: [packages/satellite-evm/src/utils/createWagmiConfig.ts:57](https://github.com/TuwaIO/satellite-connect/blob/5732da82a0309c4d5befbfef8ec58250e036aa85/packages/satellite-evm/src/utils/createWagmiConfig.ts#L57)

Creates a Wagmi configuration with initialized connectors and transports

## Parameters

### config

`ConnectorsInitProps` & `Omit`\<`CreateConfigParameters`, `"client"`\>

Combined configuration parameters for Satellite and Wagmi

## Returns

`Config`

Configured Wagmi instance

## Remarks

This function combines Satellite connector initialization with Wagmi configuration.
It automatically sets up HTTP transports for each chain if custom transports are not provided.

## Example

```typescript
const config = createWagmiConfig({
  chains: [mainnet, polygon],
  projectId: "your_project_id",
  appName: "My dApp",
  appUrl: "https://mydapp.com",
  appLogoUrl: "https://mydapp.com/logo.png"
});
```
