# Test Results - `hw3`

**Date:** 11/2/2025, 1:43:51 PM  
**Configuration:** `hw3`  
**Students Tested:** 1  

---

## Results Summary

| Student | P1 | Total |
|---------|:-------:|:-------|
| ss4917 | ~ `7/11` | `7/11` (64%) |

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

- **Test:** `api-invalid-get-1`
  - Error Handling for caseId NaN
  - **Error:** `Unexpected token 'I', "Invalid pa"... is not valid JSON`

- **Test:** `api-invalid-get-2`
  - Error handling for taskId NaN
  - **Error:** `Unexpected token 'I', "Invalid pa"... is not valid JSON`

- **Test:** `api-invalid-get-3`
  - Invalid priority parameter
  - **Error:** `Unexpected token 'P', "Priority i"... is not valid JSON`

- **Test:** `api-post-2`
  - Invalid caseID, return error
  - **Error:** `Unexpected token 'C', "Could not "... is not valid JSON`


---

**Test completed:** 11/2/2025, 1:43:51 PM  
**Log file:** `Fall-2025-Accelerator/hw3/hw3_results.md`
