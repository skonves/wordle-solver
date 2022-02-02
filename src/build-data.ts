import { writeFileSync } from 'node:fs';
import { len, wordlist } from './data';
import { sec } from './utils';

const start = process.hrtime();

const p = [81, 27, 9, 3, 1];

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

writeFileSync('data.dat', data);

console.log(
  `memoized ${data.length} comparisons in `,
  sec(process.hrtime(start)),
  'seconds',
);
