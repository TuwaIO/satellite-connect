# checkIsWalletAddressContract()

> **checkIsWalletAddressContract**(`params`): `Promise`\<`boolean`\>

Defined in: [satellite-evm/src/utils/checkIsWalletAddressContract.ts:45](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/checkIsWalletAddressContract.ts#L45)

Checks whether an address has contract code on a chain, for example to detect smart contract wallets such as Safe.
The EVM adapter uses it as `checkIsContractAddress`, and the store saves the result in `isContractAddress`.

Side effects: reads the code with wagmi's `getBytecode` through the wagmi transport of `chainId` (an RPC request),
and caches the result in memory per chain and address for the lifetime of the page. Addresses with code include
EIP-7702 delegated accounts.

## Parameters

### params

Address and chain to check.

#### address

`string`

The address to check.

#### chainId

`string` \| `number`

The chain to check it on, as a number or numeric string.

#### chains

readonly \[`Chain`, `Chain`\]

The app chains. When `chainId` is not in this list, nothing is requested and a warning is
logged.

#### config

`Config`

The wagmi config whose transports are used.

## Returns

`Promise`\<`boolean`\>

`true` when the address has code; `false` when it has none or `chainId` is not in `chains`.

## Throws

When the RPC request fails (the failure is not cached).

## Example

```ts
import { checkIsWalletAddressContract } from '@tuwaio/satellite-evm';
import { type Config } from '@wagmi/core';
import { mainnet } from 'viem/chains';

declare const wagmiConfig: Config;

const isContract = await checkIsWalletAddressContract({
  config: wagmiConfig,
  address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  chainId: mainnet.id,
  chains: [mainnet],
});
```
