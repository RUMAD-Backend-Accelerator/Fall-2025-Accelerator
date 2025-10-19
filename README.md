# RUMAD Fall 2025 Backend Accelerator

## This repository is where you'll complete and submit the code for your homework assignments.
Each mentee will work on their own branch — this keeps your work organized and allows mentors to review your code privately.
Below is a guide on how to make your own private branch and upload your submissions.

## 1. Clone the repository

```bash
git clone https://github.com/RUMAD-Backend-Accelerator/Fall-2025-Accelerator.git
cd Fall-2025-Accelerator
```

## 2. Create a new branch for your work
Use your name so we can identify you easily:
```bash
git checkout -b yourname/homework
```
Example:
```bash
git checkout -b Hiya/homework
```

## 3. Work locally on your assignment
* Edit or add files as instructed.
* You can commit as often as you like:
```bash
git add .
git commit -m "Finished problem 1"
```

## 4. Test your homework locally (optional)

You can test your homework solutions locally before submitting:

```bash
# Using npm script (recommended)
npm run check-hw -- hw1

# Test a specific problem
npm run check-hw -- hw1 p2

# Test with custom folder
npm run check-hw -- hw1 my-solutions

# Or use node directly
node test-problems.js hw1
node test-problems.js hw1 p2
```

**Requirements:**
- Node.js installed (version 18 or higher)
<<<<<<< HEAD
- Run `npm install` first (one-time setup)
=======
>>>>>>> 1dddaec (Add test runner and update README with testing instructions)
- Run commands from the repository root directory

The test runner will show you which test cases pass or fail, helping you verify your solutions before submission.

## 5. Push your branch to GitHub
This publishes your branch so instructors can review it.

* The first time you create your branch and publish it:
```bash
git push -u origin yourname/homework
```
* Every time after, you can just do this while on your branch:
```bash
git push
```

## 6. Do not push directly to the main branch
* Your work should only live on your personal branch.
* The main branch is reserved for starter code and instructor updates.

## Pulling Updates

When instructors release new homework or solutions, update your branch:

```bash
# Make sure all your work is committed
git add .
git commit -m "Save my progress"

# Pull the latest updates from main
git pull origin main

# If there are conflicts, resolve them and commit
```
