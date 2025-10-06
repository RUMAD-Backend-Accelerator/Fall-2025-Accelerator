const fs = require('fs');
const path = require('path');

/**
 * Loads the subjects.json file and returns the parsed object.
 * Returns an array or object depending on the file structure.
 */
function loadSubjects(relativePath = '../subjects.json') {
  const p = path.resolve(__dirname, relativePath);
  if (!fs.existsSync(p)) {
    throw new Error(`subjects.json not found at ${p}. Please place the file in hw1/ or update the path.`);
  }
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

module.exports = { loadSubjects };
