# Mentor guide — RUMAD Backend Accelerator (2025)

This concise README explains what mentors need to know to operate this workspace.
Focus: the npm scripts you will run and where to find/edit configuration.

**Windows users:** Install [Git for Windows](https://git-scm.com/download/win) to use these scripts. Git Bash (included) provides bash and rsync support. See [MENTOR_FAQ.md](MENTOR_FAQ.md) for details.

## Quick setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your local `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Run the interactive setup wizard:
   ```bash
   npm run setup
   ```
   This will help you select/clone the public repository, write configuration to `.env`, and optionally obtain a Google OAuth token for Drive sync.

**Alternative manual setup:**
- Instead of running `npm run setup`, you can manually edit `.env` to set `PUBLIC_REPO_PATH` and optionally fill in Google API credentials for Drive sync.
- The `.env` file is local-only and never committed.

## Important npm scripts
All scripts run from the repository root. Use `npm run <name> -- [args]` to pass arguments.

### Quick reference
```bash
# Setup and configuration
npm run setup                           # Initial workspace setup
npm run get-refresh-token               # Get Google OAuth token

# Homework lifecycle
npm run create-hw                       # Create new homework folder
npm run check-hw -- hw1                 # Test homework locally
npm run publish-hw -- hw1               # Publish homework (excludes solutions)
npm run publish-hw-solutions -- hw1     # Publish solutions (excludes boilerplate)
npm run unpublish-hw-solutions -- hw1   # Remove only solutions
npm run unpublish-hw -- hw1             # Remove entire homework

# Grading (⭐ recommended)
npm run retrieve-check-hw               # Complete grading workflow with multi-branch optimization
npm run retrieve-check-hw hw3           # Selective: retrieve only hw3, test all (uses cache)
npm run retrieve-check-hw hw1 hw2       # Retrieve hw1 and hw2, test all

# Manual grading workflow
npm run retrieve-submissions -- hw1     # Get student submissions
npm run check-hw -- hw1 hw1_submissions # Grade all submissions

# Resources
npm run sync-resources                  # Sync from Google Drive

# Repository sync
npm run sync-repo                       # Push shared repo files

# Documentation
npm run serve-docs                      # Launch markdown documentation viewer
```

### Detailed script documentation

- setup
  - `npm run setup`
  - Prompts to select a repo from `repos.json` (if present) and writes `SELECTED_REPO_ID`/`PUBLIC_REPO_PATH` into your local `.env`.

- get-refresh-token
  - `npm run get-refresh-token`
  - Walks you through obtaining a Google OAuth refresh token and writes `GOOGLE_REFRESH_TOKEN` to `.env`.
  - Note: `npm run setup` already offers the refresh-token step during bootstrap; run `npm run get-refresh-token` only if you need the token on its own.

- sync-resources
  - `npm run sync-resources`
  - Syncs PDFs and other resources from the shared Google Drive into the public repo `resources/` folder. The script will prompt you before downloading and before committing/pushing changes to the public repo.

- publish-hw
  - `npm run publish-hw -- hw1`
  - Publishes an entire `hwN` folder into the public repo (by default excludes `solutions`).
  - Example publish flow (safe default):

```bash
# publish hw1 without solutions
npm run publish-hw -- hw1
```

- publish-hw-solutions
  - `npm run publish-hw-solutions -- hw1`
  - Publishes solutions and updates all root-level files (README, test-cases.json, data files, etc.).
  - **Automatically excludes boilerplate directory** to protect student work.
  - Safe to use even after students have started working.
  - Example:

```bash
# publish solutions (boilerplate automatically protected)
npm run publish-hw-solutions -- hw1
```

- unpublish-hw
  - `npm run unpublish-hw -- hw1`
  - Removes an entire homework folder from the public repository.
  - Creates a commit and PR to track the removal.
  - Example:

```bash
# remove hw1 from public repo
npm run unpublish-hw -- hw1
```

- unpublish-hw-solutions
  - `npm run unpublish-hw-solutions -- hw1`
  - Removes only the `solutions` directory from a published homework.
  - Useful when solutions were accidentally published or need to be retracted.
  - Example:

```bash
# remove solutions from hw1 (keep homework structure)
npm run unpublish-hw-solutions -- hw1
```

- merge-pr
  - `npm run merge-pr`
  - Helper for merging automated PRs created by the commit helper. See `scripts/helpers/git_commit_and_pr.sh` for behavior.

- create-hw
  - `npm run create-hw`
  - Copies `hw_template/` into the selected public repo folder as the next `hw{i}` (e.g. `hw3`) and prints next steps. Requires `npm run setup` to have been completed so `.env` contains `PUBLIC_REPO_PATH` and `SELECTED_REPO_ID`.

  ### Creating Test Cases
  - Regular Test Cases (Non-API)
  - Testing Student API

- retrieve-submissions
  - `npm run retrieve-submissions -- hw1`
  - Retrieves student homework submissions from the public repository by cloning their branches and copying their code into a local submissions folder (e.g. `Fall-2025-Backend/hw1_submissions/`).
  - Reads student information from `Fall-2025-Backend/students.json` which contains student names, GitHub usernames, and assigned branches.
  - Automatically detects student folders when `.env.student` is missing by checking for standard folder names (`boilerplate` or `solutions`).
  - **Enhanced error messages** differentiate between:
    - "No hw3/ folder found in branch (homework not submitted)" — student hasn't created the homework folder
    - "No .env.student or problem files" — folder exists but missing required files
  - Generates a detailed Markdown log file (`retrieval.md`) with a table showing retrieval status, branch names, folders used, and categorized failure reasons.
  - Creates a `.env.student` file in the submissions folder with pipe-separated `PREFERRED_FOLDERS` list for use with `check-homework`.
  - **Note:** Usually not needed — use `retrieve-check-hw` instead for the complete workflow.
  - Example workflow:

```bash
# Retrieve all hw1 submissions from student branches
npm run retrieve-submissions -- hw1

# Review the log file
open Fall-2025-Backend/hw1_submissions/retrieval.md
```

- retrieve-check-hw
  - `npm run retrieve-check-hw [hw1 hw2 ...]`
  - **8-phase orchestration tool** for comprehensive homework submission analysis and multi-branch optimization.
  - **⭐ Recommended approach** for grading — automates the complete workflow from retrieval through final reports.
  
  **Selective Retrieval (new!):**
  ```bash
  # Retrieve and test ALL homeworks (full workflow)
  npm run retrieve-check-hw
  
  # Retrieve only hw3, test all homeworks (selective mode - FAST)
  npm run retrieve-check-hw hw3
  
  # Retrieve hw1 and hw2, test all homeworks
  npm run retrieve-check-hw hw1 hw2
  ```
  
  **Smart Caching:**
  - Test results are cached in `.test-cache.json` per homework folder
  - Cache automatically invalidated when homework is retrieved or folders modified
  - Saves 30-60 seconds per cached homework
  - No manual intervention needed — fully automatic
  
  **Workflow:**
  - **Phase 1-2:** Discovers homework folders and retrieves submissions (selective based on args).
  - **Phase 3:** Runs initial tests on all submissions (uses cache when valid).
  - **Phase 4-5:** Analyzes branch performance and determines optimal strategy:
    - **DOMINANT:** One branch consistently performs best → recommend single branch
    - **TIED:** All branches have equal scores → recommend any single branch
    - **MIXED:** Different branches excel at different problems → recommend cherry-picking
  - **Phase 6:** Updates `.env.student` files based on optimization (invalidates cache for merged folders).
  - **Phase 7:** Runs final tests with optimized branch configurations (updates cache).
  - **Phase 8:** Generates comprehensive summary report with optimization decisions.
  
  **Output files:**
    - `retrieve-check-hw-summary.md` - Branch optimization summary with recommendations
    - `hwN_submissions/hwN_submissions_results.md` - Final test results with optimal configuration
    - `hwN_submissions/retrieval.md` - Detailed retrieval logs
    - `automation-requests/{student}-branch-consolidation.md` - Individual consolidation requests
  
  Example workflow:
  ```bash
  # Run complete multi-branch analysis (retrieve and test everything)
  npm run retrieve-check-hw
  
  # Fast workflow: only retrieve new hw3, test all (cache hw1/hw2 results)
  npm run retrieve-check-hw hw3
  
  # Review optimization decisions
  open Fall-2025-Backend/retrieve-check-hw-summary.md
  
  # Review automation requests for students
  open automation-requests/
  ```

- check-hw
  - `npm run check-hw -- hw1`
  - Runs the homework test suite against student submissions. Uses the homework-agnostic test runner (`Fall-2025-Backend/test_problems.js`) with test configuration from the specified homework folder.
  - Supports dual-directory mode: `npm run check-hw -- hw1 hw1_submissions` to use test cases from `hw1/` and test student code from `hw1_submissions/`.
  - Loads test cases from `test-cases.json` and any required data files (specified in `setup.dataFiles`) from the config directory.
  - Generates a Markdown log file (e.g. `hw1_submissions.md`) with a results table showing per-problem scores and overall performance.
  - Supports filtering by problem: `npm run check-hw -- hw1 hw1_submissions p1` to test only problem 1.
  - Example workflow:

```bash
# Test solutions folder (for validation)
npm run check-hw -- hw1

# Test all student submissions after retrieval
npm run check-hw -- hw1 hw1_submissions

# Test specific problem across all students
npm run check-hw -- hw1 hw1_submissions p2

# Review the results
open Fall-2025-Backend/hw1_submissions/hw1_submissions.md
```

- sync-repo
  - `npm run sync-repo`
  - Pushes all non-homework directories and files (excluding hw1, hw2, hw1_submissions, hw2_submissions, etc.) and always includes `test_problems.js` to the public repo.
  - Uses `scripts/sync_public_repo.sh` to perform the sync, commit, and push.
  - Example:

```bash
npm run sync-repo
```

- The script will exclude all homework and submission folders, and push only shared infrastructure, scripts, and test runner files to the public repo.

- serve-docs
  - `npm run serve-docs [port]`
  - Launches a local web server that discovers and renders all markdown files in the repository through a clean, navigable interface.
  - Automatically categorizes documentation by type (root docs, automation requests, homework submissions, homework definitions, etc.).
  - Features:
    - Live markdown rendering with proper syntax highlighting for code blocks
    - Sidebar navigation organized by directory
    - Search functionality to filter files by name or path
    - Responsive design with GitHub-style markdown CSS
    - No external dependencies required (runs locally)
  - Default port is 3000 (configurable via command line argument).
  - Example:

```bash
# Start on default port 3000
npm run serve-docs

# Start on custom port
npm run serve-docs 8080

# Access in browser
open http://localhost:3000
```

- The documentation viewer helps mentors quickly review retrieval logs, automation requests, homework definitions, and all other markdown documentation without manually navigating the file tree.

## repos.json and `.env`
- `repos.json` (optional): map a repo ID to `local_path`, `origin_url`, and `google_drive_resources_folder_id`.
- Example manifest with a single entry (local clone at ../RUMAD-Fall-2025-Accelerator):

```json
{
  "Fall-2025-Backend": {
    "local_path": "../RUMAD-Fall-2025-Accelerator",
    "origin_url": "https://github.com/RUMAD-Backend-Accelerator/Fall-2025-Accelerator",
    "google_drive_resources_folder_id": "1Q76rp_f7LcOfUxuF7nNy9EP1PF2561Kk"
  }
}
```
- `npm run setup` will help bootstrap the public repo clone and write `SELECTED_REPO_ID` and a relative `PUBLIC_REPO_PATH` into `.env`.
- `.env` is local-only and should never be committed. It stores credentials and `PUBLIC_REPO_PATH`.

## Publishing rules & safety
- `publish-hw` publishes the full `hwN` folder **excluding solutions**. This prevents accidental leaks.
- `publish-hw-solutions` publishes solutions and updates all other files **excluding boilerplate** to protect student work.
- Use `unpublish-hw` to completely remove a homework from the public repo (creates commit and PR).
- Use `unpublish-hw-solutions` to remove only the solutions directory from a published homework.
- `sync-resources` will not push ignored files like `.DS_Store` (the public repo contains a `.gitignore`).
- The helper `scripts/helpers/git_commit_and_pr.sh` will try to push to `main`; if that fails it will create a branch and PR, then attempt to merge using `gh` (GitHub CLI).

## Recommended workflow for mentors

### Initial setup
1. Run `npm run setup` and follow the prompts. This bootstraps `.env`, writes a relative `PUBLIC_REPO_PATH`, and offers the Google refresh-token step during setup.
2. If you prefer, run `npm run get-refresh-token` standalone to obtain `GOOGLE_REFRESH_TOKEN` and save it to `.env` (optional if you already completed it in setup).

### Publishing homework
3. To update resources from the shared Drive: run `npm run sync-resources` and follow the interactive prompts. After the script finishes, always inspect the public repo clone (or the created PR) and confirm the changes before merging/pushing.
4. To publish homework into the public repo: run `npm run publish-hw -- hwN` from the repository root. This publishes the entire `hwN` folder excluding `solutions` to avoid accidental leaks.
5. To publish solutions: run `npm run publish-hw-solutions -- hwN` when ready. This publishes solutions and updates all root-level files while automatically excluding boilerplate to protect student work.
6. To unpublish homework or solutions: use `npm run unpublish-hw -- hwN` to remove entire homework, or `npm run unpublish-hw-solutions -- hwN` to remove only solutions.

### Grading student submissions
7. **Option A - Automated multi-branch workflow (⭐ recommended):**
   - Run `npm run retrieve-check-hw` to automatically retrieve all submissions, test them, analyze branch performance, optimize multi-branch students, and generate comprehensive reports.
   - **Fast selective mode:** Run `npm run retrieve-check-hw hw3` to only retrieve hw3 submissions while testing all homeworks (cached results for hw1/hw2 save 30-60 seconds).
   - Review the optimization summary at `Fall-2025-Backend/retrieve-check-hw-summary.md` to see branch consolidation recommendations.
   - Review individual automation requests in `automation-requests/` for students who need to consolidate branches.
   - Review final test results at `Fall-2025-Backend/hwN_submissions/hwN_submissions_results.md` with optimized branch configurations.

8. **Option B - Manual step-by-step workflow:**
   - Run `npm run retrieve-submissions -- hwN` to clone all student branches and copy their code into `Fall-2025-Backend/hwN_submissions/`.
   - Review the retrieval log at `Fall-2025-Backend/hwN_submissions/retrieval.md` to see which students submitted successfully and which need follow-up.
   - Run `npm run check-hw -- hwN hwN_submissions` to execute the test suite against all retrieved student code.
   - Review the test results at `Fall-2025-Backend/hwN_submissions/hwN_submissions_results.md` to see individual student scores and identify common errors.

Notes:
- `publish-hw` excludes solutions, `publish-hw-solutions` excludes boilerplate. Both are safe to use at any time.
- To remove published content, use `npm run unpublish-hw -- hw1` or `npm run unpublish-hw-solutions -- hw1`.
- Always review staged changes in the public repo clone (or the PR) before merging. Use `git status`, `git diff`, and `git diff --staged` to inspect what will be published.

## Troubleshooting
- If you see unexpected files in a commit, inspect the public repo clone and fix/remove them locally, then re-run the helper or push manually.
- If a push fails due to permissions, the helper creates a branch and a PR and writes instructions into `automation-requests/` for the repo owner.

---

## Creating homework

This section describes how to create a new homework folder (e.g. `hw2`) and what files and subfolders each `hw{i}` should contain. Follow this format so the publish and test tooling work consistently.

### Overview

- Each homework is a top-level folder in the repository named `hwN` (for example `hw1`, `hw2`).
- The mentor workspace expects a consistent layout so the `publish-homework` script and test runners can find the problems, boilerplate and (optionally) solutions.
- By convention, `solutions/` should be present locally for mentor use but is excluded from publishing unless `--include-solutions` is explicitly passed.
- Testing uses a homework-agnostic test runner (`Fall-2025-Backend/test_problems.js`) that reads configuration from each homework's `test-cases.json`.

### hw folder layout (recommended)

```
hwN/
  README.md                 # student-facing instructions and problem descriptions
  test-cases.json           # declarative test configuration (data files + test cases)
  boilerplate/              # public starter code for students
    problem1.js
    problem2.js
    problem3.js
    ...
  solutions/                # mentor-only solutions (do NOT publish by default)
    problem1.js
    problem2.js
    problem3.js
    ...
  data/                     # homework-specific data files
    subjects.json           # example: structured data used by problems
    config.json             # example: additional configuration
    ...
  resources/                # optional images, PDFs used by the assignment
```

### Files inside a homework folder (concise)

Each homework folder (for example `hw1`) is self-contained. Data files are specific to that homework — there is no global data directory. A homework may include one or many data files; they can be JSON or any other format.

Minimal, recommended contents:

```
hwN/
  README.md           # student-facing problem descriptions and instructions
  test-cases.json     # declarative test configuration with setup.dataFiles and test cases
  boilerplate/        # student-facing starter code (problem files only)
  solutions/          # mentor-only solutions (excluded from publish by default)
  data/               # homework-specific data files (e.g., subjects.json, config.json)
  resources/          # optional binary assets (images, PDFs)
```

### test-cases.json structure

The test configuration uses a declarative format that the homework-agnostic test runner understands:

```json
{
  "setup": {
    "dataFiles": {
      "subjects": "data/subjects.json",
      "config": "data/config.json"
    }
  },
  "problem1": [
    {
      "description": "Test case description",
      "dataKeys": ["subjects"],
      "input": { "param1": "value1" },
      "expected": "expected output"
    }
  ],
  "problem2": [ ... ],
  "problem3": [ ... ]
}
```

Key fields:
- **`setup.dataFiles`**: Maps data keys to file paths (relative to homework folder). The test runner loads these files once at startup.
- **`dataKeys`**: Array specifying which data files each test case needs. The test runner passes the corresponding data to the student's function.
- **`input`**: Test-specific parameters that vary per test case.
- **`expected`**: Expected output for comparison.

### How to add a new homework

1. **Create the folder structure**:
   ```bash
   npm run create-hw
   # Or manually: cp -r hw_template/ Fall-2025-Backend/hw2/
   ```

2. **Add boilerplate files**:
   - Create problem files in `boilerplate/` (e.g., `problem1.js`, `problem2.js`)
   - Each file should export a function named `solve` or use default export
   - Remove any loader files (e.g., `loadSubjects.js`) — data loading is handled by `test-cases.json`

3. **Add data files**:
   - Create `data/` directory if needed
   - Add JSON data files (e.g., `data/subjects.json`, `data/config.json`)
   - Keep data files small and focused on the homework requirements

4. **Configure test-cases.json**:
   - Define `setup.dataFiles` to map data keys to file paths
   - Write test cases for each problem with `dataKeys`, `input`, and `expected`
   - Test runner will automatically load data and test all cases

5. **Create solutions**:
   - Add solution files in `solutions/` directory
   - Solutions should match the boilerplate structure (same function names)
   - Validate solutions work: `npm run check-hw -- hwN`

6. **Test and publish**:
   ```bash
   # Test solutions locally
   npm run check-hw -- hw2
   
   # Publish to students (excludes solutions)
   npm run publish-hw -- hw2
   
   # Later, publish solutions (excludes boilerplate to protect student work)
   npm run publish-hw-solutions -- hw2
   ```

### Important notes

- **No per-homework test runner**: The test runner (`Fall-2025-Backend/test_problems.js`) is shared across all homeworks. Do not create `hwN/test_problems.js`.
- **No data loader files**: Data loading is declarative via `test-cases.json`. Do not create `loadSubjects.js` or similar loader files.
- **Student functions**: Students should export a `solve` function or use default export. The test runner automatically finds the correct function.
- **Data files location**: Always place data files in `hwN/data/` and reference them in `test-cases.json` as `"data/filename.json"`.
- **Solutions privacy**: The `solutions/` folder is excluded from publishing by default. Use `--include-solutions` flag only when intentionally releasing solutions.

Best practice: Keep data and test case files per-homework, small, and version-controlled; prefer Drive-sync for large binary assets like images and PDFs.

---
