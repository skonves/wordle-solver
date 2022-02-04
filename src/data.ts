import { readFileSync, writeFileSync } from 'node:fs';
import { EOL } from 'node:os';

export const p = [81, 27, 9, 3, 1];

let wordlist: string[];
let data: Buffer;
export let len: number;
export function loadWordList() {
  wordlist = readFileSync(process.argv[2] || 'wordle.txt')
    .toString()
    .split(EOL);
  len = wordlist.length;
}
export function loadData() {
  data = readFileSync('data.dat');
}

export function build(): void {
  const d = Buffer.alloc(len * len);

  for (let s = 0; s < len; s++) {
    for (let g = 0; g < len; g++) {
      d.writeUInt8(compute(wordlist[s], wordlist[g]), s * len + g);
    }
  }

  writeFileSync('data.dat', d);
}

export function compute(solution: string, guess: string): number {
  let result = 0;
  const usedInSolution: boolean[] = [];
  const usedInGuess: boolean[] = [];
  for (let i = 0; i < 5; i++) {
    if (guess[i] === solution[i]) {
      result += 2 * p[i];
      usedInSolution[i] = true;
      usedInGuess[i] = true;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (usedInGuess[i]) continue;
    for (let ii = 0; ii < 5; ii++) {
      if (!usedInSolution[ii] && guess[i] === solution[ii]) {
        result += p[i];
        usedInSolution[ii] = true;
        break;
      }
    }
  }
  return result;
}

export function check(s: number, g: number): number {
  return data.readUInt8(s * len + g);
}

export function word(n: number): string {
  return wordlist[n];
}

export function ans(n: number): string {
  let r = n;

  const aa = ['A', 'A', 'A', 'A', 'A'];

  for (let i = 0; i < 5; i++) {
    const a = Math.floor(r / p[i]);
    r = r % p[i];

    if (a === 2) aa[i] = 'C';
    if (a === 1) aa[i] = 'P';
  }

  return aa.join('');
}

export function val(answer: string): number {
  let x = 0;
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === 'P') x += p[i];
    if (answer[i] === 'C') x += 2 * p[i];
  }
  return x;
}
