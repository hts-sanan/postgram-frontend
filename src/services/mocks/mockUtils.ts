/** Simulates real network latency so loading states are actually exercised in the UI. */
export function simulateDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let counter = 0;
/** Generates a reasonably unique id for records created in mock services. */
export function generateId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter}`;
}
