[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createWagmiConfig()

> **createWagmiConfig**(`config`): `Config`\<readonly \[`Chain`, `Chain`\], `Record`\<`number`, `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>\>, readonly `CreateConnectorFn`[]\>

Defined in: [packages/satellite-evm/src/utils/createWagmiConfig.ts:58](https://github.com/TuwaIO/satellite-connect/blob/3665b1d14479f81479de58c9ee0423967cf0e219/packages/satellite-evm/src/utils/createWagmiConfig.ts#L58)

Creates a Wagmi configuration with initialized connectors and transports

## Parameters

### config

`ConnectorsInitProps` & `Omit`\<`CreateConfigParameters`, `"client"` \| `"connectors"`\>

Combined configuration parameters for Satellite and Wagmi

## Returns

`Config`\<readonly \[`Chain`, `Chain`\], `Record`\<`number`, `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>\>, readonly `CreateConnectorFn`[]\>

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
