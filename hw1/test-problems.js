const fs = require('fs');
const path = require('path');

// Simple helper to attempt to require a module and return null on failure
function tryRequire(relPath) {
  try {
    return require(relPath);
  } catch (e) {
    return null;
  }
}

function pretty(msg) { console.log(msg); }

async function run() {
  console.log('\nRUMAD Homework 1 test runner');

  const root = path.resolve(__dirname);
  const casesPath = path.join(root, 'test-cases.json');
  let cases = {};
  try {
    cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
  } catch (e) {
    console.error('Could not load test-cases.json:', e.message);
    process.exitCode = 2;
    return;
  }

  // CLI options: node test-problems.js [p1|p2|p3|all]
  const arg = (process.argv[2] || 'all').toLowerCase();
  const toRun = arg === 'all' ? ['p1','p2','p3'] : [arg];

  // load subjects helper once (if available)
  const loaderMod = tryRequire('./boilerplate/loadSubjects') || tryRequire('./solutions/loadSubjects');
  let subjects = null;
  if (loaderMod) {
    // module may export { loadSubjects } or be the function directly
    const loader = typeof loaderMod === 'function' ? loaderMod : (loaderMod.loadSubjects || loaderMod.default || null);
    if (typeof loader === 'function') {
      try {
        subjects = loader('../subjects.json');
        pretty('Loaded subjects.');
      } catch (e) {
        console.error('Failed to load subjects.json:', e.message);
        subjects = null;
      }
    } else {
      pretty('Warning: loadSubjects export not found; tests that require subjects will fail.');
    }
  } else {
    pretty('Warning: loadSubjects helper not found; tests that require subjects will fail.');
  }

  for (const problem of toRun) {
    if (!cases[problem]) {
      console.warn(`No test cases defined for ${problem}. Skipping.`);
      continue;
    }

    pretty('\n=== Running ' + problem + ' tests ===');

    // try to require the student's module first from boilerplate, then solutions
    const mod = tryRequire('./boilerplate/' + problem.replace('p', 'problem')) || tryRequire('./solutions/' + problem.replace('p', 'problem'));
    if (!mod || typeof mod.solve !== 'function') {
      console.warn(`  Module for ${problem} not found or missing 'solve' export. Skipping all ${problem} cases.`);
      continue;
    }

    const casesFor = cases[problem];
    for (const tc of casesFor) {
      pretty(`\n  Test: ${tc.name} — ${tc.notes || ''}`);
      try {
        // Build inputs depending on problem
        let result = null;
        if (problem === 'p1') {
          // p1: solve(subjects, options?)
          const opts = tc.input || {};
          if (!subjects) {
            console.warn('    Subjects not loaded; skipping test.');
            continue;
          }
          // allow implementations that accept (subjects) or (subjects, options)
          if (mod.solve.length >= 2) {
            result = mod.solve(subjects, opts);
          } else {
            result = mod.solve(subjects);
          }
        } else if (problem === 'p2') {
          const courseIdentifier = (tc.input && tc.input.courseIdentifier) || tc.input || 'INTRO COMPUTER SCI';
          if (!subjects) {
            console.warn('    Subjects not loaded; skipping test.');
            continue;
          }
          result = mod.solve(subjects, courseIdentifier);
        } else if (problem === 'p3') {
          const opts = tc.input || {};
          if (!subjects) {
            console.warn('    Subjects not loaded; skipping test.');
            continue;
          }
          if (mod.solve.length >= 2) {
            result = mod.solve(subjects, opts);
          } else {
            result = mod.solve(subjects);
          }
        } else {
          console.warn('    Unknown problem key:', problem);
          continue;
        }

        // If result is a Promise, await it
        if (result && typeof result.then === 'function') {
          result = await result;
        }

        // Print a compact summary
        if (Array.isArray(result)) {
          pretty('    OK — array length: ' + result.length + (result.length <= 10 ? ' — ' + JSON.stringify(result) : ''));
        } else if (result && typeof result === 'object') {
          pretty('    OK — object keys: ' + Object.keys(result).length);
        } else {
          pretty('    OK — result: ' + String(result));
        }

        if (tc.expected !== null) {
          const expected = tc.expected;
          const pass = JSON.stringify(result) === JSON.stringify(expected);
          pretty('    Expected provided -> ' + (pass ? 'PASS' : 'FAIL'));
        }
      } catch (err) {
        console.error('    ERROR running test:', err && err.message ? err.message : err);
      }
    }
  }

  pretty('\nRunner finished.');
}

if (require.main === module) run();

module.exports = { run };
