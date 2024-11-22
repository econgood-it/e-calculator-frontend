// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function areFunctionsEqual(a: any, b: any) {
  if (typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString() && a.length === b.length;
  }
  return undefined;
}
