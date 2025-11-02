# Test Results - `hw3`

**Date:** 11/1/2025, 10:50:05 PM  
**Configuration:** `hw3`  
**Students Tested:** 1  

---

## Results Summary

| Student | P1 | Total |
|---------|:-------:|:-------|
| ss4917 | ~ `1/11` | `1/11` (9%) |

---

## Legend

- **✓** = All tests passed
- **~** = Some tests passed
- **✗** = All tests failed
- **⚠️ LOAD ERR** = Module failed to load
- **⚠️ NO EXPORT** = No function exported

### Common LOAD ERR Causes

- Code executing at module level (e.g., loading data files, calling functions)
- Missing `require()` paths or syntax errors

> **Fix:** Only export functions; let the test runner pass data as parameters

---

## Detailed Failure Information

### ss4917

**P1:**

- **Test:** `api-get-1`
  - Echo test with hello
  - **Expected:**

    ```json
    {
      "data": {
        "case_id": 2,
        "tasks": [
          {
            "id": 1,
            "title": "Do Backend Accelerator HW",
            "description": "Finish all exercises and submit before midnight.",
            "priority": "high",
            "status": "In Progress",
            "due_date": "2025-10-12",
            "created_at": "2025-10-10T14:30:00Z",
            "completed": false
          },
          {
            "id": 2,
            "title": "Prepare for Data Structures Midterm",
            "description": "Review Trees, HashMaps, and Sets",
            "priority": "high",
            "status": "Not Started",
            "due_date": "2025-10-13",
            "created_at": "2025-10-10T15:00:00Z",
            "completed": false
          },
          {
            "id": 3,
            "title": "Update Project ReadMe",
            "description": "Add model architecture diagram and usage examples to documentation.",
            "priority": "medium",
            "status": "In Progress",
            "due_date": "2025-10-14",
            "created_at": "2025-10-10T16:20:00Z",
            "completed": false
          },
          {
            "id": 4,
            "title": "Push latest web app updates to GitHub",
            "description": "Commit new API routes and test coverage reports.",
            "priority": "medium",
            "status": "In Progress",
            "due_date": "2025-10-13",
            "created_at": "2025-10-10T17:00:00Z",
            "completed": false
          }
        ]
      }
    }
    ```

  - **Got:**

    ```json
    {
      "data": [
        {
          "id": 1,
          "title": "Do Backend Accelerator HW",
          "description": "Finish all exercises and submit before midnight.",
          "priority": "high",
          "status": "In Progress",
          "due_date": "2025-10-12",
          "created_at": "2025-10-10T14:30:00Z",
          "completed": false
        },
        {
          "id": 2,
          "title": "Prepare for Data Structures Midterm",
          "description": "Review Trees, HashMaps, and Sets",
          "priority": "high",
          "status": "Not Started",
          "due_date": "2025-10-13",
          "created_at": "2025-10-10T15:00:00Z",
          "completed": false
        },
        {
          "id": 3,
          "title": "Update Project ReadMe",
          "description": "Add model architecture diagram and usage examples to documentation.",
          "priority": "medium",
          "status": "In Progress",
          "due_date": "2025-10-14",
          "created_at": "2025-10-10T16:20:00Z",
          "completed": false
        },
        {
          "id": 4,
          "title": "Push latest web app updates to GitHub",
          "description": "Commit new API routes and test coverage reports.",
          "priority": "medium",
          "status": "In Progress",
          "due_date": "2025-10-13",
          "created_at": "2025-10-10T17:00:00Z",
          "completed": false
        }
      ]
    }
    ```

