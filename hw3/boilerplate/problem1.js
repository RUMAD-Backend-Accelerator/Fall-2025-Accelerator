/**
 * Objective:
 * Build an API for a student task manager including GET/POST routes for:
 *    1. Getting all tasks for a CaseId sorted by due date.
 *    2. Getting a task by taskId.
 *    3. Getting <high, medium, low> priority tasks for a CaseId.
 *    4. Marking a task as complete.
 *    5. Creating a new task.
 * 
 * Directions:
 * - Implement 5 API Routes:
 *    1. Send all tasks in json format given a caseID.
 *        - Within this endpoint, you will also include checks for whether query strings are passed in.
 *        - For example: 
 *            - If a client accesses /api/3/tasks return all tasks for caseId = 3
 *            - If a client accesses /api/3/tasks?sort=duedate, return all tasks for caseId = 3 sorted by due date
 *            - If a client accesses /api/3/tasks?priority=high, return all tasks for caseId = 3 with priority high
 *    2. Send a single task in json format given a caseID and taskID. Utilize query parameters for taskID.
 *    3. Update a task as complete.
 *        - To update, just update the tasks from taskCases = require(...) e.g. taskCases[caseId][taskId]["completed"] = true
 *    4. Return the created object based on the user's create task request.
 *    
 *    NOTE: You will be given the exact path we will call in the test cases. Pay attention to how parameters are used in the paths.
 *
 * Hints:
 * - Use app.get("/", (req, res)=> {}), app.post("/", (req, res) => {}) to define your API endpoints.
 * - Functions for getting tasks by taskCaseID, getting task by ID, getting tasks by priority, and sorting tasks by due date 
 * will be provided in case you didn't get to them in HW2.
 * - For specifying query parameters, use "/tasks/:id"
 * - For updating completion of a task, you can use a POST.
 * - Use res.send() to send objects to the client.
 * - Use res.status(<number>).send(<err_msg>) for error handling.
 * - A dictionary of error messages are provided for the above.
 * - Use req.body to obtain data sent by a client's POST request.
 */

const taskCases = require('../data/tasks-cases.json');

//Instantiate your express server.
const express = require('express')
const app = express()
const port = 3000

//As of express 5.1, express.json() is a built-in body-parser to get body data from POST requests
app.use(express.json())

//You can use these for error handling so your response matches test cases.
const errorMsg = {
  invalidCaseId: "Invalid param: caseId is not a number.",
  invalidTaskId: "Invalid param: taskId is not a number.",
  invalidPriority: "Priority is not High, Low, or Medium.",
  couldNotParseTask: "Could not parse task.",
  taskCaseNotFound: "Could not find taskCase at given caseId."
};

//Below are some drivers to help you out.

//GIVEN: Gets all tasks given a caseId.
const getAllTasks = (caseId) => {
 
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
  return correctTaskCase;

};

//GIVEN: Gets task by caseId and taskId
const getTaskByTaskId = (caseId, taskId) => {
  const correctTaskCase = getAllTasks(caseId);
  
  if(correctTaskCase === null) {
    return null
  }
  
  const tasks = correctTaskCase["tasks"]

  let res = null
  for (const task of tasks) {
    if (task.id == taskId) {
      res = task
      break
    }
  }
  return res
}

//GIVEN: Sorts tasks by due date given a caseId
const sortTasksByDueDate = (caseId) => {
  // extracts desired task case index and list of tasks
  let taskList = getAllTasks(caseId)
  
  if(!taskList) {
    return []
  }

  taskList = taskList.tasks

  //copy of taskList so we don't change the original taskList
  taskList = [...taskList]

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
  return taskList;
};

//GIVEN: Gets tasks filtered by priority
const getTasksByPriority = (caseId, priority) => {
  // Get taskCase using driver function
  const correctTaskCase = getAllTasks(caseId);
  if(!correctTaskCase) { 
    return null
  }

  const tasks = correctTaskCase["tasks"]

  const filtered_tasks = tasks.filter((task) => task.priority === priority)

  return filtered_tasks
}

