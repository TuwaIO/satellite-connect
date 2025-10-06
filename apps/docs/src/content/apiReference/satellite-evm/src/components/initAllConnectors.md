[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# initAllConnectors()

> **initAllConnectors**(`props`): readonly `CreateConnectorFn`[]

Defined in: [packages/satellite-evm/src/connectors/index.ts:45](https://github.com/TuwaIO/satellite-connect/blob/4db4fd2faf1732916ae8fd5a07ca3381fe492a8f/packages/satellite-evm/src/connectors/index.ts#L45)

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
