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

  if (!Array.isArray(subjects) || subjects.length == 0) {
    return {departments: 0, courses: 0, sections: 0 };
    // Checks if subjects is empty if it is it'll return 0 for everything.
  }

  const departments = subjects.length;
  // See how many departments there are by checking the subjects array
  let courses = 0;
  let sections = 0;
  // Were setting the total here to 0 so we can increment it later everytime we find a new one
  subjects.forEach((department) => {
    const courseKeys = Object.keys(department).filter((key) =>
      key.startsWith("course_")
  );
  //Find out every single key that starts with course_ so then we could add how many
  //courses a department has
  courses += coursekeys.length;
  //now we'll add the total sections for each course
  coursekeys.forEach((key) => {
    const courseObj = department[key];
    sections += countSectionsForCourse(courseObj);
  });
});

//return all the totals for an object
return {departments, courses, sections };
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
  if (!courseObj) return 0;
  // if theres none 0 is returned
  if (Array.isArray(courseObj.sections)){
    return courseObj.sections.length;
  }
  // If its an array then how many items are in it is how many sections there are
  // And below if its just a number what number is it?
  if (typeof courseObj.sections == "number") {
    return courseObj.sections;
  }
  // if sections isn't properly formatted or not there return 0.
  return 0
}

module.exports = { solve: getDepartmentCourseSummary};