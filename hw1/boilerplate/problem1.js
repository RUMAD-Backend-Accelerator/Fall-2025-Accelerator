/**
 * Problem 1 boilerplate
 *
 * Task: Given the subjects data, produce a list of courses with their credit value
 * and the number of sections they have. Then sort the courses by number of sections
 * (descending). The intended output is a simple array of objects like:
 *
 * [ { course: 'INTRO COMPUTER SCI', credits: 4, sections: 41 }, ... ]
 *
 * Students should implement the `solve(subjects)` function below. Keep the function
 * pure (no console.log side effects) so tests can call it.
 */

/**
 * Solve Problem 1
 * @param {Array|Object} subjects - parsed subjects data from subjects.json
 * @returns {Array<Object>} array of objects: { course: string, credits: number|null, sections: number }
 *
 * Students: implement this function. Keep it pure (no console output) so tests can call it.
 */
function solve(subjects) {
  // TODO: implement the solution here.
  // Example steps for students:
  // 1. iterate through the subjects (it's an array of department objects)
  // 2. for each department, iterate its course_* properties
  // 3. for each course, extract title, credits, and number of sections
  // 4. build and return an array sorted by sections (descending)
  throw new Error('Not implemented');
}

module.exports = { solve };
