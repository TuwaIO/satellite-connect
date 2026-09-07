[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# createSolanaMessageSigner()

> **createSolanaMessageSigner**(`target`): (`message`) => `Promise`\<`string`\>

Defined in: [packages/satellite-solana/src/utils/signerUtils.ts:24](https://github.com/TuwaIO/satellite-connect/blob/aaf05985da870f106a6da3c96a18d8433fdf6fa9/packages/satellite-solana/src/utils/signerUtils.ts#L24)

Creates a native signer callback for Solana using standard Wallet Standard features.
Decodes the signature to a Base58 string using @solana/kit.

## Parameters

### target

[`SolanaSignerTarget`](../interfaces/SolanaSignerTarget.md)

Object containing wallet and account handles

## Returns

Function accepting a string message and returning the Base58 signature string

(`message`) => `Promise`\<`string`\>
