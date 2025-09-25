[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createSolanaClientWithCache()

> **createSolanaClientWithCache**(`rpcUrlOrMoniker`): `SolanaClient`

Defined in: [packages/orbit-solana/src/utils/createSolanaClientWithCache.ts:64](https://github.com/TuwaIO/satellite-connect/blob/3665b1d14479f81479de58c9ee0423967cf0e219/packages/orbit-solana/src/utils/createSolanaClientWithCache.ts#L64)

Creates or retrieves a cached Solana RPC client instance

This function implements a caching mechanism for Solana RPC clients to:
- Avoid redundant client instance creation
- Optimize memory usage
- Maintain consistent client instances throughout the application

## Parameters

### rpcUrlOrMoniker

`string`

RPC endpoint URL or cluster moniker (e.g., 'mainnet', 'devnet')

## Returns

`SolanaClient`

Cached or newly created Solana RPC client instance

## Throws

Error if unable to resolve a valid RPC URL

## Example

```typescript
// Using cluster moniker
const mainnetClient = createSolanaClientWithCache('mainnet');

// Using custom RPC URL
const customClient = createSolanaClientWithCache('https://my-rpc.example.com');
```
