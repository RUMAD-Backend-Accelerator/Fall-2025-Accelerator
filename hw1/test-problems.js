const fs = require('fs');
const path = require('path');
// Load local .env.student for hw1 if present. This allows per-homework config
// like PREFERRED_FOLDER to be set inside the hw1 directory without conflicting
// with other tooling that may use a top-level .env file.
require('dotenv').config({ path: path.join(__dirname, '.env.student') });

// Simple helper to attempt to require a module and return null on failure
function tryRequire(relPath) {
  try {
    return require(relPath);
  } catch (e) {
    return null;
  }
}

function pretty(msg) { console.log(msg); }

// Preferred folder for student modules: change to the student's folder name
// (for example 'solutions' or the student's NetID). Can be overridden
// with the PREFERRED_FOLDER environment variable.
const PREFERRED_FOLDER = process.env.PREFERRED_FOLDER || 'solutions';

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
  const loaderMod = tryRequire('./' + PREFERRED_FOLDER + '/loadSubjects') || tryRequire('./boilerplate/loadSubjects') || tryRequire('./solutions/loadSubjects');
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

    // try to require the student's module preferring the configured folder
    const preferredPath = './' + PREFERRED_FOLDER + '/' + problem.replace('p', 'problem');
    const otherPath = preferredPath.startsWith('./boilerplate') ? './solutions/' + problem.replace('p', 'problem') : './boilerplate/' + problem.replace('p', 'problem');
    const mod = tryRequire(preferredPath) || tryRequire(otherPath);

    // Helper to pick an implementation function from a module object
    function pickImpl(moduleObj, problemKey) {
      if (!moduleObj) return null;
      // If module itself is a function (module.exports = function) use it
      if (typeof moduleObj === 'function') return moduleObj;

      // Preferred named exports
      const namesByProblem = {
        p2: ['getPrerequisites', 'getPrereqs', 'solve', 'default'],
        p1: ['solve', 'default'],
        p3: ['solve', 'default']
      };

      const names = namesByProblem[problemKey] || ['solve', 'default'];
      for (const n of names) {
        if (typeof moduleObj[n] === 'function') return moduleObj[n];
      }

      // Fallback: return the first function-valued property on the export
      for (const k of Object.keys(moduleObj)) {
        if (typeof moduleObj[k] === 'function') return moduleObj[k];
      }

      return null;
    }

    const impl = pickImpl(mod, problem);

    if (!impl) {
      console.warn(`  Module for ${problem} not found or missing expected export. Tried ${preferredPath} and ${otherPath}. Skipping all ${problem} cases.`);
      continue;
    }

    const casesFor = cases[problem];
    // per-problem counters
    let counters = { total: casesFor.length, passed: 0, failed: 0, skipped: 0 };

    // If implementation not found, mark all as skipped
    if (!impl) {
      pretty(`  Implementation not found for ${problem}; skipping ${counters.total} tests.`);
      counters.skipped = counters.total;
      pretty(`  Summary for ${problem}: passed ${counters.passed} / ${counters.total} (skipped ${counters.skipped}, failed ${counters.failed})`);
      continue;
    }

    for (const tc of casesFor) {
      pretty(`\n  Test: ${tc.name} — ${tc.notes || ''}`);
  try {
        // Build inputs depending on problem; always call the resolved `impl` function
        let result = null;
  if (problem === 'p1') {
          // p1: solve(subjects, options?)
          const opts = tc.input || {};
          if (!subjects) {
            console.warn('    Subjects not loaded; skipping test.');
            counters.skipped += 1;
            continue;
          }
          // allow implementations that accept (subjects) or (subjects, options)
          if (impl.length >= 2) {
            result = impl(subjects, opts);
          } else {
            result = impl(subjects);
          }
        } else if (problem === 'p2') {
          const courseIdentifier = (tc.input && tc.input.courseIdentifier) || tc.input || 'INTRO COMPUTER SCI';
          if (!subjects) {
            console.warn('    Subjects not loaded; skipping test.');
            counters.skipped += 1;
            continue;
          }
          result = impl(subjects, courseIdentifier);
        } else if (problem === 'p3') {
          const opts = tc.input || {};
          if (!subjects) {
            console.warn('    Subjects not loaded; skipping test.');
            counters.skipped += 1;
            continue;
          }
          if (impl.length >= 2) {
            result = impl(subjects, opts);
          } else {
            result = impl(subjects);
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
          // treat as pass unless expected is provided and mismatches
          if (tc.expected !== null) {
            const pass = JSON.stringify(result) === JSON.stringify(tc.expected);
            if (pass) counters.passed += 1; else counters.failed += 1;
          } else {
            counters.passed += 1;
          }
        } else if (result && typeof result === 'object') {
          pretty('    OK — object keys: ' + Object.keys(result).length);
          if (tc.expected !== null) {
            const pass = JSON.stringify(result) === JSON.stringify(tc.expected);
            if (pass) counters.passed += 1; else counters.failed += 1;
          } else {
            counters.passed += 1;
          }
        } else {
          pretty('    OK — result: ' + String(result));
          if (tc.expected !== null) {
            const pass = JSON.stringify(result) === JSON.stringify(tc.expected);
            if (pass) counters.passed += 1; else counters.failed += 1;
          } else {
            counters.passed += 1;
          }
        }

        if (tc.expected !== null) {
          const expected = tc.expected;
          const pass = JSON.stringify(result) === JSON.stringify(expected);
          pretty('    Expected provided -> ' + (pass ? 'PASS' : 'FAIL'));
        }
      } catch (err) {
        console.error('    ERROR running test:', err && err.message ? err.message : err);
        counters.failed += 1;
      }
    }

    // Print per-problem summary
    pretty(`  Summary for ${problem}: passed ${counters.passed} / ${counters.total} (skipped ${counters.skipped}, failed ${counters.failed})`);
  }

  pretty('\nRunner finished.');
}

if (require.main === module) run();

module.exports = { run };
