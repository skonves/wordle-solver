import { len, loadWordList, loadData, check, word } from './data';
import { math_avgEntropy } from './engine';

loadData();
loadWordList();

const words: [string, number][] = [];

for (let g = 0; g < len; g++) {
  const answers: number[] = [];
  for (let s = 0; s < len; s++) {
    const c = check(s, g);
    if (answers[c] === undefined) answers[c] = 0;
    answers[c] += 1;
  }
  const avgEntropy = math_avgEntropy(answers, len);

  words.push([word(g), avgEntropy]);
}

const sorted = words.sort(([, a], [, b]) => b - a);

console.log(sorted.slice(0, 50));
