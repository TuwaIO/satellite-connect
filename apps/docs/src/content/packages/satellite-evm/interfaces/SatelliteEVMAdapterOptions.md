# SatelliteEVMAdapterOptions

Defined in: [satellite-evm/src/adapters/evmAdapter.ts:24](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/adapters/evmAdapter.ts#L24)

Options of [satelliteEVMAdapter](/packages/satellite-evm/functions/satelliteEVMAdapter.md): the lookups to third parties it may make, each off by default.

## Properties

### ensAvatar?

> `optional` **ensAvatar?**: `boolean`

Defined in: [satellite-evm/src/adapters/evmAdapter.ts:30](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/adapters/evmAdapter.ts#L30)

Let `getAvatar` look the avatar of an ENS name up (`getAvatar` of `@tuwaio/orbit-evm` with `ensAvatar`): viem
reads its record over the mainnet RPC, then fetches what the record points to from any host it names, and whoever
shows the image loads it from the host of its URL. Off by default, and then `getAvatar` returns `null`.
