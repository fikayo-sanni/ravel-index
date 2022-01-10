export function encodeMinor(value: bigint): string {
  return value.toString();
}

export function decodeMinor(raw: string): bigint {
  if (!/^-?\d+$/.test(raw)) return 0n;
  return BigInt(raw);
}

export function sumMinor(values: bigint[]): bigint {
  let total = 0n;
  for (const v of values) total += v;
  return total;
}
