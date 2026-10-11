# SolanaSignerTarget

Defined in: [satellite-solana/src/utils/signerUtils.ts:140](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L140)

What [createSolanaMessageSigner](/packages/satellite-solana/functions/createSolanaMessageSigner.md) signs with: the Wallet Standard `Wallet` and `WalletAccount` (see
[unwrapUiWalletHandles](/packages/satellite-solana/functions/unwrapUiWalletHandles.md)), a wallet adapter, or the value of `useWallet()` from `@solana/wallet-adapter-react`
(v1) or `@solana/wallet-adapter` (v3). When `wallet` or `account` is missing or `null`, the target object itself is
used in its place.

Every field may be missing or `null`, as in `useWallet()` before a wallet connects: the signer looks for a signing
capability only when it is called, and rejects when it finds none.

## Properties

### account?

> `optional` **account?**: `object` \| `null`

Defined in: [satellite-solana/src/utils/signerUtils.ts:142](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L142)

The account to sign with, passed to the wallet's `signMessage`.

***

### signMessage?

> `optional` **signMessage?**: (`message`) => `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

Defined in: [satellite-solana/src/utils/signerUtils.ts:150](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L150)

Signs the UTF-8 bytes of the message, as the method of a wallet adapter or of `useWallet()`.

#### Parameters

##### message

`Uint8Array`

UTF-8 bytes of the message.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

The ed25519 signature, or an object that contains it.

***

### signOffchainMessage?

> `optional` **signOffchainMessage?**: (`message`) => `Promise`\<\{ `signature`: `ReadonlyUint8Array`; `signedOffchainMessage?`: `ReadonlyUint8Array`; \}\>

Defined in: [satellite-solana/src/utils/signerUtils.ts:157](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L157)

Signs the version 1 off-chain message of the text with the connected account as its only signer, as the method of
`useWallet()` from `@solana/wallet-adapter` v3.

#### Parameters

##### message

`string`

The message text.

#### Returns

`Promise`\<\{ `signature`: `ReadonlyUint8Array`; `signedOffchainMessage?`: `ReadonlyUint8Array`; \}\>

The ed25519 signature and, optionally, the bytes the wallet signed.

***

### wallet?

> `optional` **wallet?**: `object` \| `null`

Defined in: [satellite-solana/src/utils/signerUtils.ts:144](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L144)

The wallet that implements `solana:signMessage`, `signMessages` or `signMessage`, or has an `adapter` that does.
