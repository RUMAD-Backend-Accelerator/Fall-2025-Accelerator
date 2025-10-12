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
const { loadSubjects } = require("./loadSubjects");
subjects = loadSubjects();
getDepartmentCourseSummary(subjects);
function getDepartmentCourseSummary(subjects) {
  // TODO: implement this function.
  // HINTS:
  //  - `subjects` is an array of department objects.
  //  - Count departments by iterating the top-level array.
  //  - Count courses by finding keys named like `course_*` within each dept.
  //  - Use `countSectionsForCourse(courseObj)` to normalize section counts.
  //  - Return an object: { departments, courses, sections }.
  let count =0;
  let cs =0;
  for(let i =0;i<subjects.length;i++){
    Object.keys(subjects[i]).forEach(trait =>{
      if(trait.startsWith('course_')){
        count +=1;
        cs += countSectionsForCourse(subjects[i][trait]);
      }
    })
  }
    let dept = {
      department: subjects.length,
      courses:count,
      sections:cs
    }
    return dept;
     throw new Error('Not implemented');
}
/**
 * 
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
   if(typeof (courseObj.sections)== typeof []){
    return (courseObj.sections.length);
   }else if (typeof (courseObj.sections)== typeof 6){
    return courseObj.sections;
   }
   return 0;
  throw new Error('Not implemented');
}

module.exports = { solve: getDepartmentCourseSummary };