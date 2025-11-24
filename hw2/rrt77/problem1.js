/**
 * Problem 1 (Easy): Get a task case object from an array
 *
 * Objective:
 * Retrieve the desired task case object from 'tasks-cases.json'
 * and return a response object containing the correct task case object.
 *
 * Directions:
 * - Implement a function named `getTaskCase` using a const arrow function with parameters `req` and `res`.
 * - The function should:
 *    1. Use `req.caseId` to select the desired task case object from `taskCases`.
 *    2. Return an object in the format: `{ data: correctTaskCase }`, where `correctTaskCase`
 *       is an object
 *
 * Hints:
 * - `req` is an object in the format `{ "caseId": number }`, where
 *   number is the `case_id` of the correct task case object from `taskCases`
 * - `taskCases` is an array of task lists. Each task list is itself an array of task objects.
 * - Example of function layout to use: `const getTaskCase = (req, res) => { ... }`
 * - Although you will implement the `res` parameter in the function signature,
 *   you do NOT need to use it in the function body. In a real Express app, you
 *   would use `res.send({ data: tasks })`, but here you just return the object.
 * - Example return value: `{ data: {"case_id": 123, "tasks": [ ... ]} }`
 */

const taskCases = require('../data/tasks-cases.json'); // imports taskCases array

/* Write your function here */
const getAllTasks = (req, res) => {
  // TODO: implement this function
  for (let i = 0; i < taskCases.length; i++)
  {
    if (taskCases[i].case_id===req.case_id)
    {
      return {data: taskCases[i]};
    }
  }
  throw new Error('Not implemented');
};

// Wrapper function for shared test runner compatibility
const solve = (taskCases, input) => getAllTasks(input, null);

module.exports = { solve };