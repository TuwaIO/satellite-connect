# @tuwaio/satellite-solana

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-solana.svg)](https://www.npmjs.com/package/@tuwaio/satellite-solana)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-solana.svg)](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/LICENSE)

`@tuwaio/satellite-solana` is the Solana Layer 4 (L4) package of **Satellite Connect**, the wallet connection project of TUWA Stage 2 ("State & Connection", next to Pulsar). Built on the **Wallet Standard**, **`@solana/kit`** and **`@tuwaio/orbit-solana`** (wallet discovery, cluster helpers and cached RPC clients), it provides the Solana adapter for [`@tuwaio/satellite-core`](https://satellite.docs.tuwa.io/packages/satellite-core), a watcher that copies wallet account changes into the store, and a message signer. It does not use the legacy `@solana/web3.js` or `gill`.

---

## 🏛️ Core Capabilities

- **Adapter:** `satelliteSolanaAdapter({ rpcUrls })` connects the Wallet Standard wallets found by `getAvailableSolanaConnectors` from `@tuwaio/orbit-solana` (Phantom, Solflare, Backpack…) by connector type, such as `"solana:phantom"`. A connection stores the cluster as a moniker (the genesis-hash chain ID `"solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"`, `"solana:devnet"` and `"devnet"` all become `"devnet"`) and the RPC URL you configured for it. Pass the moniker to Wallet Standard calls as `solana:devnet`; to identify the chain elsewhere (SIWX, transactions, APIs), use its CAIP-2 chain ID from `getSolanaChainId` of `@tuwaio/orbit-core`. The adapter reads SOL balances, builds Solana Explorer links and resolves SNS names and avatars.
- **No network switch in the wallet:** Solana wallets have no network setting, so `switchNetwork` only changes the connection's cluster and RPC URL in the store.
- **Message signing:** every connection has a `signMessage` that uses the wallet's `solana:signMessage` feature (with fallbacks for wallet adapters) and returns a base58 signature, for example for [SIWX](https://siwx.docs.tuwa.io/). `createSolanaMessageSigner` builds such a signer for any wallet and account.
- **Watcher:** the Wallet Standard has no connection events, so `createSolanaConnectionsWatcher` checks the wallets it is given each time it runs: it copies the active account of the connected wallet into the store, disconnects when the wallet has no accounts left and, with a SIWX session, when the sign-in is rejected or fails or the account no longer matches the session. React apps use `SolanaConnectorsWatcher` from [`@tuwaio/satellite-react/solana`](https://satellite.docs.tuwa.io/packages/satellite-react), which runs it on every change of the registered wallets.
- **Wallet Standard helpers:** `connect` and `disconnect` run the `standard:connect` and `standard:disconnect` features of a wallet; `unwrapUiWalletHandles` returns the wallet and account behind UI handles.

---

## 💾 Installation

```bash
pnpm add @tuwaio/satellite-solana @tuwaio/satellite-core @tuwaio/orbit-core @tuwaio/orbit-solana @solana/kit @wallet-standard/base @wallet-standard/features @wallet-standard/ui @wallet-standard/ui-registry @wallet-standard/app @wallet-standard/ui-core zustand immer
```

> [!IMPORTANT]
> `@tuwaio/satellite-core` (>=0.7), `@tuwaio/orbit-core` (>=0.4), `@tuwaio/orbit-solana` (>=0.4), `@solana/kit` (>=8.2), `@wallet-standard/base` (1.1.x), `@wallet-standard/features` (1.1.x), `@wallet-standard/ui` (1.x) and `@wallet-standard/ui-registry` (1.x) are peer dependencies and must be installed alongside `@tuwaio/satellite-solana`. `@wallet-standard/app` and `@wallet-standard/ui-core` are the peer dependencies of `@tuwaio/orbit-solana`, and `zustand` and `immer` those of `@tuwaio/satellite-core`.

---

## 🚀 Usage

```typescript
import { SOLANA_CHAIN_IDS } from '@tuwaio/orbit-core';
import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import { type ConnectorSolana, satelliteSolanaAdapter, type SolanaConnection } from '@tuwaio/satellite-solana';

export const solanaRPCUrls = {
  mainnet: 'https://api.mainnet-beta.solana.com', // use your own RPC provider in production
  devnet: 'https://api.devnet.solana.com',
};

export const satelliteStore = createSatelliteConnectStore<ConnectorSolana, SolanaConnection>({
  adapter: satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls }),
});

export async function connectPhantom() {
  await satelliteStore.getState().connect({ connectorType: 'solana:phantom', chainId: SOLANA_CHAIN_IDS.devnet });
  const connection = satelliteStore.getState().activeConnection;
  return connection?.signMessage?.('Hello from Satellite Connect'); // base58 signature
}
```

Configure an RPC URL for every cluster you connect to: a cluster missing from `rpcUrls` gets the rate-limited public endpoint of that cluster as its `rpcURL` (the mainnet-beta one for `localnet`, and for every cluster with `@tuwaio/orbit-solana` 0.3.1 and earlier). The React setup with the watcher is on the **[`@tuwaio/satellite-react`](https://satellite.docs.tuwa.io/packages/satellite-react)** page, and a full-stack app with Nova Connect, SIWX and Pulsar is in the **[Full-Stack React guide](https://docs.tuwa.io/guides/full-stack-react)**.

---

## 🌐 External Services

| Helper                                                      | Host                                                                                                         | Purpose                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| Adapter `connect`, `disconnect`, `switchConnection`, signer | The wallet, through the Wallet Standard                                                                      | Connecting and signing; the package sends no network request |
| Adapter `getBalance`                                        | The URL of the cluster in `rpcUrls`, else the public endpoint of the cluster (`api.<cluster>.solana.com`)    | `getBalance`                                                 |
| Adapter `getName`                                           | `sns-api.bonfida.com`                                                                                        | Favorite SNS domain of the address                           |
| Adapter `getAvatar`                                         | `image-api.bonfida.com`; `api.dicebear.com` for the fallback identicon (loaded by the browser when rendered) | SNS profile image of a `.sol` domain                         |

The address or domain being looked up is sent to the Bonfida hosts, and `@tuwaio/orbit-solana` caches the results in memory. Explorer links point to `explorer.solana.com` and are not requested by the package. The RPC URLs are kept in memory only: `@tuwaio/satellite-core` does not save them to `localStorage`.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[satellite.docs.tuwa.io/packages/satellite-solana](https://satellite.docs.tuwa.io/packages/satellite-solana)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/LICENSE) file for details.
