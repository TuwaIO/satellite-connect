# createSolanaMessageSigner()

> **createSolanaMessageSigner**(`target`): (`message`) => `Promise`\<`string`\>

Defined in: [satellite-solana/src/utils/signerUtils.ts:36](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L36)

Creates a function that signs UTF-8 messages with a Solana wallet and returns base58 signatures. The adapter and the
watcher use it as `signMessage` of a Solana connection.

The signer uses the first capability it finds: the Wallet Standard `solana:signMessage` feature of the wallet (or
of the account), a `signMessages` function, then a legacy `signMessage` function of the wallet, its `adapter` or the
account. The wallet may show a prompt.

## Parameters

### target

[`SolanaSignerTarget`](/packages/satellite-solana/interfaces/SolanaSignerTarget.md)

The wallet and account to sign with.

## Returns

A function that signs `message` and resolves to the base58-encoded signature. It rejects with
`[SATELLITE-SOLANA] Invalid signer target.` when `target` is missing,
`[SATELLITE-SOLANA] Signer lacks known message signing capabilities.` when no capability is found, an
`... invalid signMessage output.` or `... invalid signMessages output.` error when the wallet returns no signature,
and with the wallet's error when the user rejects.

(`message`) => `Promise`\<`string`\>
