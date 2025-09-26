[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createWagmiConfig()

> **createWagmiConfig**(`config`): `Config`\<readonly \[`Chain`, `Chain`\], `Record`\<`number`, `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>\>, readonly `CreateConnectorFn`[]\>

Defined in: [packages/satellite-evm/src/utils/createWagmiConfig.ts:58](https://github.com/TuwaIO/satellite-connect/blob/d5f27c9ecfc7c137261f9e98cbe815c1fb13b3f0/packages/satellite-evm/src/utils/createWagmiConfig.ts#L58)

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
