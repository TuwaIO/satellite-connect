/**
 * @file This file defines the core data structures and TypeScript types for the Pulsar transaction tracking engine.
 * It specifies the framework-agnostic models for transactions, their lifecycle statuses, and the interfaces for
 * the Zustand-based store and chain-specific adapters.
 */

import { StoreApi } from 'zustand';

// =================================================================================================
// 1. ZUSTAND UTILITY TYPES
// =================================================================================================

/**
 * A utility type for creating modular Zustand store slices, enabling composable state management.
 * @template T The state slice being defined.
 * @template S The full store state that includes the slice `T`.
 */
export type StoreSlice<T extends object, S extends object = T> = (
  set: StoreApi<S extends T ? S : S & T>['setState'],
  get: StoreApi<S extends T ? S : S & T>['getState'],
) => T;

// =================================================================================================
// 2. ENUMS AND CORE TRANSACTION TYPES
// =================================================================================================

/**
 * Defines the supported blockchain adapters. Each adapter corresponds to a specific chain architecture.
 */
export enum OrbitAdapter {
  /** For Ethereum Virtual Machine (EVM) compatible chains like Ethereum, Polygon, etc. */
  EVM = 'evm',
  /** For the Solana blockchain. */
  SOLANA = 'solana',
  /** For the Starknet L2 network. */
  Starknet = 'starknet',
}

export type OrbitGenericAdapter<A extends { key: OrbitAdapter }> = {
  adapter: A | A[];
};
