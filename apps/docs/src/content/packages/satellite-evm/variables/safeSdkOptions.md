# safeSdkOptions

> `const` **safeSdkOptions**: `object`

Defined in: [satellite-evm/src/connectors/index.ts:5](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/connectors/index.ts#L5)

Options for the wagmi `safe` connector: `safe({ ...safeSdkOptions })`. They are passed to the Safe Apps SDK, which
accepts messages only from a parent window whose origin matches one of `allowedDomains`.

## Type Declaration

### allowedDomains

> **allowedDomains**: `RegExp`[]

Origins of the Safe{Wallet} apps allowed to host the dApp: `https://app.safe.global`, `https://gnosis-safe.io` and
`https://metissafe.tech`, including their subdomains. The patterns are anchored, so look-alike domains such as
`https://app-safe.global` are rejected.

### debug

> **debug**: `boolean` = `false`

Debug logging of the Safe Apps SDK.
