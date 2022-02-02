import { readFileSync } from 'node:fs';
import { EOL } from 'node:os';
import { sec } from './utils';

const start = process.hrtime();

const p = [81, 27, 9, 3, 1];

const wordlist = readFileSync('wordle.txt').toString().split(EOL);
const len = wordlist.length;

const data = Buffer.alloc(len * len);

for (let s = 0; s < len; s++) {
  for (let g = 0; g < len; g++) {
    let result = 0;
    for (let i = 0; i < 5; i++) {
      if (wordlist[g][i] === wordlist[s][i]) result += 2 * p[i];
      else if (wordlist[s].includes(wordlist[g][i])) result += p[i];
    }
    data.writeUInt8(result, s * len + g);
  }
}

console.log(
  `memoized ${data.length} comparisons in `,
  sec(process.hrtime(start)),
  'seconds',
);
