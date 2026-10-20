# SolanaSignerTarget

> **SolanaSignerTarget** = `SolanaMessageSignerTarget`

Defined in: [satellite-solana/src/utils/signerUtils.ts:46](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L46)

What [createSolanaMessageSigner](/packages/satellite-solana/functions/createSolanaMessageSigner.md) signs with: the Wallet Standard `Wallet` and `WalletAccount` (see
[unwrapUiWalletHandles](/packages/satellite-solana/functions/unwrapUiWalletHandles.md)), a wallet adapter, or the value of `useWallet()` from `@solana/wallet-adapter-react`
(v1) or `@solana/wallet-adapter` (v3):
[`SolanaMessageSignerTarget`](https://orbit.docs.tuwa.io/packages/orbit-solana/interfaces/SolanaMessageSignerTarget)
of `@tuwaio/orbit-solana` (its fields are described there). When `wallet` or `account` is missing or `null`, the
target object itself is used in its place.

Every field may be missing or `null`, as in `useWallet()` before a wallet connects: the signer looks for a signing
capability only when it is called, and rejects when it finds none.
