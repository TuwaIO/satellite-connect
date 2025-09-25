[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getAdapterFromWalletType()

> **getAdapterFromWalletType**(`walletType`): `OrbitAdapter`

Defined in: [packages/satellite-core/src/utils/getAdapterFromWalletType.ts:27](https://github.com/TuwaIO/satellite-connect/blob/8af5ba76f248b2d5386322999904d21ced4220f4/packages/satellite-core/src/utils/getAdapterFromWalletType.ts#L27)

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
