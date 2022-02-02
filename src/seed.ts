import { appendFile } from 'node:fs/promises';
import { createReadStream, mkdirSync } from 'node:fs';
import * as https from 'node:https';
import { URL } from 'node:url';
import { createInterface } from 'node:readline';
import { join } from 'node:path';
import { EOL } from 'node:os';

const rimraf = require('rimraf');

const name = 'enable';
const folder = 'words';
const all = join(folder, `${name}-all.txt`);
const num = (length: number) => join(folder, `${name}-${length}.txt`);

rimraf.sync(folder);
mkdirSync(folder);

const u = new URL(
  'https://www.wordgamedictionary.com/enable/download/enable.txt',
);

const req = https.request(
  {
    method: 'GET',
    hostname: u.hostname,
    path: u.pathname,
  },
  (response) => {
    const total = Number(response.headers['content-length']);
    let current = 0;
    let lines = 0;

    response.on('data', (chunk) => {
      current += chunk.length;
      lines += occurrences(chunk, EOL);

      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        `Downloading... ${Math.round((current * 100.0) / total)}%`,
      );

      appendFile(all, chunk);
    });

    response.on('error', (err) => {
      console.error(err);
    });

    response.on('end', function () {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      console.log(`Downloaded: ${all}`);
      console.log();

      split(lines);
    });
  },
);

req.end();

function split(total: number) {
  let current = 0;
  const lengths = new Set<number>();

  const lineReader = createInterface({
    input: createReadStream(all),
  });

  lineReader.on('line', function (line) {
    if (++current % 100 === 0) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        `Splitting... ${Math.round((current * 100.0) / total)}%`,
      );
    }

    if (line.length) {
      lengths.add(line.length);
      appendFile(num(line.length), `${line}${EOL}`);
    }
  });

  lineReader.on('close', () => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(`Split into ${lengths.size} files:`);
    for (const length of Array.from(lengths).sort((a, b) => a - b)) {
      console.log(`  ${num(length)}`);
    }
    console.log();
  });
}

function occurrences(chunk: string, find: string) {
  if (find.length <= 0) return chunk.length + 1;

  let n = 0;
  let pos = 0;

  while (true) {
    pos = chunk.indexOf(find, pos);
    if (pos >= 0) {
      ++n;
      pos += find.length;
    } else break;
  }
  return n;
}
