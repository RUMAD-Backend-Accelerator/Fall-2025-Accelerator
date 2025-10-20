/**
 * Problem 1 (Hard): Browse Courses
 *
 * Task: Given the subjects data, produce a list of courses with their credit value
 * and the number of sections they have. Then sort the courses, first by their
 * number of credits (descending) and then by their number of sections (descending) 
 * and return the first 10 courses. The intended output is a simple array of course
 * objects like:
 *
 * [ { course: 'INTRO COMPUTER SCI', credits: 4, sections: 41 }, ... ]
 *
 * Implement the `getTopTenCoursesByCredits(subjects)` function below. Ideally,
 * remove console.log debug statements before testing, so tests can call it.
 * 
 * A helper function `sortCoursesByCredits(courses)` is given, which does the sorting
 * for you. This is to focus student implementation effort on the `solve(subjects)`
 * function.
 */

/**
 * Solution to Problem 1
 * @param {Array|Object} subjects - parsed subjects data from subjects.json
 * @returns {Array<Object>} array of objects: { course: string, credits: number|null, sections: number }
 */
function getTopTenCoursesByCredits(subjects) {
  if (!subjects || !Array.isArray(subjects)) return [];

  const courses = [];

  for (const dept of subjects) {
    if (!dept || typeof dept !== 'object') continue;
    for (const key of Object.keys(dept)) {
      if (typeof key !== 'string') continue;
      if (!key.toLowerCase().startsWith('course_')) continue;
      const courseObj = dept[key];
      if (!courseObj) continue;

      const courseTitle = courseObj.title || courseObj.name || null;
      const credits = typeof courseObj.credits === 'number' ? courseObj.credits : null;

      let sectionsCount = 0;
      if (Array.isArray(courseObj.sections)) sectionsCount = courseObj.sections.length;
      else if (typeof courseObj.sections === 'number') sectionsCount = courseObj.sections;

      courses.push({ course: courseTitle, credits, sections: sectionsCount });
    }
  }

  sortCoursesByCredits(courses);
  return courses.slice(0, 10);
}

/**
 * Sort courses by credits, and then by sections.
 * @param {Array|Object} courses - course objects structured like the following:
 *  { course: 'INTRO COMPUTER SCI', credits: 4, sections: 41 }
 * @returns {Array<Object>} sorted array of course objects
 */
function sortCoursesByCredits(courses) {
  return courses.sort((c1, c2) => {
    // ... always check for null values to be safe
    const a = c1.credits == null ? Number.NEGATIVE_INFINITY : c1.credits;
    const b = c2.credits == null ? Number.NEGATIVE_INFINITY : c2.credits;
    if (a != b) return b - a; // credits descending
    // ... below this point, credits are equal, so sort by sections
    return (c2.sections || 0) - (c1.sections || 0); // sections descending
  });
}

module.exports = { solve: getTopTenCoursesByCredits };
