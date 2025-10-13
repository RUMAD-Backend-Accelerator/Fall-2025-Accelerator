/**
 * Problem 2 (Medium): Count incomplete tasks by priority
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
 *
 * Hints:
 * - `req` is an object in the format `{ "caseIndex": number }`, where
 *   number is the index of the correct array of tasks from `taskCases`
 * - `taskCases` is an array of task lists. Each task list is itself an array of task objects.
 * - Use: `const countTaskPriority = (req, res) => { ... }`
 * - Although you will implement the `res` parameter in the function signature,
 *   you do NOT need to use it in the function body. In a real Express app, you
 *   would use `res.send({ data: ... })`, but here you just return the object.
 * - For filtering tasks, you can use the built-in `filter` method for arrays.
 *   Ex: array.filter((i) => i < 5) returns a new array with elements less than 5.
 * - If a provided caseIndex is out of bounds (invalid), return an empty object: {}
 */

const taskCases = require('../data/tasks-cases.json'); // imports taskCases array

/* Write your function here */
const countTaskPriority = (req, res) => {
  // TODO: implement this function
  const taskCase = taskCases[req.caseIndex];

  if (!taskCase || !taskCase.tasks) return {};

  const incompleteTasks = taskCase.tasks.filter(task => !task.completed);

  const counts = {};
  incompleteTasks.forEach(task => {
    counts[task.priority] = (counts[task.priority] || 0) + 1;
  });
  return counts;
};

// Wrapper function for shared test runner compatibility
const solve = (taskCases, input) => countTaskPriority(input, null);

module.exports = { solve };
