[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# checkIsWalletAddressContract()

> **checkIsWalletAddressContract**(`__namedParameters`): `Promise`\<`boolean`\>

Defined in: [packages/satellite-evm/src/utils/checkIsWalletAddressContract.ts:41](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-evm/src/utils/checkIsWalletAddressContract.ts#L41)

Checks if a given wallet address is a smart contract by examining its bytecode

## Parameters

### \_\_namedParameters

#### address

`string`

Ethereum address to check

#### chainId

`string` \| `number`

Chain ID where the check should be performed

#### chains

readonly \[`Chain`, `Chain`\]

Array of supported chain configurations

#### config

`Config`

Wagmi configuration for blockchain interaction

## Returns

`Promise`\<`boolean`\>

Promise resolving to boolean indicating if the address is a contract
- true: Address is a smart contract
- false: Address is an EOA (Externally Owned Account) or client creation failed

## Remarks

This function uses an in-memory cache to store results and avoid redundant blockchain requests.
The cache persists for the lifetime of the application session.

## Example

```typescript
const isContract = await checkIsWalletAddressContract({
  config: wagmiConfig,
  address: "0x1234...",
  chainId: 1,
  chains: [mainnet, polygon]
});
```

## Throws

Will throw an error if getBytecode request fails
