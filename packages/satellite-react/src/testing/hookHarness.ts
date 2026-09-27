/**
 * @file A minimal renderer for tests of headless components and hooks. The package has no DOM testing library, so
 * the tests replace `useState`, `useMemo`, `useEffect`, `useEffectEvent` and `useContext` from `react` with the
 * functions below and render elements by calling components as functions. This module must not import `react`.
 */

type Slot = { deps?: readonly unknown[]; value?: unknown; cleanup?: unknown; stable?: unknown };
type Fiber = { type: unknown; hooks: Slot[]; child?: Fiber };
type Element = { type: unknown; props: { children?: unknown } & Record<string, unknown> } | null | undefined;

let current: Fiber | undefined;
let hookIndex = 0;
let root: Fiber | undefined;
let rootElement: Element;
let dirty = false;
let contextValue: unknown = null;
const pendingEffects: Array<() => void> = [];

const depsChanged = (prev: readonly unknown[] | undefined, next: readonly unknown[] | undefined) =>
  !prev || !next || prev.length !== next.length || prev.some((dep, index) => !Object.is(dep, next[index]));

const nextSlot = (): Slot => {
  const fiber = current!;
  const index = hookIndex++;
  fiber.hooks[index] ??= {};
  return fiber.hooks[index];
};

const unmountFiber = (fiber: Fiber | undefined) => {
  if (!fiber) return;
  unmountFiber(fiber.child);
  for (const slot of fiber.hooks) if (typeof slot.cleanup === 'function') slot.cleanup();
};

const renderElement = (element: Element, prev: Fiber | undefined): Fiber | undefined => {
  if (!element || typeof element !== 'object') {
    unmountFiber(prev);
    return undefined;
  }
  let fiber = prev;
  if (!fiber || fiber.type !== element.type) {
    unmountFiber(prev);
    fiber = { type: element.type, hooks: [] };
  }
  if (typeof element.type !== 'function') {
    // Context providers and host elements: render their child element.
    fiber.child = renderElement(element.props.children as Element, fiber.child);
    return fiber;
  }
  const [parent, parentIndex] = [current, hookIndex];
  current = fiber;
  hookIndex = 0;
  const output = (element.type as (props: unknown) => unknown)(element.props) as Element;
  current = parent;
  hookIndex = parentIndex;
  fiber.child = renderElement(output, fiber.child);
  return fiber;
};

const flush = () => {
  dirty = false;
  root = renderElement(rootElement, root);
  while (pendingEffects.length) pendingEffects.shift()!();
};

/**
 * The hook implementations and the renderer. Mock `react` with the hooks, then call `render` and `settle`.
 */
export const harness = {
  /**
   * `useState` with functional updates. A state update renders again on the next `settle`.
   *
   * @param initial - Initial value or initializer.
   * @returns The value and its setter.
   */
  useState(initial: unknown) {
    const slot = nextSlot();
    if (!('value' in slot)) slot.value = typeof initial === 'function' ? (initial as () => unknown)() : initial;
    const setState = (next: unknown) => {
      slot.value = typeof next === 'function' ? (next as (prev: unknown) => unknown)(slot.value) : next;
      dirty = true;
    };
    return [slot.value, setState];
  },
  /**
   * `useMemo` with dependency comparison.
   *
   * @param factory - Computes the value.
   * @param deps - Dependencies.
   * @returns The memoized value.
   */
  useMemo(factory: () => unknown, deps: readonly unknown[]) {
    const slot = nextSlot();
    if (depsChanged(slot.deps, deps)) {
      slot.value = factory();
      slot.deps = deps;
    }
    return slot.value;
  },
  /**
   * `useEffect` with dependency comparison and cleanups. Effects run after the render, in order.
   *
   * @param effect - The effect.
   * @param deps - Dependencies; every render when omitted.
   */
  useEffect(effect: () => unknown, deps?: readonly unknown[]) {
    const slot = nextSlot();
    if (depsChanged(slot.deps, deps)) {
      slot.deps = deps;
      pendingEffects.push(() => {
        if (typeof slot.cleanup === 'function') slot.cleanup();
        slot.cleanup = effect();
      });
    }
  },
  /**
   * `useEffectEvent`: a stable function that calls the callback of the latest render.
   *
   * @param callback - The callback of this render.
   * @returns The stable function.
   */
  useEffectEvent(callback: (...args: unknown[]) => unknown) {
    const slot = nextSlot();
    slot.value = callback;
    slot.stable ??= (...args: unknown[]) => (slot.value as (...args: unknown[]) => unknown)(...args);
    return slot.stable;
  },
  /**
   * `useContext`: returns the value set with `setContextValue`.
   *
   * @returns The context value.
   */
  useContext() {
    return contextValue;
  },
  /**
   * Sets the value returned by `useContext`.
   *
   * @param value - The value.
   */
  setContextValue(value: unknown) {
    contextValue = value;
  },
  /**
   * Renders an element (again) and runs the pending effects.
   *
   * @param element - The root element.
   */
  render(element: unknown) {
    rootElement = element as Element;
    flush();
  },
  /**
   * Waits for pending promises (for example dynamic imports) and renders again after state updates.
   *
   * @returns Resolves after ten macrotasks.
   */
  async settle() {
    for (let attempt = 0; attempt < 10; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (dirty) flush();
    }
  },
  /** Runs the cleanups of the rendered tree and forgets it. */
  unmount() {
    unmountFiber(root);
    root = undefined;
  },
};
