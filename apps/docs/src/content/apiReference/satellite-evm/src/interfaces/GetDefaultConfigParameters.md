[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# GetDefaultConfigParameters

Defined in: [packages/satellite-evm/src/utils/createWagmiConfig.ts:7](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-evm/src/utils/createWagmiConfig.ts#L7)

## Extends

- `Omit`\<`CreateConfigParameters`, `"client"` \| `"connectors"`\>

## Properties

### batch?

> `optional` **batch**: \{ `multicall?`: `boolean` \| \{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}; \} \| \{\[`key`: `number`\]: `undefined` \| \{ `multicall?`: `boolean` \| \{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}; \}; \}

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@3.22.4/node\_modules/viem/\_types/clients/createClient.d.ts:18

Flags for batch settings.

#### Type Declaration

\{ `multicall?`: `boolean` \| \{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}; \}

#### multicall?

> `optional` **multicall**: `boolean` \| \{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}

Toggle to enable `eth_call` multicall aggregation.

##### Type Declaration

`boolean`

\{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}

\{\[`key`: `number`\]: `undefined` \| \{ `multicall?`: `boolean` \| \{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}; \}; \}

#### Index Signature

\[`key`: `number`\]: `undefined` \| \{ `multicall?`: `boolean` \| \{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}; \}

#### Inherited from

`Omit.batch`

***

### cacheTime?

> `optional` **cacheTime**: `number` \| \{\[`key`: `number`\]: `undefined` \| `number`; \}

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@3.22.4/node\_modules/viem/\_types/clients/createClient.d.ts:35

Time (in ms) that cached data will remain in memory.

#### Default

```ts
chain.blockTime / 3
```

#### Inherited from

`Omit.cacheTime`

***

### ccipRead?

> `optional` **ccipRead**: `false` \| \{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \} \| \{\[`key`: `number`\]: `undefined` \| `false` \| \{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}; \}

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@3.22.4/node\_modules/viem/\_types/clients/createClient.d.ts:40

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.
If `false`, the client will not support offchain CCIP lookups.

#### Type Declaration

`false`

\{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

#### request()?

> `optional` **request**: (`parameters`) => `Promise`\<`` `0x${string}` ``\>

A function that will be called to make the offchain CCIP lookup request.

##### Parameters

###### parameters

`CcipRequestParameters`

##### Returns

`Promise`\<`` `0x${string}` ``\>

##### See

https://eips.ethereum.org/EIPS/eip-3668#client-lookup-protocol

\{\[`key`: `number`\]: `undefined` \| `false` \| \{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}; \}

#### Index Signature

\[`key`: `number`\]: `undefined` \| `false` \| \{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

#### Inherited from

`Omit.ccipRead`

***

### chains

> **chains**: readonly \[`Chain`, `Chain`\]

Defined in: node\_modules/.pnpm/@wagmi+core@2.21.1\_@tanstack+query-core@5.90.2\_@types+react@19.1.13\_immer@10.1.3\_react@19.1.1\_6hprgpntdnr5vjse4pfi45b744/node\_modules/@wagmi/core/dist/types/createConfig.d.ts:10

#### Inherited from

`Omit.chains`

***

### connectorsInitProps

> **connectorsInitProps**: `AllConnectorsInitProps`

Defined in: [packages/satellite-evm/src/utils/createWagmiConfig.ts:15](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-evm/src/utils/createWagmiConfig.ts#L15)

***

### experimental\_blockTag?

> `optional` **experimental\_blockTag**: `BlockTag` \| \{\[`key`: `number`\]: BlockTag \| undefined; \}

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@3.22.4/node\_modules/viem/\_types/clients/createClient.d.ts:30

Default block tag to use for RPC requests.

If the chain supports a pre-confirmation mechanism
(set via `chain.experimental_preconfirmationTime`), defaults to `'pending'`.

#### Default

```ts
'latest'
```

#### Inherited from

`Omit.experimental_blockTag`

***

### multiInjectedProviderDiscovery?

> `optional` **multiInjectedProviderDiscovery**: `boolean`

Defined in: node\_modules/.pnpm/@wagmi+core@2.21.1\_@tanstack+query-core@5.90.2\_@types+react@19.1.13\_immer@10.1.3\_react@19.1.1\_6hprgpntdnr5vjse4pfi45b744/node\_modules/@wagmi/core/dist/types/createConfig.d.ts:12

#### Inherited from

`Omit.multiInjectedProviderDiscovery`

***

### pollingInterval?

> `optional` **pollingInterval**: `number` \| \{\[`key`: `number`\]: `undefined` \| `number`; \}

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@3.22.4/node\_modules/viem/\_types/clients/createClient.d.ts:57

Frequency (in ms) for polling enabled actions & events.

#### Default

```ts
chain.blockTime / 3
```

#### Inherited from

`Omit.pollingInterval`

***

### rpcSchema?

> `optional` **rpcSchema**: `object`

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@3.22.4/node\_modules/viem/\_types/clients/createClient.d.ts:61

Typed JSON-RPC schema for the client.

#### Index Signature

\[`key`: `number`\]: `undefined`

#### Inherited from

`Omit.rpcSchema`

***

### ssr?

> `optional` **ssr**: `boolean`

Defined in: node\_modules/.pnpm/@wagmi+core@2.21.1\_@tanstack+query-core@5.90.2\_@types+react@19.1.13\_immer@10.1.3\_react@19.1.1\_6hprgpntdnr5vjse4pfi45b744/node\_modules/@wagmi/core/dist/types/createConfig.d.ts:14

#### Inherited from

`Omit.ssr`

***

### storage?

> `optional` **storage**: `null` \| `Storage`

Defined in: node\_modules/.pnpm/@wagmi+core@2.21.1\_@tanstack+query-core@5.90.2\_@types+react@19.1.13\_immer@10.1.3\_react@19.1.1\_6hprgpntdnr5vjse4pfi45b744/node\_modules/@wagmi/core/dist/types/createConfig.d.ts:13

#### Inherited from

`Omit.storage`

***

### syncConnectedChain?

> `optional` **syncConnectedChain**: `boolean`

Defined in: node\_modules/.pnpm/@wagmi+core@2.21.1\_@tanstack+query-core@5.90.2\_@types+react@19.1.13\_immer@10.1.3\_react@19.1.1\_6hprgpntdnr5vjse4pfi45b744/node\_modules/@wagmi/core/dist/types/createConfig.d.ts:15

#### Inherited from

`Omit.syncConnectedChain`

***

### transports?

> `optional` **transports**: `Record`\<`number`, `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>\>

Defined in: node\_modules/.pnpm/@wagmi+core@2.21.1\_@tanstack+query-core@5.90.2\_@types+react@19.1.13\_immer@10.1.3\_react@19.1.1\_6hprgpntdnr5vjse4pfi45b744/node\_modules/@wagmi/core/dist/types/createConfig.d.ts:17

#### Inherited from

`Omit.transports`
