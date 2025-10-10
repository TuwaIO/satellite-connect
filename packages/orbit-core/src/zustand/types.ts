import { StoreApi } from 'zustand';

/**
 * A utility type for creating modular Zustand store slices, enabling composable state management.
 * @template T The state slice being defined.
 * @template S The full store state that includes the slice `T`.
 */
export type StoreSlice<T extends object, S extends object = T> = (
  set: StoreApi<S extends T ? S : S & T>['setState'],
  get: StoreApi<S extends T ? S : S & T>['getState'],
) => T;