- **Test:** `api-get-2`
  - Echo test with hello
  - **Expected:**

    ```json
    {
      "data": {
        "case_id": 3,
        "tasks": [
          {
            "id": 5,
            "title": "Study Dynamic Programming problems",
            "description": "Solve 3 medium LeetCode problems focused on memoization and tabulation.",
            "priority": "high",
            "status": "Not Started",
            "due_date": "2025-10-14",
            "created_at": "2025-10-10T17:45:00Z",
            "completed": false
          },
          {
            "id": 6,
            "title": "Plan course schedule",
            "description": "Look at Schedule of Classes and research courses",
            "priority": "medium",
            "status": "In Progress",
            "due_date": "2025-10-16",
            "created_at": "2025-10-10T18:10:00Z",
            "completed": false
          },
          {
            "id": 7,
            "title": "Jog for 30 minutes",
            "description": "Outdoor jog for fitness and stress relief.",
            "priority": "low",
            "status": "Completed",
            "due_date": "2025-10-11",
            "created_at": "2025-10-10T19:00:00Z",
            "completed": true
          },
          {
            "id": 8,
            "title": "Organize Notion tasks for the week",
            "description": "Review calendar and set up new weekly goals.",
            "priority": "low",
            "status": "Not Started",
            "due_date": "2025-10-13",
            "created_at": "2025-10-10T19:45:00Z",
            "completed": false
          }
        ]
      }
    }
    ```

  - **Got:**

    ```json
    {
      "data": [
        {
          "id": 5,
          "title": "Study Dynamic Programming problems",
          "description": "Solve 3 medium LeetCode problems focused on memoization and tabulation.",
          "priority": "high",
          "status": "Not Started",
          "due_date": "2025-10-14",
          "created_at": "2025-10-10T17:45:00Z",
          "completed": false
        },
        {
          "id": 6,
          "title": "Plan course schedule",
          "description": "Look at Schedule of Classes and research courses",
          "priority": "medium",
          "status": "In Progress",
          "due_date": "2025-10-16",
          "created_at": "2025-10-10T18:10:00Z",
          "completed": false
        },
        {
          "id": 7,
          "title": "Jog for 30 minutes",
          "description": "Outdoor jog for fitness and stress relief.",
          "priority": "low",
          "status": "Completed",
          "due_date": "2025-10-11",
          "created_at": "2025-10-10T19:00:00Z",
          "completed": true
        },
        {
          "id": 8,
          "title": "Organize Notion tasks for the week",
          "description": "Review calendar and set up new weekly goals.",
          "priority": "low",
          "status": "Not Started",
          "due_date": "2025-10-13",
          "created_at": "2025-10-10T19:45:00Z",
          "completed": false
        }
      ]
    }
    ```

- **Test:** `api-get-3`
  - Echo test with hello
  - **Expected:**

    ```json
    {
      "data": {
        "case_id": 4,
        "tasks": [
          {
            "id": 9,
            "title": "Go to Verizon recruiting event.",
            "description": "",
            "priority": "high",
            "status": "In Progress",
            "due_date": "2025-10-12",
            "created_at": "2025-10-10T20:10:00Z",
            "completed": false
          },
          {
            "id": 10,
            "title": "Refine LinkedIn Profile",
            "description": "Update headline and add recent projects.",
            "priority": "medium",
            "status": "Not Started",
            "due_date": "2025-10-15",
            "created_at": "2025-10-10T21:00:00Z",
            "completed": true
          }
        ]
      }
    }
    ```

  - **Got:**

    ```json
    {
      "data": [
        {
          "id": 9,
          "title": "Go to Verizon recruiting event.",
          "description": "",
          "priority": "high",
          "status": "In Progress",
          "due_date": "2025-10-12",
          "created_at": "2025-10-10T20:10:00Z",
          "completed": false
        },
        {
          "id": 10,
          "title": "Refine LinkedIn Profile",
          "description": "Update headline and add recent projects.",
          "priority": "medium",
          "status": "Not Started",
          "due_date": "2025-10-15",
          "created_at": "2025-10-10T21:00:00Z",
          "completed": true
        }
      ]
    }
    ```

