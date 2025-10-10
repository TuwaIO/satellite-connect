export async function waitFor(
  predicate: () => boolean | undefined,
  maxChecks: number = 50,
  checkIntervalMs: number = 200,
) {
  for (let i = 0; i < maxChecks; i++) {
    if (predicate()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, checkIntervalMs));
  }
  throw new Error('Predicate not fulfilled in time');
}
