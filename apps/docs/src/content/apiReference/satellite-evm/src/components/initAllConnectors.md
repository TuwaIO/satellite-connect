[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# initAllConnectors()

> **initAllConnectors**(`props`, `geminiParameters?`, `portoParameters?`): readonly `CreateConnectorFn`[]

Defined in: [packages/satellite-evm/src/connectors/index.ts:57](https://github.com/TuwaIO/satellite-connect/blob/c2398cb78399ffdc23ee1093db2b4db33b3403e4/packages/satellite-evm/src/connectors/index.ts#L57)

Initializes all supported wallet connectors based on provided configuration

## Parameters

### props

`ConnectorsInitProps`

Configuration options for initializing connectors

### geminiParameters?

`GeminiParameters`

Optional parameters for Gemini wallet connector

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
