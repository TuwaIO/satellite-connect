# impersonated()

> **impersonated**(`parameters`): `CreateConnectorFn`\<`provider`, `properties`, `storageItem`\>

Defined in: [satellite-evm/src/connectors/ImpersonatedConnector.ts:74](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/connectors/ImpersonatedConnector.ts#L74)

Creates a wagmi connector that acts as a wallet for any address, for development and testing (for example against
an Anvil or Hardhat node that impersonates accounts). Add it to the `connectors` of your wagmi config; it appears
in Satellite Connect as `"evm:impersonatedwallet"` and is never reconnected automatically.

On every provider request the connector reads the address to impersonate from `localStorage`
(`satellite-connect:impersonatedAddress`, set with `impersonatedHelpers.setImpersonated` from `@tuwaio/orbit-core`)
and returns it for `eth_accounts` and `eth_requestAccounts` (no account when the key is empty). `eth_chainId` and
`wallet_switchEthereumChain` are answered locally (only chains of the wagmi config can be selected). `personal_sign`
is sent as `eth_sign`, and every other request (for example `eth_sendTransaction`) is sent as is to the first
default RPC URL of the chain wagmi asks for (the first chain of the wagmi config by default). Public RPC nodes reject
signing requests; use a local node that impersonates the address.

## Parameters

### parameters

[`ImpersonatedParameters`](/packages/satellite-evm/type-aliases/ImpersonatedParameters.md)

Connector options. `features` simulate wallet errors.

## Returns

`CreateConnectorFn`\<`provider`, `properties`, `storageItem`\>

A wagmi connector factory with the id `impersonated` and the name `Impersonated Connector`.

## Example

```ts
import { impersonatedHelpers } from '@tuwaio/orbit-core';
import { impersonated } from '@tuwaio/satellite-evm';
import { createConfig, http } from '@wagmi/core';
import { foundry } from 'viem/chains';

export const wagmiConfig = createConfig({
  chains: [foundry],
  connectors: [impersonated({ features: { signMessageError: false } })],
  transports: { [foundry.id]: http() },
});

impersonatedHelpers.setImpersonated('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
```
