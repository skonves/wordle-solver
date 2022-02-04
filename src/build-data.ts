import { build, len, loadWordList } from './data';
import { sec } from './utils';

const start = process.hrtime();

loadWordList();
build();

console.log(
  `memoized ${len * len} comparisons in `,
  sec(process.hrtime(start)),
  'seconds',
);
