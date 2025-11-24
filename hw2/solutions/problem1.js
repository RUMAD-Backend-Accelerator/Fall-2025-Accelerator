/**
 * Solution to Problem 1 (Easy): Get a task case object from an array
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
 */

const taskCases = require('../data/tasks-cases.json'); // imports taskCases array

const getAllTasks = (req, res) => {
  // extracts correct caseId from req object
  const caseId = req.caseId;

  // creates variable for the desired task case
  let correctTaskCase = null;

  // iterates through taskCases array
  for (const taskCase of taskCases) {
    // if the current task case has the desired case ID,
    // sets current task case as the correct one
    if (caseId === taskCase.case_id) {
        correctTaskCase = taskCase;
        break;
    }
  }

  // returns the data in json format
  // would be replaced with `res.send({ data: correctTaskCase })` in real scenario
  return { data: correctTaskCase };
};

// Wrapper function for shared test runner compatibility
const solve = (taskCases, input) => getAllTasks(input, null);

module.exports = { solve };