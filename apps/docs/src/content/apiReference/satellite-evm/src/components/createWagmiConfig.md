[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createWagmiConfig()

> **createWagmiConfig**(`config`): `Config`\<readonly \[`Chain`, `Chain`\], `Record`\<`number`, `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>\>, readonly `CreateConnectorFn`[]\>

Defined in: [packages/satellite-evm/src/utils/createWagmiConfig.ts:58](https://github.com/TuwaIO/satellite-connect/blob/b5a5df814a87c8fe0a316d5477bd4d7f974c2f09/packages/satellite-evm/src/utils/createWagmiConfig.ts#L58)

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
