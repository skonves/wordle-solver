import { readFileSync } from 'node:fs';
import { EOL } from 'node:os';
import { check } from './data';

const wordlist = readFileSync('wordle.txt').toString().split(EOL);
export const len = wordlist.length;

export function solve(
  solutions: Iterable<number> | null,
  exclude?: Set<number>,
): {
  first: number;
  solutionsByAnswer: Map<number, Set<number>>;
} {
  let maxCount = Number.MIN_SAFE_INTEGER;
  let first = Number.MIN_SAFE_INTEGER;
  for (let g = 0; g < len; g++) {
    const answers: number[] = [];
    if (solutions) {
      for (const s of solutions) answers[check(s, g)] = 1;
    } else {
      for (let s = 0; s < len; s++) answers[check(s, g)] = 1;
    }
    let count = 0;
    for (const a of answers) count += a || 0;

    if (count > maxCount && (!exclude || !exclude.has(g))) {
      first = g;
      maxCount = count;
    }
  }

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
