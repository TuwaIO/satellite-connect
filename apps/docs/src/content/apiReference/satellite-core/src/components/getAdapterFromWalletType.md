[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getAdapterFromWalletType()

> **getAdapterFromWalletType**(`walletType`): `OrbitAdapter`

Defined in: [packages/satellite-core/src/utils/getAdapterFromWalletType.ts:27](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/utils/getAdapterFromWalletType.ts#L27)

Extracts the adapter type from a wallet type string

## Parameters

### walletType

Wallet type in format "chain:wallet" (e.g. "evm:metamask", "solana:phantom")

`` `evm:${string}` `` | `` `solana:${string}` `` | `` `starknet:${string}` ``

## Returns

`OrbitAdapter`

The corresponding OrbitAdapter type or EVM as default

## Example

```typescript
// Returns OrbitAdapter.EVM
getAdapterFromWalletType('evm:metamask');

// Returns OrbitAdapter.SOLANA
getAdapterFromWalletType('solana:phantom');

// Returns OrbitAdapter.EVM (default)
getAdapterFromWalletType('unknown');
```

## Remarks

The function splits the wallet type string by ":" and takes the first part as the adapter type.
If the split fails or the first part is empty, it defaults to EVM adapter.
