[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# initAllConnectors()

> **initAllConnectors**(`props`): readonly `CreateConnectorFn`[]

Defined in: [packages/satellite-evm/src/connectors/index.ts:57](https://github.com/TuwaIO/satellite-connect/blob/1db3ae446421f606d3fb60c08e8ea3374b90edd2/packages/satellite-evm/src/connectors/index.ts#L57)

Initializes all supported wallet connectors based on provided configuration

## Parameters

### props

Configuration options for initializing connectors

#### geminiParameters?

`GeminiParameters`

#### initialParameters

`ConnectorsInitProps`

#### portoParameters?

`ExactPartial`\<`Config`\<readonly \[`Chain`, `Chain`\]\>\>

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
