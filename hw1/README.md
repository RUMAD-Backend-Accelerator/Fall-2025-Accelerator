
# Homework 1 — RUMAD Fall 2025 Backend Accelerator (Student Instructions)

## Overview

Welcome! This homework exercises working with JSON data, arrays, objects, and basic control flow in Node.js.

## Dataset

Data: `subjects.json` is provided in this folder and contains the course catalog students will query.

- This is a cleaned and restructured version of the Rutgers Schedule of Classes (SOC) API that Ayush Mishra (`am3606`) authored in January 2024, so it is outdated.
- To view the current SOC API for Rutgers undergraduate CS students (`01:198:###`), click [here](http://sis.rutgers.edu/oldsoc/courses.json?subject=198&semester=92025&campus=NB&level=UG).

***First and foremost, edit*** `env.student` ***to input your NetID as instructed.***

## Code structure you will use

- `boilerplate/` — student code. **Rename this directory to your NetID (e.g., `am3606`).**  <br> Implement solutions only inside files in this directory. ***Choose AT LEAST ONE out of the three problems to implement!*** You may implement more than one problem if you'd like (which I'd certainly like).
  - `boilerplate/loadSubjects.js` — helper to load the JSON file (`data/subjects.json`).
  - `boilerplate/problem1.js` — implement Problem 1 (Hard).
  - `boilerplate/problem2.js` — implement Problem 2 (Medium).
  - `boilerplate/problem3.js` — implement Problem 3 (Easy).

- `test-problems.js` — test runner you can run locally to exercise your functions.

- `test-cases.json` - test cases for each problem, accessed by `test-problems.js`. You may add your own test cases if you'd like.

## How to run locally

1. From this folder, run the test runner:

```bash
node test-problems.js
```

2. Edit the driver functions inside `boilerplate/*.js`. Re-run the test runner to see your results.

## Submission instructions (before you submit)

1. Rename the `boilerplate/` folder to your Rutgers NetID (e.g., `am3606`).
    - This ensures that your submission files are unique.
    - Keep the filenames and function signatures unchanged.
2. Create your own branch on the `Fall-2025-Accelerator` public repository. **Title it with your NetID (e.g., `am3606`).**
    - This is the branch you will be working out of throughout the program, and this is how us mentors will be able to track your code.
3. Push and commit your code to this branch. You may do this as many times as you'd like. However, please try to commit finalized `hw1` code by the due date.
4. Create a brief 1-2 minute video and upload it to your corresponding [Homework Submissions](https://drive.google.com/drive/u/0/folders/1shVbG3sL9JhPor5jlGIT2TucEdbHgHdw) folder on Google Drive.
5. Upload this video to the Padlet for this homework assignment, along with a tiny blurb if you'd like to mention which Problem(s) you chose!

## Need help?

Ask on Discord. You can send a public message in the `#be-general` channel, or send a private DM to Ayush Mishra (`ayushmish`), Liam Ta (`liamhasmail`), and/or Hiya Mavani (`shinaaa`).

## Due date

Homework is due **Sunday, October 12 at 11:59 PM**.

Good luck!
