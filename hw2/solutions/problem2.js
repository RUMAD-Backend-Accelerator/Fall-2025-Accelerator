/**
 * Solution to Problem 2 (Medium): Count incomplete tasks by priority
 *
 * Objective:
 * Given a request object, retrieve the appropriate array of tasks
 * from 'tasks-cases.json.'
 * Then filter out the completed tasks so you are left with incomplete tasks,
 * and count the incomplete tasks by priority.
 * Return an object like {"High": 4, "Medium": 3, "Low": 2}
 *
 * Directions:
 * - Implement a function named `countTaskPriority` using a const arrow function with parameters `req` and `res`.
 * - The function should:
 *    1. Use `req.task_case_index` to select the correct array of tasks from `taskCases`.
 *    2. Filter out the completed tasks.
 *    2. Use the "priority" property in each task object to group tasks by priority.
 *    3. Return an object in the format: {"High": 4, "Medium": 3, "Low": 2}
 */

const taskCases = require('../data/tasks-cases.json'); // imports taskCases array

const countTaskPriority = (req, res) => {
  // The request is based on the data (1-indexed) so convert to 0-indexed
  const taskCaseIndex = req.caseId - 1;

  // check if out of bounds
  if (taskCaseIndex < 0 || taskCaseIndex >= taskCases.length) {
    console.log("invalid taskCaseIndex");
    return {};
  }

  // retrieve tasks by taskCaseIndex
  const tasks = taskCases[taskCaseIndex]["tasks"];

  // filter out tasks that are completed
  const filtered = tasks.filter((task) => task.completed == false);

  // initialize counts
  let counts = {
    "High": 0,
    "Medium": 0,
    "Low": 0
  };

  // Iterate through each task and update counts according to priority
  filtered.forEach(task => {
    if (task.priority === "High") {
      counts["High"] += 1;
    } else if (task.priority === "Medium") {
      counts["Medium"] += 1;
    } else if (task.priority === "Low") {
      counts["Low"] += 1;
    }
  });

  // return counts object
  return counts;
};

// Wrapper function for shared test runner compatibility
const solve = (taskCases, input) => countTaskPriority(input, null);

module.exports = { solve };
