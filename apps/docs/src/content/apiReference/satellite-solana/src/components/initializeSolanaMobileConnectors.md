[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# initializeSolanaMobileConnectors()

> **initializeSolanaMobileConnectors**(`props`): `void`

Defined in: [packages/satellite-solana/src/connectors/initializeSolanaMobileConnectors.ts:45](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-solana/src/connectors/initializeSolanaMobileConnectors.ts#L45)

Initializes Solana Mobile Wallet Adapter (MWA) for mobile wallet connections

## Parameters

### props

`InitializeSolanaMobileConnectorsProps`

Combined initialization properties

## Returns

`void`

## Remarks

This function sets up the Solana Mobile Wallet Adapter with appropriate configuration
for secure mobile wallet connections. It includes security checks and chain validation.
Only works in secure contexts (HTTPS) and requires at least one valid chain configuration.

## Example

```typescript
initializeSolanaMobileConnectors({
  rpcUrls: {
    mainnet: 'https://api.mainnet-beta.solana.com',
    devnet: 'https://api.devnet.solana.com'
  },
  appName: 'My Solana App',
  appUrl: 'https://myapp.com',
  appLogoUrl: 'https://myapp.com/logo.png'
});
```

## Throws

If not in secure context (non-HTTPS)

## Throws

If no chains are configured
