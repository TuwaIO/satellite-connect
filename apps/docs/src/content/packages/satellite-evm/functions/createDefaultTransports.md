# createDefaultTransports()

> **createDefaultTransports**(`chains`): `Record`\<`number`, `Transport`\>

Defined in: [satellite-evm/src/utils/createDefaultTransports.ts:29](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createDefaultTransports.ts#L29)

Creates the `transports` of a wagmi config: for every chain, the `chainTransport` from `@tuwaio/orbit-evm` over the
default RPC URLs of its definition (`rpcUrls.default.http`), the next one when one does not answer. Those of the
viem chains are public, rate-limited endpoints: for production, put your own URLs first in the chain definition or
pass `http(yourRpcUrl)` transports.

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
