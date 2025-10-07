# Homework 1 — RUMAD Fall 2025 Backend Accelerator (Student Instructions)

Welcome! This homework exercises working with JSON data, arrays, objects, and basic control flow in Node.js.

Data: `subjects.json` is provided in this folder and contains the course catalog students will query.

Structure you will use:

- `boilerplate/` — student code. Implement solutions only inside files in this directory.
  - `boilerplate/loadSubjects.js` — helper to load the JSON file.
  - `boilerplate/problem1.js` — implement `solve(subjects)` for Problem 1.
  - `boilerplate/problem2.js` — implement `solve(subjects, courseIdentifier)` for Problem 2 (optional/bonus).
  - `boilerplate/problem3.js` — implement `solve(subjects)` for Problem 3 (placeholder).

- `test-problems.js` — test runner you can run locally to exercise your functions.

How to run locally:

1. From this folder, run the test runner:

```bash
node test-problems.js
```

2. Edit the `solve(...)` functions inside `boilerplate/*.js`. Re-run the test runner to see your results.

Submission instructions (before you submit):

- Rename the `boilerplate/` folder to your Rutgers NetID (for example, `rjs123`). We will provide submission details later; for now rename so your files are uniquely identifiable.

# Homework 1 — Student Guide

This folder contains the starter code for Homework 1. The exercises work with the provided `subjects.json` dataset and ask you to implement small functions in Node.js.

What to edit
- `boilerplate/problem1.js` — implement `solve(subjects)`
- `boilerplate/problem2.js` — implement `solve(subjects, courseIdentifier)` (optional/bonus)
- `boilerplate/problem3.js` — implement `solve(subjects)` (optional)

Helpers
- `boilerplate/loadSubjects.js` — helper to load `subjects.json` for local testing.
- `test-problems.js` — test runner that runs data-driven test cases in `test-cases.json`.

Quick start
1. From this folder, run the test runner:

```bash
node test-problems.js
```

2. Edit the `solve(...)` functions inside `boilerplate/*.js` and re-run the test runner.

Submission (before you submit)
- Rename the `boilerplate/` folder to your Rutgers NetID (for example, `rjs123`) so your submission files are unique. Keep the filenames and function signatures unchanged.

Requirements
- Keep the `solve` function signatures exactly as provided. Functions should be pure and return values (no `console.log` side effects) so the test runner can call them.
- Handle missing or null fields in the input data gracefully.

Need help?
- Ask on Discord. You can send a message in the `\#be-general` channel, or send a Discord DM to Ayush, Liam, and/or Hiya.

Good luck!
