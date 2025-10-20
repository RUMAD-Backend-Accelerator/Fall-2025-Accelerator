
# Homework 2 — RUMAD Fall 2025 Backend Accelerator (Student Instructions)

## Overview

Welcome! This homework exercises working with arrow controller functions, JSON data, and Express formatting in Node.js, all of which serve as fundamentals for backend development.

## Dataset

Data: `task-cases.json` is provided in this folder. It is an array of task case objects. Each of these objects represents a unique person's to-do list. Each task case object contains a `case_id` and a `tasks` array. Students will handle and manipulate this data through controller functions.

***First and foremost, edit*** `env.student` ***to input your NetID as instructed.***

## Code structure you will use

- `boilerplate/` — student code. **Rename this directory to your NetID (e.g., `am3606`).**  <br> **You may also have to replace all instances of `boilerplate` in the `test-problems.js` file to your NetID** <br> Implement solutions only inside files in this directory. ***Choose AT LEAST ONE out of the three problems to implement!*** You may implement more than one problem if you'd like (which I'd certainly like).
  - `boilerplate/loadSubjects.js` — helper to load the JSON file (`data/subjects.json`).
  - `boilerplate/problem1.js` — implement Problem 1 (Easy).
  - `boilerplate/problem2.js` — implement Problem 2 (Medium).
  - `boilerplate/problem3.js` — implement Problem 3 (Hard).

- `test-problems.js` — test runner you can run locally to exercise your functions.

- `test-cases.json` - test cases for each problem, accessed by `test-problems.js`. You may add your own test cases if you'd like.

## How to run locally

1. From this folder, run the test runner:

```bash
node test-problems.js
```

2. Edit the driver functions inside `boilerplate/*.js`. Re-run the test runner to see your results.

## Submission instructions (before you submit)

1. Rename the `boilerplate/` folder to your Rutgers NetID (e.g., `am3606`) and in `.env.student`, set PREFERRED_FOLDER to the name
of your renamed  `boilerplate/` folder (e.g. `PREFFERED_FOLDER="am3606"`). 
    - This ensures that your submission files are unique.
    - Keep the filenames and function signatures unchanged.
    - Enables you to run `test-problems.js` to check your solution.
2. Create your own branch on the `Fall-2025-Accelerator` public repository. **Title it with your NetID (e.g., `am3606`).**
    - This is the branch you will be working out of throughout the program, and this is how us mentors will be able to track your code.
    - If you already did this for homework 1, you should keep working on that branch.
3. Push and commit your code to this branch. You may do this as many times as you'd like. However, please try to commit finalized `hw2` code by the due date.
4. Create a _brief_ 1-2 minute video and upload it to your corresponding [Homework Submissions](https://drive.google.com/drive/u/0/folders/1shVbG3sL9JhPor5jlGIT2TucEdbHgHdw) folder on Google Drive (you don't need to upload on Padlet anymore, just Google Drive).

## Need help?

Ask on Discord. You can send a public message in the `#be-general` channel, or send a private DM to Ayush Mishra (`ayushmish`), Liam Ta (`liamhasmail`), and/or Hiya Mavani (`shinaaa`).

## Due date

Homework is due **Sunday, October 19 at 11:59 PM**.

Good luck!