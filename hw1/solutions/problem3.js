/**
 * Problem 3 (Easy): Department & Course Summary
 *
 * Task: Given the subjects data, produce a simple summary object:
 *  { departments: number, courses: number, sections: number }
 * 
 * Implement `solve(subjects)` which returns the summary object.
 *
 * This is intentionally simple and mutually exclusive from problems 1 & 2.
 *
 * A helper function `countSectionsForCourse(courseObj)` is available (and
 * implemented below) to normalize section counts. Students can reuse this
 * helper when implementing their own versions.
 */

/**
 * Solution to Problem 3
 * @param {Array|Object} subjects - parsed subjects data
 * @returns {{departments:number,courses:number,sections:number}}
 */
function getDepartmentCourseSummary(subjects) {
  if (!subjects || !Array.isArray(subjects)) return { departments: 0, courses: 0, sections: 0 };

  let departments = 0;
  let courses = 0;
  let sections = 0;

  for (const dept of subjects) {
    if (!dept || typeof dept !== 'object') continue;
    departments += 1;
    for (const key of Object.keys(dept)) {
      if (typeof key !== 'string') continue;
      if (!key.toLowerCase().startsWith('course_')) continue;
      courses += 1;
      const courseObj = dept[key];
      sections += countSectionsForCourse(courseObj);
    }
  }

  return { departments, courses, sections };
}

/**
 * Count sections for a single course object. Handles both array and numeric forms.
 * @param {Object|Array|number|null} courseObj
 * @returns {number}
 */
function countSectionsForCourse(courseObj) {
  if (!courseObj) return 0;
  if (Array.isArray(courseObj.sections)) return courseObj.sections.length;
  if (typeof courseObj.sections === 'number') return courseObj.sections;
  return 0;
}

module.exports = { solve: getDepartmentCourseSummary };