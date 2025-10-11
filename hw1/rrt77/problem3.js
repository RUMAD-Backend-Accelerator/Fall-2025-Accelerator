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
  let depts = subjects.length 
  let courses = 0
  let sections = 0
  for (let i = 0; i < depts; i++)
  {
    let dept = subjects[i]

    for (let key in dept)
    {
      if (key.startsWith("course_"))
      {
        courses++
        sections += countSectionsForCourse(dept[key])
      }
    }



  }
  return { depts, courses, sections}
  // TODO: implement this function.
  // HINTS:
  //  - `subjects` is an array of department objects.
  //  - Count departments by iterating the top-level array.
  //  - Count courses by finding keys named like `course_*` within each dept.
  //  - Use `countSectionsForCourse(courseObj)` to normalize section counts.
  //  - Return an object: { departments, courses, sections }.
  throw new Error('Not implemented');
}

/**
 * Helper: counts sections for a course object
 * Students: implement and call this helper if desired.
 *
 * @param {Object|Array|number|null} courseObj
 * @returns {number}
 */
function countSectionsForCourse(courseObj) 
{
  if (Array.isArray(courseObj.sections))
  {
    return courseObj.sections.length
  }
  if (Array.isNumber(courseObj.sections))
  {
    return courseObj.sections
  }

  return 0
  // TODO: implement this function.
  // HINTS:
  //  - If `courseObj.sections` is an array, return its `length`.
  //  - If `courseObj.sections` is a number, return that number.
  //  - Otherwise return 0.
  throw new Error('Not implemented');
}

module.exports = { solve: getDepartmentCourseSummary };