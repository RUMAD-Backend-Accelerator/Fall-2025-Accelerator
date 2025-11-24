// Instructor solution placeholder

const express = require('express')
const app = express()
const port = 3000

//As of express 5.1, built-in body-parser to get body data from POST requests
app.use(express.json())

//import taskCases from tasks-cases.json
let taskCases = require('../data/tasks-cases.json');

//Gets all tasks given a caseId.
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

//Gets task by caseId and taskId
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

  // returns the data in json format
  // would be replaced with `res.send({ data: taskList })` in real scenario
  return taskList;
};

const getTasksByPriority = (caseId, priority) => {
  const correctTaskCase = getAllTasks(caseId);
  if(!correctTaskCase) { 
    return null
  }

  const tasks = correctTaskCase["tasks"]
  const filtered_tasks = tasks.filter((task) => task.priority === priority)

  return filtered_tasks
}

app.get("/", (req, res) => {
    res.send("Hello, world!")
})

app.get("/api/:caseId/tasks", (req, res)=> {
  let caseId = Number(req.params.caseId)
  if (isNaN(caseId)) {
    return res.status(400).send({data: "Invalid param: caseId is not a number."})
  }

  let tasks = getAllTasks(caseId)
  if(!tasks) {
    res.status(404).send({data: "Could not find taskCase at given caseId."})
  }

  //Optional filtering
  const priority = req.query.priority
  if(priority) {
    const priorities = new Set(["high", "medium", "low"])
    if (!priorities.has(priority)) {
      return res.status(400).send({data: "Priority is not High, Low, or Medium."})
    }
    tasks = getTasksByPriority(caseId, priority)
  }

  const sort = req.query.sort
  if(sort) {
    if(sort === "duedate") {
      tasks = sortTasksByDueDate(caseId)
    }
  }

  res.send({"data": tasks})
})

app.get("/api/:caseId/tasks/:taskId", (req, res) => {
  // Get query parameters and validate caseId and taskId from parameters
  let caseId = Number(req.params.caseId)
  let taskId = Number(req.params.taskId)

  if (isNaN(caseId)) {
    return res.status(400).send({data: "Invalid param: caseId is not a number."})
  }
  if (isNaN(taskId)) {
    return res.status(400).send({data: "Invalid param: taskId is not a number."})
  }
  
  //Call getTaskByTaskId driver to get task
  const task = getTaskByTaskId(caseId, taskId)

  if(!task) {
    res.status(404).send({data: "Could not find task at given caseId or taskId."})
  }
  
  res.send({"data": task})
})

app.post("/api/:caseId/tasks", (req, res) => {
  const newTask = req.body
  // For simplicity, the id given won't be a duplicate of any existing task ids
  // and we assume that the newTask is completely valid and contains all necessary properties

  if(!newTask) {
    return res.status(400).send({data: "Could not parse task."})
  }

  let caseId = Number(req.params.caseId)
  if (isNaN(caseId)) {
    return res.status(400).send({data: "Invalid param: caseId is not a number."})
  }

  const taskCase = getAllTasks(caseId)

  if(!taskCase) {
    return res.status(404).send({data: "Could not find taskCase at given caseId."})
  }

  taskCase["tasks"].push()

  result = {
    "data": {
      "caseId": caseId,
      "task": newTask
    }
  }

  res.send(result)

})


app.post("/api/:caseId/tasks/:taskId/complete", (req, res) => {

  let caseId = Number(req.params.caseId)
  let taskId = Number(req.params.taskId)

  if (isNaN(caseId)) {
    return res.status(400).send({data: "Invalid param: caseId is not a number."})
  }
  if (isNaN(taskId)) {
    return res.status(400).send({data: "Invalid param: taskId is not a number."})
  }
  
  //Call getTaskByTaskId driver to get task
  const task = getTaskByTaskId(caseId, taskId)

  if(!task) {
    res.status(404).send({data: "Could not find task at given caseId or taskId."})
  }

  //update task
  task["completed"] = true

  result = {
    "data": {
      "caseId": caseId,
      "task": task
    }
  }

  res.send(result)
})

if (require.main === module) {
  const server = app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`)
  })
  return server  
}

module.exports = app;
