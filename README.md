# RUMAD-Fall-2025-Accelerator

## This repository is where you’ll complete and submit the code for your homework assignments.
Each mentee will work on their own branch — this keeps your work organized and allows mentors to review your code privately.
Below is a guide on how to make your own private branch and upload your submissions.

## 1. Clone the repository

```
git clone https://github.com/RUMAD-Backend-Accelerator/Fall-2025-Accelerator.git
cd <repo-name>
```
## 2. Create a new branch for your work
Use your name so we can identify you easily:
```
git checkout -b yourname/homework
```
Example:
```
git checkout -b Hiya/homework
```

# 3. Work locally on your assignment
* Edit or add files as instructed.
* You can commit as often as you like:
```
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
- Run `npm install` first (one-time setup)
- Run commands from the repository root directory

The test runner will show you which test cases pass or fail, helping you verify your solutions before submission.

## 5. Push your branch to GitHub
This publishes your branch so instructors can review it.

* The first time you create your branch and publish it:
```
git push -u origin hw1-yourname
```
* Every time after, you can just do this while on your branch:
```
git push
```

## 5. Do not push directly to the main branch
* Your work should only live on your personal branch.
* The main branch is reserved for starter code and instructor updates.
