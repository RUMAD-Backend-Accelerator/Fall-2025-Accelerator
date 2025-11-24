/**
 * Solution to Problem 3 (Hard): Sort tasks by due date
 *
 * Objective:
 * Retrieve the `tasks` array from the desired task case object from 'tasks-cases.json'
 * and return the `tasks` array sorted by due date in ascending order
 * (from earliest date to latest date)
 *
 * Directions:
 * - Implement a function named `sortTasksByDueDate` using a const arrow function
 *   with parameters `req` and `res`.
 * - The function should:
 *    1. Use `req.taskCaseIndex` to select the desired task case object from `taskCases`.
 *       (Note: Unlike problem 1, taskCaseIndex does not give the caseId of the desired task.
 *        Instead, it gives you the index of the correct task case object in the task cases array)
 *    2. Return an object in the format: `{ data: taskList }`, where `taskList`
 *       is the sorted array of task objects
 */

const taskCases = require('../data/tasks-cases.json'); // imports taskCases array

const sortTasksByDueDate = (req, res) => {
  // extracts desired task case index and list of tasks
  const taskCaseIndex = req.taskCaseIndex;
  let taskList = taskCases[taskCaseIndex].tasks;

  // selection sort algorithm
  // iterates through each element from 0 to length - 1, call it task i
  for (let i = 0; i < taskList.length - 1; i++) {
    // sets task i as the one with the earliest due date
    let minIndex = i;
    // transforms task i's due date into a comparable date object
    let comparableDateMin = new Date(taskList[minIndex].due_date);

    // iterates through each task after the current task, call it task j
    for (let j = i + 1; j < taskList.length; j++) {
      // transforms task j's due date into a comparable date object
      const comparableDateJ = new Date(taskList[j].due_date);

      // if task j's due date is less than the current earliest date,
      // sets the earliest due date as task j's and updates the index accordingly
      if (comparableDateJ < comparableDateMin) {
        comparableDateMin = comparableDateJ;
        minIndex = j;
      }
    }

    // swaps task i and the task with the earliest due date following i
    let temp = taskList[i];
    taskList[i] = taskList[minIndex];
    taskList[minIndex] = temp;
  }

  // returns the data in json format
  // would be replaced with `res.send({ data: taskList })` in real scenario
  return { data: taskList };
};

// Wrapper function for shared test runner compatibility
const solve = (taskCases, input) => sortTasksByDueDate(input, null);

module.exports = { solve };
