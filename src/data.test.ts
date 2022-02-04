import { ans, compute } from './data';

// See https://nerdschalk.com/wordle-same-letter-twice-rules-explained-how-does-it-work/

const cases = [
  ['abbey', 'opens', 'AAPAA'],
  ['abbey', 'babes', 'PPCCA'],
  ['abbey', 'kebab', 'APCPP'],
  ['abbey', 'abyss', 'CCPAA'],

  ['abbey', 'algae', 'CAAAP'],
  ['abbey', 'keeps', 'APAAA'],
  ['abbey', 'orbit', 'AACAA'],
  ['abbey', 'abate', 'CCAAP'],

  ['pleat', 'knoll', 'AAAPA'],
  ['pleat', 'llama', 'ACPAA'],

  ['added', 'daals', 'PPAAA'],
];

test.each(cases)('Solution: %s | Guess: %s | %s', (solution, guess, answer) => {
  expect(ans(compute(solution, guess))).toEqual(answer);
});
