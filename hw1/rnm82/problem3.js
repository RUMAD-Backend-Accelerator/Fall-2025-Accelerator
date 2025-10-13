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
 * A helper function `countSectionsForCourse(courseObj)` is provided which
 * handles both array and numeric representations of sections; this helper
 * lets students focus on counting departments and course entries.
 */

/**
 * Solve Problem 3
 * @param {Array|Object} subjects - parsed subjects data
 * @returns {{departments:number,courses:number,sections:number}}
 */
function getDepartmentCourseSummary(subjects) {
  // TODO: implement this function.
  // HINTS:
  //  - `subjects` is an array of department objects.
  //  - Count departments by iterating the top-level array.
  //  - Count courses by finding keys named like `course_*` within each dept.
  //  - Use `countSectionsForCourse(courseObj)` to normalize section counts.
  //  - Return an object: { departments, courses, sections }.
  let departments = subjects.length
  let courses = 0
  let sections = 0

  for(let i = 0; i < departments; i++){
    let dept = subjects[i]
  
  for (let course in dept) {
    if(course.startsWith("course_"))
    courses++
    sections += countSectionsForCourse(course)
  }
}
return { departments, courses, sections };
  throw new Error('Not implemented');
}

/**
 * Helper: counts sections for a course object
 * Students: implement and call this helper if desired.
 *
 * @param {Object|Array|number|null} courseObj
 * @returns {number}
 */
function countSectionsForCourse(courseObj) {
  // TODO: implement this function.
  // HINTS:
  //  - If `courseObj.sections` is an array, return its `length`.
  //  - If `courseObj.sections` is a number, return that number.
  //  - Otherwise return 0.
  const s = courseObj.sections;

  if (Array.isArray(s)) return s.length;
  if (typeof s === 'number') return s;
  return 0;
  throw new Error('Not implemented');
}

module.exports = { solve: getDepartmentCourseSummary };