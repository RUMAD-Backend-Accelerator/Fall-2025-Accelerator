/**
 * Problem 3 (Hard): Sort tasks by due date
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
 *
 * Hints:
 * - An example of a sorting algorithm for this problem is selection sort, which
 *   will likely be the easiest for you to implement. Feel free to search up your
 *   desired algorithm on the internet.
 * - To compare due dates, you can use the built-in `Date` object in JavaScript.
 *   An example of creating a date object is: `let dateName = new Date(dateString)`
 *   where `dateString` is a string in the format "YYY-MM-DD" (same as the `due_date`
 *   format in each task object). You can now use comparison operators on `dateName`.
 * - `req` is an object in the format `{ "taskCaseIndex": number }`, where
 *   number is the index of the correct task case object from `taskCases`
 * - `taskCases` is an array of task lists. Each task list is itself an array of task objects.
 * - Example of function layout to use: `const sortTasksByDueDate = (req, res) => { ... }`
 * - Although you will implement the `res` parameter in the function signature,
 *   you do NOT need to use it in the function body. In a real Express app, you
 *   would use `res.send({ data: tasks })`, but here you just return the object.
 * - Example return value: `{ data: [ ... ] }`
 */

const taskCases = require('../data/tasks-cases.json'); // imports taskCases array

/* Write your function here */
const sortTasksByDueDate = (req, res) => {
  // TODO: implement this function
  let returnArray = new Array();
  for (let x of req.taskCaseIndex) {
    returnArray.push(x);
  }
  for (var i = 0; i < returnArray.length; i++) {
    let minIndex = i;
    for (var j = i+1; j < returnArray.length; j++) {
      let minDate = new Date(returnArray[minIndex].due_date);
      let potentialDate = new Date(returnArray[j].due_date);
      if (potentialDate < minDate) {
        minIndex = j;
      }
    }
    let temp = returnArray[i];
    returnArray[i] = returnArray[minIndex];
    returnArray[minIndex] = temp;
  }
  return { data: returnArray };
};

// Wrapper function for shared test runner compatibility
const solve = (taskCases, input) => sortTasksByDueDate(input, null);

module.exports = { solve };
