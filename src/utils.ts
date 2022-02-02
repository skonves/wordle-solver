export function sec(hrTime: [number, number]): number {
  return Math.round((hrTime[0] * 1000000 + hrTime[1] / 1000) / 1000) / 1000;
}
