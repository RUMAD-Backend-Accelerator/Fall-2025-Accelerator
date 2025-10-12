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
 * Solve Problem 2
 * @param {Array|Object} subjects - parsed subjects data
 * @param {string} courseIdentifier - course title or code to lookup (e.g. "INTRO COMPUTER SCI")
 * @returns {Array<string>} array of prerequisite identifiers (strings), or [] if none
 */
function getPrerequisites(subjects, courseIdentifier) {
  // TODO: implement this function.
  // HINTS:
  //  - Normalize `courseIdentifier` (lowercase, trim) to compare against
  //    course `title` or `code` fields.
  //  - Search each department's `course_*` entries for a match.
  //  - When found, use `extractPrereqsFromCourse(courseObj)` to obtain prereqs.
  //  - Return an array of strings (empty array if none found).
  const normalizedIndentifier = courseIdentifier.toLowerCase().trim();
  for (const dept of subjects) {
    for (const course of Object.keys(dept)) {
      if (course.startsWith('course_')) {
        const courseObj = dept[course];

        if (courseObj.title && courseObj.title.toLowerCase().trim() === normalizedIndentifier) {
          return extractPrereqsFromCourse(courseObj);
        }
        if (courseObj.code && courseObj.code.toLowerCase().trim() === normalizedIndentifier) {
          return extractPrereqsFromCourse(courseObj);
        }
      }
    }
  }
  return [];
}

/**
 * Helper: extract prerequisite identifiers from a course object
 * The data may store prereqs as an array or a string; this helper normalizes both.
 * @param {Object} courseObj
 * @returns {Array<string>} prerequisite identifiers
 */
function extractPrereqsFromCourse(courseObj) {
  if (!courseObj) return [];
  const p = courseObj.prerequisites || courseObj.prereq || courseObj.prereqs || null;
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