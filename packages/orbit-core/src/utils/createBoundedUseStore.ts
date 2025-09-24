/**
 * @file This file provides a utility for creating a type-safe, bounded Zustand hook from a vanilla store.
 * This pattern is recommended by the official Zustand documentation to ensure full type
 * safety when integrating vanilla stores with React.
 *
 * @see https://docs.pmnd.rs/zustand/guides/typescript#bounded-usestore-hook-for-vanilla-stores
 */

import { StoreApi, useStore } from 'zustand';

/**
 * A utility type that infers the state shape from a Zustand `StoreApi`.
 * It extracts the return type of the `getState` method.
 * @template S - The type of the Zustand store (`StoreApi`).
 */
type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

/**
 * Creates a bounded `useStore` hook from a vanilla Zustand store.
 *
 * This function takes a vanilla Zustand store instance and returns a React hook
 * that is pre-bound to that store. This approach provides a cleaner API and
 * enhances type inference, eliminating the need to pass the store instance
 * on every use.
 *
 * The returned hook supports two signatures:
 * 1. `useBoundedStore()`: Selects the entire state.
 * 2. `useBoundedStore(selector)`: Selects a slice of the state, returning only what the selector function specifies.
 *
 * @template S - The type of the Zustand store (`StoreApi`).
 * @param {S} store - The vanilla Zustand store instance to bind the hook to.
 * @returns {function} A fully typed React hook for accessing the store's state.
 */
export const createBoundedUseStore = ((store) => (selector) => useStore(store, selector)) as <
  S extends StoreApi<unknown>,
>(
  store: S,
) => {
  // This implementation uses a Immediately Invoked Function Expression (IIFE)
  // trick combined with casting to achieve the desired overloaded function signature in a concise way.
  (): ExtractState<S>;
  <T>(selector: (state: ExtractState<S>) => T): T;
};
