import { writeFileSync } from 'fs';

import { len } from './data';
import { recurse, solve, TreeNode } from './engine';
import { sec } from './utils';

const start = process.hrtime();
const tree = recurse(solve(null), len, 1);
console.log('built in', sec(process.hrtime(start)), 'seconds');

writeFileSync('tree.json', JSON.stringify(tree));
console.log(stats(tree));

function* traverse(subtree: TreeNode): Iterable<TreeNode> {
  yield subtree;
  if (subtree.answers) {
    for (const answer in subtree.answers) {
      yield* traverse(subtree.answers[answer]);
    }
  }
}

function stats(subtree: TreeNode): {
  nodes: number;
  histogram: Record<number, number>;
} {
  let nodes = 0;
  const histogram: Record<number, number> = {};

  for (const n of traverse(subtree)) {
    nodes++;
    if (histogram[n.d] === undefined) histogram[n.d] = 0;
    histogram[n.d] += 1;
  }
  return { nodes, histogram };
}
