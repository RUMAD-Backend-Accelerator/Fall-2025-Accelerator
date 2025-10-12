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

const { loadSubjects } = require("./loadSubjects");

/**
 * Solve Problem 1
 * @param {Array|Object} subjects - parsed subjects data from subjects.json
 * @returns {Array<Object>} array of objects: { course: string, credits: number|null, sections: number }
 */
subjects = loadSubjects();
getTopTenCoursesByCredits(subjects)
function getTopTenCoursesByCredits(subjects) {
  // TODO: implement this function.
  // HINTS:
  //  - Iterate through `subjects` (an array of department objects).
  //  - For each department, examine keys named like `course_*`.
  //  - For each course, extract `title` (or name), `credits`, and `sections`.
  //  - Sections may be an array or a number; normalize to a count.
  //  - Build an array of { course, credits, sections } and sort with
  //    `sortCoursesByCredits(courses)` before returning the top 10.
 console.log("yo");
 let num;
 let track;
 let h =1;

//let courses = []
//courses.push(course);
//courses[0].credits = subjects[0]['course_161'].credits;
//console.log(courses);
let index =0;
console.log(subjects[1]);
let courses = [];
for(let i =0;i<subjects.length;i++){
  let j =1;
  while(j<=800){
   let str = "00";
   if(j<10){
   str = "00" + j;
   }else if (j>=10 && j<=99){
    str = "0"+j;
   }else{
     str = ""+ j;
   }
   if(subjects[i]['course_'+str ]!= undefined){
     let course={
      title: "",
      credits: 0,
      sections: 0
     }
     courses.push(course);
     courses[index].title = subjects[i]['course_'+str ].title;
     courses[index].sections = subjects[i]['course_'+str ].sections.length;
     courses[index].credits = subjects[i]['course_'+str ].credits;
     index +=1;
  }
    j++;
 }
 }
 courses = sortCoursesByCredits(courses);
 courses = courses.splice(0,11);
 console.log(courses);
}


/**
 * Helper: sorts courses by credits, and then by sections
 * @param {Array|Object} courses - course objects structured like the following:
 *  { course: 'INTRO COMPUTER SCI', credits: 4, sections: 41 }
 * @returns {Array<Object>} sorted array of course objects
 */
function sortCoursesByCredits(courses) {
  return courses.sort((c1, c2) => {
    // ... always check for null values to be safe
    const a = c1.credits == null ? Number.NEGATIVE_INFINITY : c1.credits;
    const b = c2.credits == null ? Number.NEGATIVE_INFINITY : c2.credits;
    if (a != b) return b - a;  //credits descending
    // ... below this point, credits are equal, so sort by sections
    return (c2.sections || 0) - (c1.sections || 0); // sections descending
  });
}

module.exports = { solve: getTopTenCoursesByCredits };
