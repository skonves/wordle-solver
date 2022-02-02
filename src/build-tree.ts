import { writeFileSync } from 'node:fs';

import { len, recurse, solve, TreeNode } from './engine';
import { sec } from './utils';

const start = process.hrtime();
const tree = recurse(solve(null), len, 1);

writeFileSync('tree-binary.json', JSON.stringify(tree!));
const dur = process.hrtime(start);
console.log('done in', sec(dur), 'seconds. max depth', maxDepth(tree!));

function* traverse(subtree: TreeNode): Iterable<TreeNode> {
  yield subtree;
  if (subtree.answers) {
    for (const answer in subtree.answers) {
      yield* traverse(subtree.answers[answer]);
    }
  }
}

function maxDepth(subtree: TreeNode): number {
  let max = Number.MIN_SAFE_INTEGER;
  for (const n of traverse(subtree)) {
    if (n.d > max) max = n.d;
  }
  return max;
}
