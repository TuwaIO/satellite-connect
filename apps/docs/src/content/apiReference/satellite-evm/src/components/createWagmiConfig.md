[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createWagmiConfig()

> **createWagmiConfig**(`__namedParameters`): `Config`\<readonly \[`Chain`, `Chain`\], `Record`\<`number`, `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>\>, readonly `CreateConnectorFn`[]\>

Defined in: [packages/satellite-evm/src/utils/createWagmiConfig.ts:18](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-evm/src/utils/createWagmiConfig.ts#L18)

## Parameters

### \_\_namedParameters

`ConnectorsInitProps` & `Omit`\<`CreateConfigParameters`, `"client"` \| `"connectors"`\>

## Returns

`Config`\<readonly \[`Chain`, `Chain`\], `Record`\<`number`, `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>\>, readonly `CreateConnectorFn`[]\>
