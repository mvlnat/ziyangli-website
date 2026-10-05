// Compile and exercise the actual published async examples, rather than copies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const article = path.resolve(__dirname, '../src/posts/2024-05-typescript-async-promise.tsx');
const ast = ts.createSourceFile(article, fs.readFileSync(article, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const examples = [];
function visit(node) {
  if (ts.isNoSubstitutionTemplateLiteral(node)) examples.push(node.text);
  ts.forEachChild(node, visit);
}
visit(ast);

function extract(start, end) {
  const example = examples.find(text => text.startsWith(start));
  assert.ok(example, `Missing published example: ${start}`);
  return end ? example.split(end)[0] : example;
}

const source = [
  'interface User { id: string; name: string; }',
  extract('class ApiError'),
  extract('type Result', '\nconst result'),
  extract('function debounceAsync', '\nconst debouncedSearch'),
  extract('class AsyncQueue', '\nconst queue'),
  extract('async function retry', '\nconst data'),
  extract('async function withTimeout', '\nconst user'),
  // This assignment also catches an incorrect nested Promise return type.
  'const typedDebounce: (value: string) => Promise<string> = debounceAsync(async (value: string) => value, 10);',
].join('\n');

const options = {
  strict: true, noEmit: true, skipLibCheck: true, types: [],
  target: ts.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'],
};
const filename = path.resolve(__dirname, 'published-examples.ts');
const host = ts.createCompilerHost(options);
const originalGetSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (file, ...args) => file === filename
  ? ts.createSourceFile(file, source, options.target, true)
  : originalGetSourceFile(file, ...args);
const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([filename], options, host));
assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
  getCurrentDirectory: () => process.cwd(), getCanonicalFileName: file => file, getNewLine: () => '\n',
}));

let nextTimer = 0;
const timers = new Map();
const context = vm.createContext({
  console: { error: () => {} },
  setTimeout: callback => { const id = ++nextTimer; timers.set(id, callback); return id; },
  clearTimeout: id => timers.delete(id),
});
const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText;
vm.runInContext(`${code}\nthis.helpers = { debounceAsync, AsyncQueue, retry, withTimeout, fetchUserResult };`, context);
const { debounceAsync, AsyncQueue, retry, withTimeout, fetchUserResult } = context.helpers;

async function runTimers() {
  const batch = [...timers.values()];
  timers.clear();
  await Promise.all(batch.map(callback => callback()));
}

async function verify() {
  context.fetch = async () => ({ ok: false, status: 404, json: async () => { throw new SyntaxError('not JSON'); } });
  const failedRequest = await fetchUserResult('missing');
  assert.equal(failedRequest.success, false);
  assert.equal(failedRequest.error.statusCode, 404);
  context.fetch = async () => ({ ok: true, json: async () => ({ id: '1', name: 'Alice' }) });
  const user = await fetchUserResult('1');
  assert.equal(user.success, true);
  assert.equal(user.data.name, 'Alice');
  let calls = 0;
  const debounce = debounceAsync(async value => { calls++; return value; }, 10);
  const first = debounce('first');
  const second = debounce('second');
  await runTimers();
  assert.deepEqual(await Promise.all([first, second]), ['second', 'second']);
  assert.equal(calls, 1);

  const error = new Error('request failed');
  const fail = debounceAsync(async () => { throw error; }, 10);
  const failures = [fail(), fail()];
  const outcomes = Promise.allSettled(failures);
  await runTimers();
  for (const result of await outcomes) {
    assert.equal(result.status, 'rejected');
    assert.equal(result.reason, error);
  }

  let release;
  const inFlight = debounceAsync(value => value === 'slow'
    ? new Promise(resolve => { release = resolve; }) : Promise.resolve(value), 10);
  const slow = inFlight('slow');
  const running = runTimers();
  const fast = inFlight('fast');
  await runTimers();
  assert.equal(await fast, 'fast');
  release('slow');
  await running;
  assert.equal(await slow, 'slow');

  let active = 0;
  let peak = 0;
  const releases = [];
  const queue = new AsyncQueue(2);
  const jobs = [1, 2, 3, 4].map(value => queue.add(async () => {
    peak = Math.max(peak, ++active);
    await new Promise(resolve => releases.push(resolve));
    active--;
    if (value === 2) throw error;
    return value;
  }));
  const completed = Promise.allSettled(jobs);
  assert.equal(releases.length, 2);
  releases.shift()();
  await jobs[0];
  releases.shift()();
  await jobs[1].catch(() => {});
  assert.equal(releases.length, 2);
  releases.splice(0).forEach(resolve => resolve());
  const results = await completed;
  assert.equal(peak, 2);
  assert.equal(results[1].status, 'rejected');
  assert.equal(results[3].value, 4);
  for (const invalid of [0, -1, 1.5, NaN, Infinity]) {
    assert.throws(() => new AsyncQueue(invalid), /positive integer/);
    await assert.rejects(retry(async () => 1, invalid), /positive integer/);
  }

  let attempts = 0;
  const retried = retry(async () => { attempts++; if (attempts < 3) throw error; return 42; }, 3, 0);
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
    await runTimers();
  }
  assert.equal(await retried, 42);
  assert.equal(attempts, 3);
  assert.equal(await withTimeout(Promise.resolve(42), 100), 42);
  assert.equal(timers.size, 0);
  await assert.rejects(withTimeout(Promise.reject(error), 100), /request failed/);
  assert.equal(timers.size, 0);
  const expired = assert.rejects(withTimeout(new Promise(() => {}), 100), /Timeout/);
  await runTimers();
  await expired;
  console.log('Published async examples compile; HTTP errors, debounce, queue, retry, and timeout behavior passed.');
}

// Keep Node alive so an accidentally unresolved promise cannot silently pass.
const watchdog = setTimeout(() => {
  console.error('Published example checks stalled on an unresolved promise.');
  process.exitCode = 1;
}, 3000);
verify().catch(error => { console.error(error); process.exitCode = 1; })
  .finally(() => clearTimeout(watchdog));
