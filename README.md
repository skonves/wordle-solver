[![main](https://github.com/skonves/wordle-solver/workflows/build/badge.svg?branch=main&event=push)](https://github.com/skonves/wordle-solver/actions?query=workflow%3Abuild+branch%3Amain+event%3Apush)

# Wordle Solver

It's a wordle solver!

This project generates a decision tree for solving Wordles without relying on guesswork or probability. The root node gives the best starting guess and the list of all possible answers given all possible solutions in the word list. Each answer contains another guess and another set of answers. Of the word list of 12972 entries, all but 34 can be found within 6 guesses.

| Guess (depth) | Nodes |
| ------------- | ----- |
| 1st           | 1     |
| 2nd           | 173   |
| 3rd           | 2488  |
| 4th           | 7207  |
| 5th           | 4666  |
| 6th           | 711   |
| 7th           | 33    |
| 8th           | 1     |

Answers follow the "absent," "present," "correct" terminology. Absent (A) means the letter is not in the solution, present (P) means the letter _is_ in the solution but not in the correct position, and correct (C) means the letter is in the correct position. For example, 🟩⬛⬛🟨🟨 would be encoded as CAAPP.

Each guess will provide many answers. Each answer could be the result of many possible hidden solutions. where the answer matching the _most_ possible solutions is the _smallest_ of all possible guesses. The result is that each guess is designed to give answers where the _worst_ (most ambiguous) answer has the _fewest_ number of possible solutions. This process is repeated recursively until there each answer could only come from a single possible solution.

Although this method cannot guarantee a solution in 6 or fewer guesses, it does provide a 99.75% success rate. I toyed with a few algorithms for generating the tree. Multiple methods yielded a max depth of 8; however, this method resulted in the fewest 7th and 8th level guesses.

Further research is needed to determine if a tree of max-depth 6 (or even 7) can be generated. Note that large sets of words that all end with the same 4 letters (eg. *ills, *ents, etc) are especially problematic. This solution does not do anything specific to address that challenge. Improvements might be made by intentionally solving for those types of groups.

## How to:

### Run this project

1. Install all packages: `npm ci`
1. Build the code: `npm run build`
1. Optionally download extra seed data: `npm run seed`
1. Precompute comparisons: `npm run build-data` (takes about 20 seconds)
1. Build the tree: `npm start` (takes about 10 seconds)

Note that the `lint` script is run prior to `build`. Auto-fixable linting or formatting errors may be fixed by running `npm run fix`.

### Use alternate word lists

This project by default uses the official Wordle word list. The full list of allowed words (including the daily answers) is available in plain text on the Wordle webpage. The word list exists in two variables: one containing the answers for each day's puzzle, and a second containing the rest of the allowed word list. I combined both lists in a single file (wordle.txt). Each line contains a single five-letter word. Each line, excluding the final line, is terminated with a Unix line ending (`\n`). The list is sorted alphabetically to avoid spoilers.

The [Enable word list](https://www.wordgamedictionary.com/enable/) is public domain set of words. This project includes a script for downloading the full list and breaking them up into length-specific lists.

This project can be used with any list of 5 letter words\*. To use an alternate word list, pass the path to the file to the `build-data` or `start` scripts:

1. Optionally download extra seed data: `npm run seed`
1. Precompute comparisons: `npm run build-data -- words/enable-5.txt`
1. Build the tree: `npm start -- words/enable-5.txt`

\*Note that only lists of 5-letter words can be used. This is because there are 243 permutation of 3 options for 5 letters. This value is stored as a byte (UInt8) in a buffer when the caomparisons are precomputed. Longer letters would have answers that are larger than a single byte. This is solvable, but not implemented here.

### Create and run tests

1.  Add tests by creating files with the `.tests.ts` suffix
1.  Run the tests: `npm t`
1.  Test coverage can be viewed at `/coverage/lcov-report/index.html`

---

Generated with [generator-ts-console](https://www.npmjs.com/package/generator-ts-console)
