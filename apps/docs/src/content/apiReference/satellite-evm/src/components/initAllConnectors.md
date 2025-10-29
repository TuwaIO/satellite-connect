[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# initAllConnectors()

> **initAllConnectors**(`props`, `portoParameters?`): readonly `CreateConnectorFn`[]

Defined in: [packages/satellite-evm/src/connectors/index.ts:47](https://github.com/TuwaIO/satellite-connect/blob/66b3098246e86046da62af2421fe8d962c4464c0/packages/satellite-evm/src/connectors/index.ts#L47)

Initializes all supported wallet connectors based on provided configuration

## Parameters

### props

`ConnectorsInitProps`

Configuration options for initializing connectors

### portoParameters?

`ExactPartial`\<`Config`\<readonly \[`Chain`, `Chain`\]\>\>

Optional parameters for Porto wallet connector

## Returns

readonly `CreateConnectorFn`[]

Array of wallet connector instances

## Remarks

Creates instances of various wallet connectors including:
- Injected wallets (e.g., MetaMask, Phantom, Trust Wallet, etc.)
- Coinbase Wallet
- Gnosis Safe
- WalletConnect (if projectId provided)
- Impersonated wallet (for development/testing)

The order of connectors in the returned array determines their priority
in the wallet connection UI.

## Example

```typescript
const connectors = initAllConnectors({
  appName: "My dApp",
  projectId: "wallet_connect_project_id",
  appUrl: "https://mydapp.com",
  appLogoUrl: "https://mydapp.com/logo.png"
});
```
