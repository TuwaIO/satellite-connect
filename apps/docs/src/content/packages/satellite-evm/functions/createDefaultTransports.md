# createDefaultTransports()

> **createDefaultTransports**(`chains`): `Record`\<`number`, `Transport`\>

Defined in: [satellite-evm/src/utils/createDefaultTransports.ts:27](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createDefaultTransports.ts#L27)

Creates the `transports` of a wagmi config: a viem `http()` transport without a URL for every chain, so each chain
uses the first default RPC URL of its definition (`rpcUrls.default.http[0]`). These are public, rate-limited
endpoints: for production, pass `http(yourRpcUrl)` transports instead.

## Parameters

### chains

readonly \[`Chain`, `Chain`\]

The chains of the wagmi config.

## Returns

`Record`\<`number`, `Transport`\>

Transports by chain ID.

## Example

```ts
import { createDefaultTransports } from '@tuwaio/satellite-evm';
import { createConfig, injected } from '@wagmi/core';
import { mainnet, sepolia } from 'viem/chains';

const chains = [mainnet, sepolia] as const;

export const wagmiConfig = createConfig({
  chains,
  connectors: [injected()],
  transports: createDefaultTransports(chains),
});
```