//TO DO: Get all tasks, Get all tasks sorted, Get all tasks by priority
// Endpoint examples
/*
 1. "/api/1/tasks" gets all tasks with caseId 1
 2. "/api/1/tasks?sort=duedate" gets all tasks with caseId 1 sorted by due date
 3. "/api/1/tasks?priority=high" gets all tasks with caseId 1 that have priority high
*/

app.get("/api/:caseId/tasks", (req, res) => {

  const caseId = parseInt(req.params.caseId);
  
  if (isNaN(caseId)) {
    return res.status(400).send({ error: errorMsg.invalidCaseId });
  }

  const taskCase = getAllTasks(caseId);
  if (!taskCase) {
    return res.status(404).send({ error: errorMsg.taskCaseNotFound });
  }

  let tasks = taskCase.tasks;

  // Handle optional filtering by priority
  if (req.query.priority) {
    const priority = req.query.priority.toLowerCase();
    const validPriorities = ['high', 'medium', 'low'];
    
    if (!validPriorities.includes(priority)) {
      return res.status(400).send({ error: errorMsg.invalidPriority });
    }
    
    const formattedPriority = priority.charAt(0).toUpperCase() + priority.slice(1);
    tasks = getTasksByPriority(caseId, formattedPriority);
  }

  if (req.query.sort === 'duedate') {
    tasks = sortTasksByDueDate(caseId);
  }

  res.send({ "data": tasks })
})

//TO DO: Get individual task by caseId and taskId
// GET /api/:caseId/tasks/:taskId
// Returns a single task

app.get("/api/:caseId/tasks/:taskId", (req, res) => {

  const caseId = parseInt(req.params.caseId);
  const taskId = parseInt(req.params.taskId);
  
  if (isNaN(caseId)) {
    return res.status(400).send({ error: errorMsg.invalidCaseId });
  }
  
  if (isNaN(taskId)) {
    return res.status(400).send({ error: errorMsg.invalidTaskId });
  }

  const task = getTaskByTaskId(caseId, taskId);
  
  if (!task) {
    return res.status(404).send({ error: "Task not found" });
  }

  res.send({ "data": task })
})

//TO DO: Create a new task based on task JSON sent by client.
// POST /api/:caseId/tasks
// Adds a new task to the specified case

app.post("/api/:caseId/tasks", (req, res) => {

  const caseId = parseInt(req.params.caseId);
  
  if (isNaN(caseId)) {
    return res.status(400).send({ error: errorMsg.invalidCaseId });
  }

  // Retrieve task information from req body
  const newTask = req.body;
  
  if (!newTask) {
    return res.status(400).send({ error: errorMsg.couldNotParseTask });
  }

  const taskCase = getAllTasks(caseId);
  if (!taskCase) {
    return res.status(404).send({ error: errorMsg.taskCaseNotFound });
  }

  taskCase.tasks.push(newTask);

  res.send({
    data: {
      caseId: caseId,
      task: newTask,
    },
  })
})

// TODO: Mark given task as complete
// POST /api/:caseId/tasks/:taskId/complete
// Marks a specific task as completed
app.post("/api/:caseId/tasks/:taskId/complete", (req, res) => {
  
  const caseId = parseInt(req.params.caseId);
  const taskId = parseInt(req.params.taskId);
  
  if (isNaN(caseId)) {
    return res.status(400).send({ error: errorMsg.invalidCaseId });
  }
  
  if (isNaN(taskId)) {
    return res.status(400).send({ error: errorMsg.invalidTaskId });
  }

  // Use getTaskByTaskId to locate the task
  const task = getTaskByTaskId(caseId, taskId);
  
  if (!task) {
    return res.status(404).send({ error: "Task not found" });
  }

  task.completed = true;

  res.send({
    data: {
      caseId: caseId,
      task: task,
    },
  })
})

//start up express app
if (require.main === module) {
  const server = app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`)
  })
  return server  
}

module.exports = app;