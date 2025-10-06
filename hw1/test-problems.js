const { loadSubjects } = require('./boilerplate/loadSubjects');
const p1 = require('./boilerplate/problem1');
const p2 = require('./boilerplate/problem2');
const p3 = require('./boilerplate/problem3');

function run() {
  console.log('\nRUMAD Homework 1 test runner');
  const subjects = loadSubjects('../subjects.json');
  console.log('Loaded subjects.');

  console.log('\nProblem 1:');
  try {
    const out1 = p1.solve(subjects);
    console.log('  Result (first 10):', Array.isArray(out1) ? out1.slice(0,10) : out1);
  } catch (e) {
    console.log('  Problem 1 not implemented yet.');
  }

  console.log('\nProblem 2:');
  try {
    const out2 = p2.solve(subjects, 'INTRO COMPUTER SCI');
    console.log('  Result:', out2);
  } catch (e) {
    console.log('  Problem 2 not implemented yet.');
  }

  console.log('\nProblem 3:');
  try {
    const out3 = p3.solve(subjects);
    console.log('  Result:', out3);
  } catch (e) {
    console.log('  Problem 3 not implemented yet.');
  }

  console.log('\nDone.');
}

if (require.main === module) run();

module.exports = { run };
