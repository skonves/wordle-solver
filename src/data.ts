import { readFileSync } from 'node:fs';
import { EOL } from 'node:os';

const p = [81, 27, 9, 3, 1];

export const wordlist = readFileSync(process.argv[2] || 'wordle.txt')
  .toString()
  .split(EOL);
export const data = readFileSync('data.dat');
export const len = wordlist.length;

export function check(s: number, g: number): number {
  return data.readUInt8(s * len + g);
}

export function word(n: number): string {
  return wordlist[n];
}

export function ans(n: number): string {
  let r = n;

  const aa = ['N', 'N', 'N', 'N', 'N'];

  for (let i = 0; i < 5; i++) {
    const a = Math.floor(r / p[i]);
    r = r % p[i];

    if (a === 2) aa[i] = 'Y';
    if (a === 1) aa[i] = 'M';
  }

  return aa.join('');
}
