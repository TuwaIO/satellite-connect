[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# initAllConnectors()

> **initAllConnectors**(`props`): readonly `CreateConnectorFn`[]

Defined in: [packages/satellite-evm/src/connectors/index.ts:45](https://github.com/TuwaIO/satellite-connect/blob/f5b462c7dc3303fb7f6769f339389e88bb5e74c2/packages/satellite-evm/src/connectors/index.ts#L45)

Initializes all supported wallet connectors based on provided configuration

## Parameters

### props

`ConnectorsInitProps`

Configuration options for initializing connectors

## Returns

readonly `CreateConnectorFn`[]

Array of wallet connector instances

## Remarks

Creates instances of various wallet connectors including:
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
