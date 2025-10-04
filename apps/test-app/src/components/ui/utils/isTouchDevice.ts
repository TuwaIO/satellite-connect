/**
 * @fileoverview Utility function to determine if the current environment supports touch input.
 * This is safe to use in Next.js applications as it checks for the `window` object existence.
 */

/**
 * Determines if the current browsing device supports touch input,
 * while also excluding large screens (typically desktop-sized touch monitors).
 *
 * It checks for:
 * 1. The presence of 'ontouchstart' or navigator.maxTouchPoints > 0 or '(pointer: coarse)'.
 * 2. ONLY returns true if the screen width is less than or equal to the specified threshold (e.g., 1200px).
 *
 * This function is safe for server-side rendering (SSR) environments like Next.js.
 *
 * @param {number} [maxWidth=1200] The maximum screen width (in pixels) for a device to be considered 'touch' (default is 1200).
 * @returns {boolean} Returns true if the environment is determined to support touch input AND is within the width limit, otherwise false.
 */
export function isTouchDevice(maxWidth: number = 1200): boolean {
  // 1. Check if we are running in a browser environment (Client Side).
  if (typeof window === 'undefined') {
    // If not in a browser (SSR), we assume no touch support for safety.
    return false;
  }

  // --- Core Touch Support Checks (Client Side Only) ---

  // A. Check for 'ontouchstart' event property (classic check).
  const hasTouchStart = 'ontouchstart' in window;

  // B. Check for maxTouchPoints (reliable modern check).
  const hasMaxTouchPoints = navigator.maxTouchPoints > 0;

  // C. Check for 'pointer: coarse' media query (detects "rough" pointer like a finger).
  let hasCoarsePointer = false;
  if (window.matchMedia) {
    hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  }

  // Determine if the device inherently supports touch input.
  const supportsTouch = hasTouchStart || hasMaxTouchPoints || hasCoarsePointer;

  // 2. Check the screen size condition.
  // The device must support touch AND its current width must be less than or equal to the defined maxWidth.
  const isSmallScreen = window.innerWidth <= maxWidth;

  // Return true only if both conditions are met.
  return supportsTouch && isSmallScreen;
}
