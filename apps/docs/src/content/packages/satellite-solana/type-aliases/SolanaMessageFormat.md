# SolanaMessageFormat

> **SolanaMessageFormat** = `"auto"` \| `"message"` \| `"offchainMessage"`

Defined in: [satellite-solana/src/utils/signerUtils.ts:26](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L26)

How [createSolanaMessageSigner](/packages/satellite-solana/functions/createSolanaMessageSigner.md) has the wallet sign:

- `'auto'` (default): the UTF-8 bytes of the message, or its version 1 off-chain message when the account lists
  `solana:signOffchainMessage` but not `solana:signMessage` (as hardware wallet accounts may), or when the wallet
  has no other way to sign;
- `'message'`: always the UTF-8 bytes;
- `'offchainMessage'`: always the version 1 off-chain message (`solana:signOffchainMessage` or a
  `signOffchainMessage(message)` method).

`@tuwaio/siwx-solana` and `@tuwaio/siwx-server` accept both for SIWX.
