/**
 * Problem 2 (Medium): Find Prerequisites
 *
 * Task: Given a course identifier (or name), return an array of prerequisite course
 * identifiers (if any).
 *
 * Implement `getPrerequisites(subjects, courseIdentifier)` which returns an array
 * of strings.
 * 
 * This is intended to exercise basic traversal and simple text parsing.
 *
 * A helper function `extractPrereqsFromCourse(courseObj)` is given which
 * normalizes prerequisites stored as arrays or strings; this lets students focus
 * on locating the target course.
 */

/**
 * Solution to Problem 2
 * @param {Array|Object} subjects - parsed subjects data
 * @param {string} courseIdentifier - course title or code to lookup (e.g. "INTRO COMPUTER SCI")
 * @returns {Array<string>} array of prerequisite identifiers (strings), or [] if none
 */
function getPrerequisites(subjects, courseIdentifier) {
  if (!subjects || !courseIdentifier) return [];

  // Normalize input to match titles/codes in the data
  const needle = String(courseIdentifier).trim().toLowerCase();

  // Find the course object (first match by title or code)
  for (const dept of subjects) {
    if (!dept || typeof dept !== 'object') continue;
    for (const key of Object.keys(dept)) {
      if (!key.toLowerCase().startsWith('course_')) continue;
      const courseObj = dept[key];
      if (!courseObj) continue;
      const title = (courseObj.title || courseObj.name || '').toLowerCase();
      const code = (courseObj.code || '').toLowerCase();
      if (title === needle || code === needle || title.includes(needle) || code.includes(needle)) {
        return extractPrereqsFromCourse(courseObj);
      }
    }
  }

  return [];
}

/**
 * Extract prerequisite identifiers from a course object.
 * The data may store prereqs as an array or a string; this helper normalizes both.
 * @param {Object} courseObj
 * @returns {Array<string>} prerequisite identifiers
 */
function extractPrereqsFromCourse(courseObj) {
  if (!courseObj) return [];
  const p = courseObj.preReqNotes || null;
  if (!p) return [];
  if (Array.isArray(p)) return p.map(String);
  if (typeof p === 'string') {
    // naive split on comma/semicolon or the word 'and'
    return p
      .split(/[,;]|\band\b/gi)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

module.exports = { solve: getPrerequisites };
