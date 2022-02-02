import { readFileSync } from 'node:fs';
import { EOL } from 'node:os';
import { check } from './data';

const wordlist = readFileSync('wordle.txt').toString().split(EOL);
export const len = wordlist.length;

function math_max(arr: Iterable<number | undefined>): number {
  let r = Number.MIN_SAFE_INTEGER;
  for (const n of arr) if (n && n > r) r = n;
  return r;
}

// function math_countOverTwo(arr: Iterable<number | undefined>) {
//   let r = 0;
//   for (const n of arr) if (n !== undefined && n > 2) r++;
//   return r;
// }

// function math_count(arr: Iterable<number | undefined>) {
//   let r = 0;
//   for (const n of arr) if (n !== undefined) r++;
//   return r;
// }

export function solve(
  solutions: Iterable<number> | null,
  exclude?: Set<number>,
): {
  first: number;
  solutionsByAnswer: Map<number, Set<number>>;
} {
  let smallestMax = Number.MAX_SAFE_INTEGER;
  // let maxCount = Number.MIN_SAFE_INTEGER;
  // let maxCountOverTwo = Number.MIN_SAFE_INTEGER;

  let firstBySmallestMax = -1;
  // let firstByMaxCount = -1;
  // let firstByMaxCountOverTwo = -1;

  for (let g = 0; g < len; g++) {
    if (exclude && exclude.has(g)) continue;
    const answers: number[] = [];
    if (solutions) {
      for (const s of solutions) {
        const c = check(s, g);
        if (answers[c] === undefined) answers[c] = 0;
        answers[c] += 1;
        if (answers[c] > smallestMax) break;
      }
    } else {
      for (let s = 0; s < len; s++) {
        const c = check(s, g);
        if (answers[c] === undefined) answers[c] = 0;
        answers[c] += 1;
        if (answers[c] > smallestMax) break;
      }
    }
    const max = math_max(answers);
    if (max < smallestMax) {
      firstBySmallestMax = g;
      smallestMax = max;
    }
    // const count = math_count(answers);
    // if (count > maxCount) {
    //   firstByMaxCount = g;
    //   maxCount = count;
    // }
    // const countOverTwo = math_countOverTwo(answers);
    // if (countOverTwo > maxCountOverTwo) {
    //   firstByMaxCountOverTwo = g;
    //   maxCountOverTwo = countOverTwo;
    // }
  }

  const first = firstBySmallestMax;

  const solutionsByAnswer = new Map<number, Set<number>>();
  if (solutions) {
    for (const s of solutions) {
      const answer = check(s, first);
      if (!solutionsByAnswer.has(answer)) {
        solutionsByAnswer.set(answer, new Set());
      }
      solutionsByAnswer.get(answer)!.add(s);
    }
  } else {
    for (let s = 0; s < len; s++) {
      const answer = check(s, first);
      if (!solutionsByAnswer.has(answer)) {
        solutionsByAnswer.set(answer, new Set());
      }
      solutionsByAnswer.get(answer)!.add(s);
    }
  }

  return { first, solutionsByAnswer };
}

export function recurse(
  input: {
    first: number;
    solutionsByAnswer: Map<number, Set<number>>;
  },
  s: number,
  d: number,
): TreeNode {
  const answers: Record<number, TreeNode> = {};

  for (const [answer, solutions] of input.solutionsByAnswer) {
    if (solutions.size === 1) {
      answers[answer] = { guess: Array.from(solutions)[0], s: 1, d: d + 1 };
    } else if (solutions.size === 2) {
      const [a, b] = solutions;
      answers[answer] = {
        s: 2,
        d: d + 1,
        guess: a,
        answers: {
          [check(a, b)]: { guess: b, s: 1, d: d + 2 },
        },
      };
    } else if (answer !== 242 /* YYYYY */) {
      answers[answer] = recurse(solve(solutions), solutions.size, d + 1);
    }
  }

  return { guess: input.first, answers: answers, s, d };
}

export type TreeNode = {
  s: number;
  d: number;
  guess: number;
  answers?: Record<number, TreeNode>;
  exclude?: number[];
};
