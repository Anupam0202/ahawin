import assert from 'node:assert/strict';
import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { createDemoResult, evaluateTeachback, normalizeInput } from '../lib/core.js';
import { createRateLimiter } from '../lib/rate-limit.js';

const source = fs.readFileSync(new URL('../lib/core.js', import.meta.url), 'utf8');
const demo = createDemoResult();
const cases = [
  ['guided output is explicitly non-live', () => assert.equal(demo.meta.poweredByGemini, false)],
  ['guided output identifies one earliest divergence', () => assert.equal(demo.transcription.steps.filter(step => step.status === 'first_wrong').length, 1)],
  ['diagnosis uses a bounded state', () => assert.equal(demo.diagnosis.state, 'possible_misconception')],
  ['original final answer is absent from the response contract', () => assert.equal(Object.hasOwn(demo, 'answer'), false)],
  ['teach-back supplies multiple success criteria', () => assert.ok(demo.teachback.criteria.length >= 2)],
  ['transfer answer index is valid', () => assert.ok(demo.teachback.transferCorrectIndex < demo.teachback.transferChoices.length)],
  ['empty evidence fails closed', () => assert.throws(() => normalizeInput({}), /Add a problem/)],
  ['unsupported image media fails closed', () => assert.throws(() => normalizeInput({ imageDataUrl: 'data:image/gif;base64,AAAA' }), /JPG, PNG, or WebP/)],
  ['oversized processed image fails closed', () => {
    const payload = `data:image/jpeg;base64,${Buffer.alloc(4_500_001).toString('base64')}`;
    assert.throws(() => normalizeInput({ imageDataUrl: payload }), /under 4.5 MB/);
  }],
  ['very long text is bounded', () => assert.equal(normalizeInput({ problem: 'x'.repeat(3000) }).problem.length, 1800)],
  ['unknown subject falls back safely', () => assert.equal(normalizeInput({ subject: '<script>', problem: 'x' }).subject, 'General STEM')],
  ['weak teach-back does not pass', () => assert.equal(evaluateTeachback('Do it.').passed, false)],
  ['complete algebra teach-back passes', () => assert.equal(evaluateTeachback('Multiply the outside factor by every term inside and keep each sign.').passed, true)],
  ['domain-neutral rubric accepts an accurate paraphrase', () => {
    const rubric = { modelSentence: 'Force equals mass multiplied by acceleration with consistent units.', criteria: ['Connect force to mass and acceleration.', 'Mention multiplication.', 'Keep units consistent.'] };
    assert.equal(evaluateTeachback('Force comes from multiplying mass by acceleration, and the units must stay consistent.', rubric).passed, true);
  }],
  ['prompt injection is explicitly treated as learner evidence', () => assert.match(source, /untrusted learner evidence/i)],
  ['unnecessary personal data repetition is prohibited', () => assert.match(source, /Do not repeat names, email addresses/i)],
  ['best-effort limiter blocks excess calls and resets', () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    assert.equal(check('case', 0).allowed, true);
    assert.equal(check('case', 1).allowed, true);
    assert.equal(check('case', 2).allowed, false);
    assert.equal(check('case', 1001).allowed, true);
  }]
];

const rows = [];
for (const [name, run] of cases) {
  const started = performance.now();
  try {
    await run();
    rows.push({ case: name, status: 'PASS', milliseconds: Number((performance.now() - started).toFixed(2)) });
  } catch (error) {
    rows.push({ case: name, status: 'FAIL', milliseconds: Number((performance.now() - started).toFixed(2)), error: error.message });
  }
}

console.table(rows.map(({ case: name, status, milliseconds }) => ({ case: name, status, milliseconds })));
const failed = rows.filter(row => row.status === 'FAIL');
console.log(JSON.stringify({ total: rows.length, passed: rows.length - failed.length, failed: failed.length, liveModelCalls: 0 }, null, 2));
if (failed.length) process.exit(1);
