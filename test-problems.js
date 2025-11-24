const fs = require('fs');
const path = require('path');

// Helper: Convert absolute path to relative path from repo root
function toRelativePath(absolutePath) {
  const repoRoot = path.resolve(__dirname, '..');
  return path.relative(repoRoot, absolutePath);
}

// Simple helper to attempt to require a module and return null on failure
function tryRequire(relPath) {
  try {
    return require(relPath);
  } catch (e) {
    return { error: e.message };
  }
}

function pretty(msg) { 
  console.log(msg);
  if (logStream) {
    logStream.write(msg + '\n');
  }
}

async function startServer(impl, port = 3000) {
  const server = impl.listen(port, ()=> {
    console.log(`Running student's server on port ${port}`);
  })
  return server
}

let logStream = null;
let silentMode = false; // Suppress console output when true
let originalConsoleLog = null;
let originalConsoleError = null;
let originalConsoleWarn = null;

async function run(options = {}) {
  // Silent mode: suppress all console output (used during concurrent operations)
  silentMode = options.silent || false;
  
  if (silentMode) {
    // Suppress all console output in silent mode
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
    
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
  } else {
    console.clear();
  }
  
  // Get directories from command line or options
  // Usage 1: node test-problems.js hw1 (test hw1 folder with test-cases.json in hw1)
  // Usage 2: node test-problems.js hw1 hw1_submissions (test hw1_submissions using test-cases.json from hw1)
  // Usage 3: node test-problems.js hw1 hw1_submissions --no-log (skip writing to markdown file)
  const homeworkDir = options.homeworkDir || process.argv[2];
  const submissionsDir = options.submissionsDir || process.argv[3];
  const writeLog = options.writeLog !== false && !process.argv.includes('--no-log');
  
  if (!homeworkDir) {
    console.error('Error: No homework directory specified.');
    console.error('Usage: node test-problems.js <homework_directory> [submissions_directory]');
    console.error('Example: node test-problems.js hw1');
    console.error('Example: node test-problems.js hw1 hw1_submissions');
    process.exitCode = 1;
    return;
  }

  // The config directory contains test-cases.json and data/
  const configDir = homeworkDir;
  const configPath = path.join(__dirname, configDir);
  
  // The test directory contains student code to test
  const testDir = submissionsDir || homeworkDir;
  const testPath = path.join(__dirname, testDir);
  
  // Check if config directory exists
  if (!fs.existsSync(configPath)) {
    console.error(`Error: Configuration directory '${configDir}' does not exist.`);
    process.exitCode = 1;
    return;
  }
  
  // Check if test directory exists
  if (!fs.existsSync(testPath)) {
    console.error(`Error: Test directory '${testDir}' does not exist.`);
    process.exitCode = 1;
    return;
  } 

  // Check if test-cases.json exists in config directory
  const casesPath = path.join(configPath, 'test-cases.json');
  if (!fs.existsSync(casesPath)) {
    console.error(`Error: test-cases.json not found in ${configDir}/.`);
    console.error(`Cannot run tests without test-cases.json configuration file.`);
    process.exitCode = 1;
    return;
  }

  // Load .env.student from test directory (for PREFERRED_FOLDER(S))
  const envPath = path.join(testPath, '.env.student');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  }

  // Get PREFERRED_FOLDER or PREFERRED_FOLDERS
  const preferredFolder = process.env.PREFERRED_FOLDER;
  const preferredFolders = process.env.PREFERRED_FOLDERS;
  
  let foldersToTest = [];
  
  if (preferredFolders) {
    // Parse pipe-separated list (supports folder names with spaces)
    foldersToTest = preferredFolders.split('|')
      .map(f => f.trim())
      .filter(f => f.length > 0);
  } else if (preferredFolder) {
    // Remove quotes if present
    let folder = preferredFolder.trim();
    if ((folder.startsWith('"') && folder.endsWith('"')) || 
        (folder.startsWith("'") && folder.endsWith("'"))) {
      folder = folder.slice(1, -1);
    }
    foldersToTest = [folder];
  }
  
  if (foldersToTest.length === 0) {
    console.error(`Error: No PREFERRED_FOLDER or PREFERRED_FOLDERS found in ${testDir}/.env.student`);
    process.exitCode = 1;
    return;
  }

  // Load test cases
  let testConfig = {};
  try {
    testConfig = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
  } catch (e) {
    console.error('Error: Could not load test-cases.json:', e.message);
    process.exitCode = 2;
    return;
  }

  // Extract setup configuration and test cases
  const setup = testConfig.setup || {};
  const dataFiles = setup.dataFiles || {};
  const serverNeeded = setup.serverNeeded || null;
  
  // Remove 'setup' key to get only test case keys
  const cases = { ...testConfig };
  delete cases.setup;

  // Load data files specified in setup (from config directory)
  const loadedData = {};
  for (const [dataKey, dataPath] of Object.entries(dataFiles)) {
    const fullPath = path.join(configPath, dataPath);
    try {
      loadedData[dataKey] = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      console.log(`Loaded data file: ${dataKey} from ${dataPath}`);
    } catch (e) {
      console.warn(`Warning: Could not load data file '${dataKey}' from ${dataPath}: ${e.message}`);
      loadedData[dataKey] = null;
    }
  }

  // Create log file in test directory (Markdown format) only if writeLog is true
  const logPath = path.join(testPath, `${testDir}_results.md`);
  if (writeLog) {
    logStream = fs.createWriteStream(logPath, { flags: 'w' });
  }

  console.log(`\nRUMAD Test Runner for ${testDir}`);
  if (submissionsDir) {
    console.log(`Using test configuration from ${configDir}`);
  }
  if (!writeLog) {
    console.log(`(Running in no-log mode - markdown file will not be generated)`);
  }
  console.log(`Testing ${foldersToTest.length} folder(s): ${foldersToTest.join(', ')}\n`);

  // CLI options: node test-problems.js homework_dir submissions_dir [p1|p2|p3|all]
  const arg = (process.argv[4] || 'all').toLowerCase();
  const toRun = arg === 'all' ? Object.keys(cases) : [arg];

  // Helper to pick an implementation function from a module object
  function pickImpl(moduleObj, problemKey) {
    if (!moduleObj) return null

    // If module itself is a function (module.exports = function) use it
    // express app object is a callable so code below will run for this too
    if (typeof moduleObj === 'function') {
      return moduleObj 
    };
    
    // Try common named exports: solve, default
    const commonNames = ['solve', 'default'];
    for (const n of commonNames) {
      if (typeof moduleObj[n] === 'function') return moduleObj[n];
    }

    // Fallback: return the first function-valued property on the export
    for (const k of Object.keys(moduleObj)) {
      if (typeof moduleObj[k] === 'function') return moduleObj[k];
    }

    return null;
  }

  // Collect results for all students
  const allResults = [];
  let server = null

  // Test each folder
  for (const folder of foldersToTest) {
    const studentResult = { name: folder, problems: {}, failures: [] };
    
    for (const problem of toRun) {
      if (!cases[problem]) {
        continue;
      }

      // try to require the student's module from the test directory
      const problemFile = problem.replace('p', 'problem');
      const modulePath = path.join(testPath, folder, problemFile);

      // Clear module cache for this specific module to ensure fresh load
      try {
        const resolvedPath = require.resolve(modulePath);
        delete require.cache[resolvedPath];
      } catch (e) {
        // Module not found yet, no cache to clear
      }

      // Monkey-patch require to mock '../data/tasks-cases.json' if needed
      const Module = require('module');
      const originalRequire = Module.prototype.require;
      Module.prototype.require = function (request) {
        // Support both Unix and Windows path separators
        if (request === '../data/tasks-cases.json' || request === '..\\data\\tasks-cases.json') {
          // Return the loadedData for the key 'taskCases' if available, else throw
          if (loadedData.taskCases) return loadedData.taskCases;
          throw new Error('Mocked data file not found');
        }
        return originalRequire.apply(this, arguments);
      };

      let mod;
      try {
        mod = tryRequire(modulePath);
      } finally {
        // Restore original require after loading
        Module.prototype.require = originalRequire;
      }

      // Check if module loading failed
      if (mod && mod.error) {
        studentResult.problems[problem] = { status: 'LOAD_ERROR', error: mod.error, passed: 0, total: 0, failed: 0, skipped: 0 };
        studentResult.failures.push({
          problem: problem,
          type: 'LOAD_ERROR',
          error: mod.error
        });
        continue;
      }

      const impl = pickImpl(mod, problem);

      if (!impl) {
        studentResult.problems[problem] = { status: 'NO_EXPORT', passed: 0, total: 0, failed: 0, skipped: 0 };
        studentResult.failures.push({
          problem: problem,
          type: 'NO_EXPORT'
        });
        continue;
      }

      // Run Express server if serverNeeded is True
      // This will run for every folder checked => next student's server loads up
      if (serverNeeded) {
        server = await startServer(impl)
      }

      const casesFor = cases[problem];
      let counters = { total: casesFor.length, passed: 0, failed: 0, skipped: 0 };

      for (const tc of casesFor) {
        let result = null
        try {
          // Check if required data is available
          const dataKeys = tc.dataKeys || [];
          const missingData = dataKeys.filter(key => !loadedData[key]);

          if (missingData.length > 0) {
            console.log("MISSING DATA")
            counters.skipped += 1;
            continue;
          }
          if (tc.apiTest) { // Check if test case is an apiTest
            // Check if server is null
            if (server === null) {
              counters.skipped += 1
              continue;
            }

            // Construct fetch arguments
            api_method = tc.apiInfo.method.toUpperCase()
            url = tc.apiInfo.url
            body = tc.apiInfo.body
            type = tc.apiInfo.type
            
            // Call test endpoint with args
            // console.log(`Calling API ENDPOINT ${url} method ${api_method}`)
            
            // Construct options for API Requests
            
            let options = {
               method: api_method
            };
            
            // If POST, add headers and body
            if(api_method == "POST" && body && type) {
              options["headers"] = { 'Content-Type': type }
              options["body"] = JSON.stringify(body)
            } 

            // await result and convert to json
            const response = await fetch(url, options);
            
            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              result = await response.json();
            } else {
              // Handle non-JSON responses (e.g., plain text 404 errors)
              const text = await response.text();
              throw new Error(`Expected JSON response but got: ${text}`);
            }

          } else { // Build arguments for the function call
            const args = [];
          
            if (dataKeys.length > 0) {
              args.push(loadedData[dataKeys[0]]);
            }
            
            const opts = tc.input || {};
            
            if (opts.courseIdentifier !== undefined) {
              args.push(opts.courseIdentifier);
            } else if (Object.keys(opts).length > 0 || impl.length >= 2) {
              args.push(opts);
            }

            // Call the implementation with the constructed arguments
            result = impl(...args);
          }

          // If result is a Promise, await it
          if (result && typeof result.then === 'function') {
            console.log("awaited result")
            result = await result.json();
          }

          // Check result validity
          if (tc.expected !== null) {
            const pass = JSON.stringify(result) === JSON.stringify(tc.expected);
            if (pass) {
              counters.passed += 1;
            } else {
              counters.failed += 1;
              // Record failure details
              studentResult.failures.push({
                problem: problem,
                testName: tc.name || 'unnamed test',
                expected: tc.expected,
                actual: result,
                notes: tc.notes || ''
              });
            }
          } else {
            counters.passed += 1;
          }
        } catch (err) {
          counters.failed += 1;
          // Record exception details (skip "Not implemented" errors)
          if (err.message !== 'Not implemented') {
            studentResult.failures.push({
              problem: problem,
              testName: tc.name || 'unnamed test',
              error: err.message,
              notes: tc.notes || ''
            });
          }
          
        }
      }

      studentResult.problems[problem] = counters;
    }

    allResults.push(studentResult);

    // Close Server after folder has ran
    if (serverNeeded && server !== null) {
      server.close()
    }

  }

  // Write Markdown header to log file
  if (logStream) {
    logStream.write(`# Test Results - \`${testDir}\`\n\n`);
    logStream.write(`**Date:** ${new Date().toLocaleString()}  \n`);
    logStream.write(`**Configuration:** \`${configDir}\`  \n`);
    logStream.write(`**Students Tested:** ${foldersToTest.length}  \n\n`);
    logStream.write(`---\n\n`);
    logStream.write(`## Results Summary\n\n`);
  }
  
  // Print table header to console
  console.log('\n' + '='.repeat(80));
  console.log('TEST RESULTS SUMMARY');
  console.log('='.repeat(80));
  
  const problems = Object.keys(cases);
  const colWidth = 12;
  
  // Console table header
  let header = 'Student'.padEnd(25);
  for (const prob of problems) {
    header += prob.toUpperCase().padEnd(colWidth);
  }
  header += 'Total'.padEnd(colWidth);
  console.log('\n' + header);
  console.log('-'.repeat(25 + (colWidth * (problems.length + 1))));
  
  // Markdown table header to log file
  if (logStream) {
    logStream.write(`| Student | `);
    for (const prob of problems) {
      logStream.write(`${prob.toUpperCase()} | `);
    }
    logStream.write(`Total |\n`);
    
    logStream.write(`|---------|`);
    for (let i = 0; i < problems.length; i++) {
      logStream.write(`:-------:|`);
    }
    logStream.write(`:-------|\n`);
  }
  
  // Table rows
  for (const result of allResults) {
    let row = result.name.padEnd(25);
    let mdRow = `| ${result.name} | `;
    let totalPassed = 0;
    let totalTests = 0;
    
    for (const prob of problems) {
      const res = result.problems[prob];
      if (!res) {
        row += '-'.padEnd(colWidth);
        mdRow += '- | ';
      } else if (res.status === 'LOAD_ERROR') {
        row += 'LOAD ERR'.padEnd(colWidth);
        mdRow += '⚠️ LOAD ERR | ';
      } else if (res.status === 'NO_EXPORT') {
        row += 'NO EXPORT'.padEnd(colWidth);
        mdRow += '⚠️ NO EXPORT | ';
      } else {
        const score = `${res.passed}/${res.total}`;
        const symbol = res.passed === res.total ? '✓' : res.passed === 0 ? '✗' : '~';
        row += `${symbol} ${score}`.padEnd(colWidth);
        mdRow += `${symbol} \`${score}\` | `;
        totalPassed += res.passed;
        totalTests += res.total;
      }
    }
    
    // Total column
    if (totalTests > 0) {
      const totalScore = `${totalPassed}/${totalTests}`;
      const percent = Math.round((totalPassed / totalTests) * 100);
      row += `${totalScore} (${percent}%)`.padEnd(colWidth);
      mdRow += `\`${totalScore}\` (${percent}%) |`;
    } else {
      row += '-'.padEnd(colWidth);
      mdRow += '- |';
    }
    
    console.log(row);
    if (logStream) {
      logStream.write(mdRow + '\n');
    }
  }
  
  console.log('='.repeat(80));
  console.log('\nLegend: ✓ = All Pass | ~ = Partial | ✗ = All Fail');
  console.log('        LOAD ERR = Module failed to load | NO EXPORT = No function exported');
  console.log('\nCommon LOAD ERR causes:');
  console.log('  • Code executing at module level (e.g., loading data files, calling functions)');
  console.log('  • Missing require() paths or syntax errors');
  console.log('  → Fix: Only export functions; let the test runner pass data as parameters');
  
  // Write legend to Markdown log
  if (logStream) {
    logStream.write(`\n---\n\n`);
    logStream.write(`## Legend\n\n`);
    logStream.write(`- **✓** = All tests passed\n`);
    logStream.write(`- **~** = Some tests passed\n`);
    logStream.write(`- **✗** = All tests failed\n`);
    logStream.write(`- **⚠️ LOAD ERR** = Module failed to load\n`);
    logStream.write(`- **⚠️ NO EXPORT** = No function exported\n\n`);
    logStream.write(`### Common LOAD ERR Causes\n\n`);
    logStream.write(`- Code executing at module level (e.g., loading data files, calling functions)\n`);
    logStream.write(`- Missing \`require()\` paths or syntax errors\n\n`);
    logStream.write(`> **Fix:** Only export functions; let the test runner pass data as parameters\n\n`);
    
    // Helper function to format and truncate JSON output
    function formatOutput(value, maxLines = 50) {
      const jsonStr = JSON.stringify(value, null, 2);
      const lines = jsonStr.split('\n');
      
      if (lines.length <= maxLines) {
        // Indent each line with 4 spaces for markdown code block
        return lines.map(line => `    ${line}`).join('\n');
      }
      
      // Truncate and add indicator
      const truncated = lines.slice(0, maxLines).map(line => `    ${line}`).join('\n');
      return `${truncated}\n    ... (${lines.length - maxLines} more lines truncated)`;
    }

    // Write detailed failure information for each student
    const studentsWithFailures = allResults.filter(r => r.failures.length > 0);
    if (studentsWithFailures.length > 0) {
      logStream.write(`---\n\n`);
      logStream.write(`## Detailed Failure Information\n\n`);
      
      for (const result of studentsWithFailures) {
        logStream.write(`### ${result.name}\n\n`);
        
        // Group failures by problem
        const failuresByProblem = {};
        for (const failure of result.failures) {
          if (!failuresByProblem[failure.problem]) {
            failuresByProblem[failure.problem] = [];
          }
          failuresByProblem[failure.problem].push(failure);
        }
        
        // Write failures for each problem
        for (const [problem, failures] of Object.entries(failuresByProblem)) {
          logStream.write(`**${problem.toUpperCase()}:**\n\n`);
          
          for (const failure of failures) {
            if (failure.type === 'LOAD_ERROR') {
              logStream.write(`- **Module Load Error**\n\n`);
              logStream.write(`  \`\`\`text\n`);
              // Escape backticks and ensure all lines maintain proper indentation
              const escapedError = failure.error.replace(/`/g, '\\`');
              const indentedError = escapedError.split('\n').map(line => `  ${line}`).join('\n');
              logStream.write(`${indentedError}\n`);
              logStream.write(`  \`\`\`\n\n`);
            } else if (failure.type === 'NO_EXPORT') {
              logStream.write(`- **No Function Exported**\n`);
              logStream.write(`  The module does not export a function. Make sure to export using \`module.exports = { solve: yourFunction }\`\n\n`);
            } else if (failure.error) {
              // Runtime error (skip if not interesting)
              logStream.write(`- **Test:** \`${failure.testName}\`\n`);
              if (failure.notes) {
                logStream.write(`  - ${failure.notes}\n`);
              }
              logStream.write(`  - **Error:** \`${failure.error}\`\n\n`);
            } else {
              // Wrong output
              logStream.write(`- **Test:** \`${failure.testName}\`\n`);
              if (failure.notes) {
                logStream.write(`  - ${failure.notes}\n`);
              }
              logStream.write(`  - **Expected:**\n\n`);
              logStream.write(`    \`\`\`json\n`);
              const expectedOutput = formatOutput(failure.expected);
              logStream.write(`${expectedOutput}\n`);
              logStream.write(`    \`\`\`\n\n`);
              logStream.write(`  - **Got:**\n\n`);
              logStream.write(`    \`\`\`json\n`);
              const actualOutput = formatOutput(failure.actual);
              logStream.write(`${actualOutput}\n`);
              logStream.write(`    \`\`\`\n\n`);
            }
          }
        }
        
        logStream.write(`\n`);
      }
    }
    
    logStream.write(`---\n\n`);
    logStream.write(`**Test completed:** ${new Date().toLocaleString()}  \n`);
    logStream.write(`**Log file:** \`${toRelativePath(logPath)}\`\n`);
  }
  
  console.log('\nRunner finished.');
  
  // Build return object for programmatic access
  const resultsObject = {};
  for (const result of allResults) {
    resultsObject[result.name] = result.problems;
  }
  
  if (logStream) {
    logStream.end();
    console.log(`\nLog file created: ${toRelativePath(logPath)}`);
  }
  
  // Restore console functions if they were suppressed
  if (silentMode && originalConsoleLog) {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  }
  
  return resultsObject;
}

if (require.main === module) run();

module.exports = { run };
