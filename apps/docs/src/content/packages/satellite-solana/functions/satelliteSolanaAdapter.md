# satelliteSolanaAdapter()

> **satelliteSolanaAdapter**(`params`): [`SatelliteAdapter`](/packages/satellite-core/type-aliases/SatelliteAdapter.md)\<`UiWallet`, [`SolanaConnection`](/packages/satellite-solana/interfaces/SolanaConnection.md)\>

Defined in: [satellite-solana/src/adapters/solanaAdapter.ts:62](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/adapters/solanaAdapter.ts#L62)

Creates the Solana adapter for the Satellite Connect store (`createSatelliteConnectStore` from
`@tuwaio/satellite-core` or `SatelliteConnectProvider` from `@tuwaio/satellite-react`). It implements
`SatelliteAdapter` with the Wallet Standard and `@solana/kit`:
- `getConnectors` returns the wallets of `getAvailableSolanaConnectors` from `@tuwaio/orbit-solana` (registered
  Wallet Standard wallets with the Solana features Satellite needs). A wallet matches a `connectorType` such as
  `"solana:phantom"` through `formatConnectorName` from `@tuwaio/orbit-core`.
- `connect` asks the wallet to connect (`standard:connect`) and returns a [SolanaConnection](/packages/satellite-solana/interfaces/SolanaConnection.md): the first
  account, the cluster moniker of the requested chain (the genesis-hash chain ID
  `"solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"`, `"solana:devnet"` and `"devnet"` all become `"devnet"`), the
  RPC URL of that cluster from `rpcUrls`, the wallet icon, the Wallet Standard handles and a `signMessage` created
  with [createSolanaMessageSigner](/packages/satellite-solana/functions/createSolanaMessageSigner.md). When `rpcUrls` has no URL for the cluster, `getRpcUrlForCluster` from
  `@tuwaio/orbit-solana` returns the public endpoint of that cluster (the mainnet-beta one for `localnet`, and for
  every cluster with `@tuwaio/orbit-solana` 0.3.1 and earlier).
- `disconnect` disconnects the wallet of the given connection, or every wallet that has accounts.
- `checkAndSwitchNetwork` makes no wallet request (Solana wallets have no network switch): it sets the connection's
  `chainId` and `rpcURL` to the new cluster, and does nothing when the requested chain is the current cluster in
  another form.
- `getBalance` reads the balance with `getBalance` over RPC and returns it in SOL.
- `getExplorerUrl(url?, chainId?)` builds a Solana Explorer link (`explorer.solana.com`).
- `getName` and `getAvatar` resolve SNS names and avatars with `@tuwaio/orbit-solana` (Bonfida APIs, cached in
  memory); `getName` returns the address when there is no name. There is no `getAddress` and no contract check.
- `switchConnection` runs `standard:connect` of the wallet again.

## Parameters

### params

`SolanaRPCUrls`

Adapter options: `rpcUrls`, the RPC URL for each cluster moniker (`mainnet`, `devnet`, `testnet`,
`localnet`). The URLs are kept in memory and exposed as `rpcURL` of the connection; they are not saved to
`localStorage`.

## Returns

[`SatelliteAdapter`](/packages/satellite-core/type-aliases/SatelliteAdapter.md)\<`UiWallet`, [`SolanaConnection`](/packages/satellite-solana/interfaces/SolanaConnection.md)\>

The Solana adapter.

## Example

```ts
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

export const solanaAdapter = satelliteSolanaAdapter({
  rpcUrls: {
    mainnet: 'https://api.mainnet-beta.solana.com',
    devnet: 'https://api.devnet.solana.com',
  },
});
```
