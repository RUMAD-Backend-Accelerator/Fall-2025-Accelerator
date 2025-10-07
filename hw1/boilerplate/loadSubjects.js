const fs = require('fs');
const path = require('path');

/**
 * Load the subjects.json file.
 *
 * Behavior:
 * - By default this loader prefers `../data/subjects.json` (i.e. `hw1/data/subjects.json`).
 * - For backward compatibility it will fall back to `../subjects.json` if the preferred file is missing.
 * - You may pass a relative path (relative to this file) to override the lookup.
 *
 * Returns the parsed JSON (array or object depending on the file).
 */
function loadSubjects(relativePath) {
  const preferred = path.resolve(__dirname, '../data/subjects.json');
  const fallback = path.resolve(__dirname, '../subjects.json');

  const candidates = [];
  if (relativePath) candidates.push(path.resolve(__dirname, relativePath));
  candidates.push(preferred, fallback);

  let foundPath = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      foundPath = p;
      break;
    }
  }

  if (!foundPath) {
    throw new Error(
      `subjects.json not found. Tried the following paths: ${candidates.join(', ')}.\n` +
        'Place your data in `hw1/data/subjects.json` or call loadSubjects(relativePath) with the correct path.'
    );
  }

  const raw = fs.readFileSync(foundPath, 'utf8');
  return JSON.parse(raw);
}

module.exports = { loadSubjects };
