[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getWalletTypeFromConnectorName()

> **getWalletTypeFromConnectorName**(`adapter`, `name`): `string`

Defined in: [packages/orbit-core/src/utils/getWalletTypeFromConnectorName.ts:29](https://github.com/TuwaIO/satellite-connect/blob/ab7853a2b67d56c430b290eecda2a29d74515c99/packages/orbit-core/src/utils/getWalletTypeFromConnectorName.ts#L29)

Generates a standardized wallet type identifier from adapter type and connector name

## Parameters

### adapter

[`OrbitAdapter`](../enumerations/OrbitAdapter.md)

The blockchain adapter type (e.g. EVM, SOLANA)

### name

`string`

The wallet connector name (e.g. "MetaMask", "Phantom")

## Returns

`string`

A formatted wallet type string in format "chain:wallet"

## Example

```typescript
// Returns "evm:metamask"
getWalletTypeFromConnectorName(OrbitAdapter.EVM, "MetaMask");

// Returns "solana:phantom"
getWalletTypeFromConnectorName(OrbitAdapter.SOLANA, "Phantom");

// Returns "evm:coinbasewallet" (removes spaces)
getWalletTypeFromConnectorName(OrbitAdapter.EVM, "Coinbase Wallet");
```

## Remarks

The function:
1. Combines adapter type with connector name using ":" as separator
2. Removes all whitespace from connector name
3. Converts connector name to lowercase
This ensures consistent wallet type identifiers across the application
