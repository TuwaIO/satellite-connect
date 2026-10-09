# createSolanaMessageSigner()

> **createSolanaMessageSigner**(`target`, `options?`): (`message`) => `Promise`\<`string`\>

Defined in: [satellite-solana/src/utils/signerUtils.ts:164](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L164)

Creates a function that signs UTF-8 messages with a Solana wallet and returns base58 signatures. The adapter and the
watcher use it as `signMessage` of a Solana connection.

The signer uses the first capability it finds: the Wallet Standard `solana:signMessage` feature of the wallet (or
of the account), a `signMessages` function, then a legacy `signMessage` function of the wallet, its `adapter` or the
account. Accounts that list `solana:signOffchainMessage` but not `solana:signMessage` (hardware wallet accounts may)
sign the version 1 off-chain message of the text instead; `options.messageFormat` changes the choice
([SolanaMessageFormat](/packages/satellite-solana/type-aliases/SolanaMessageFormat.md)). The wallet may show a prompt.

## Parameters

### target

[`SolanaSignerTarget`](/packages/satellite-solana/interfaces/SolanaSignerTarget.md)

The wallet and account to sign with.

### options?

[`SolanaMessageSignerOptions`](/packages/satellite-solana/interfaces/SolanaMessageSignerOptions.md) = `{}`

`messageFormat`: `'auto'` (default), `'message'` or `'offchainMessage'`.

## Returns

A function that signs `message` and resolves to the base58-encoded signature. It rejects with
`[SATELLITE-SOLANA] Invalid signer target.` when `target` is missing,
`[SATELLITE-SOLANA] Signer lacks known message signing capabilities.` when no capability is found, an
`... invalid signMessage output.`, `... invalid signMessages output.` or `... invalid signOffchainMessage output.`
error when the wallet returns no signature, `... cannot sign version 1 off-chain messages.` or
`... signed a different off-chain message than requested.` for off-chain messages, and with the wallet's error when
the user rejects.

(`message`) => `Promise`\<`string`\>