- **Test:** `api-get-5`
  - Get sorted tasks
  - **Expected:**

    ```json
    {
      "data": [
        {
          "id": 7,
          "title": "Jog for 30 minutes",
          "description": "Outdoor jog for fitness and stress relief.",
          "priority": "low",
          "status": "Completed",
          "due_date": "2025-10-11",
          "created_at": "2025-10-10T19:00:00Z",
          "completed": true
        },
        {
          "id": 8,
          "title": "Organize Notion tasks for the week",
          "description": "Review calendar and set up new weekly goals.",
          "priority": "low",
          "status": "Not Started",
          "due_date": "2025-10-13",
          "created_at": "2025-10-10T19:45:00Z",
          "completed": false
        },
        {
          "id": 5,
          "title": "Study Dynamic Programming problems",
          "description": "Solve 3 medium LeetCode problems focused on memoization and tabulation.",
          "priority": "high",
          "status": "Not Started",
          "due_date": "2025-10-14",
          "created_at": "2025-10-10T17:45:00Z",
          "completed": false
        },
        {
          "id": 6,
          "title": "Plan course schedule",
          "description": "Look at Schedule of Classes and research courses",
          "priority": "medium",
          "status": "In Progress",
          "due_date": "2025-10-16",
          "created_at": "2025-10-10T18:10:00Z",
          "completed": false
        }
      ]
    }
    ```

  - **Got:**

    ```json
    {
      "data": [
        {
          "id": 5,
          "title": "Study Dynamic Programming problems",
          "description": "Solve 3 medium LeetCode problems focused on memoization and tabulation.",
          "priority": "high",
          "status": "Not Started",
          "due_date": "2025-10-14",
          "created_at": "2025-10-10T17:45:00Z",
          "completed": false
        },
        {
          "id": 6,
          "title": "Plan course schedule",
          "description": "Look at Schedule of Classes and research courses",
          "priority": "medium",
          "status": "In Progress",
          "due_date": "2025-10-16",
          "created_at": "2025-10-10T18:10:00Z",
          "completed": false
        },
        {
          "id": 7,
          "title": "Jog for 30 minutes",
          "description": "Outdoor jog for fitness and stress relief.",
          "priority": "low",
          "status": "Completed",
          "due_date": "2025-10-11",
          "created_at": "2025-10-10T19:00:00Z",
          "completed": true
        },
        {
          "id": 8,
          "title": "Organize Notion tasks for the week",
          "description": "Review calendar and set up new weekly goals.",
          "priority": "low",
          "status": "Not Started",
          "due_date": "2025-10-13",
          "created_at": "2025-10-10T19:45:00Z",
          "completed": false
        }
      ]
    }
    ```

- **Test:** `api-invalid-get-1`
  - Error Handling for caseId NaN
  - **Error:** `Unexpected token 'I', "Invalid pa"... is not valid JSON`

- **Test:** `api-invalid-get-2`
  - Error handling for taskId NaN
  - **Expected:**

    ```json
    {
      "data": "Invalid param: taskId is not a number."
    }
    ```

  - **Got:**

    ```json
    {
      "data": {}
    }
    ```

- **Test:** `api-invalid-get-3`
  - Invalid priority parameter
  - **Expected:**

    ```json
    {
      "data": "Priority is not High, Low, or Medium."
    }
    ```

  - **Got:**

    ```json
    {
      "data": []
    }
    ```

- **Test:** `api-post-1`
  - Creating new task
  - **Expected:**

    ```json
    {
      "data": {
        "caseId": 4,
        "task": {
          "id": 11,
          "title": "Career Mega Fair",
          "description": "Update and print out resumes",
          "priority": "high",
          "status": "In Progress",
          "due_date": "2025-11-28",
          "created_at": "2025-10-20T20:10:00Z",
          "completed": false
        }
      }
    }
    ```

  - **Got:**

    ```json
    {
      "data": {
        "caseId": -1,
        "task": {}
      }
    }
    ```

- **Test:** `api-post-2`
  - Invalid caseID, return error
  - **Expected:**

    ```json
    {
      "data": "Could not find taskCase at given caseId."
    }
    ```

  - **Got:**

    ```json
    {
      "data": {
        "caseId": -1,
        "task": {}
      }
    }
    ```

- **Test:** `api-post-3`
  - Mark task as complete
  - **Expected:**

    ```json
    {
      "data": {
        "caseId": 2,
        "task": {
          "id": 1,
          "title": "Do Backend Accelerator HW",
          "description": "Finish all exercises and submit before midnight.",
          "priority": "high",
          "status": "In Progress",
          "due_date": "2025-10-12",
          "created_at": "2025-10-10T14:30:00Z",
          "completed": true
        }
      }
    }
    ```

  - **Got:**

    ```json
    {
      "data": {
        "caseId": -1,
        "task": {}
      }
    }
    ```


---

**Test completed:** 11/1/2025, 10:50:05 PM  
**Log file:** `Fall-2025-Accelerator/hw3/hw3_results.md`
