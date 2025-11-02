# Test Results - `hw1`

**Date:** 11/1/2025, 7:59:48 PM  
**Configuration:** `hw1`  
**Students Tested:** 1  

---

## Results Summary

| Student | P1 | P2 | P3 | Total |
|---------|:-------:|:-------:|:-------:|:-------|
| ss4917 | ✗ `0/2` | ✗ `0/7` | ✗ `0/2` | `0/11` (0%) |

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

- **Test:** `p1-full-catalog`
  - Return top 10 courses sorted by credits (desc) then sections (desc).
  - **Expected:**

    ```json
    [
      {
        "course": "ACTING IN LONDON",
        "credits": 12,
        "sections": 1
      },
      {
        "course": "CLINICAL PRAC 2",
        "credits": 11,
        "sections": 1
      },
      {
        "course": "NSG CARE ADULT/OA",
        "credits": 6,
        "sections": 14
      },
      {
        "course": "NSG CARE CHLDBRG FAM",
        "credits": 6,
        "sections": 14
      },
      {
        "course": "PROF PRAC INTERNSHIP",
        "credits": 6,
        "sections": 6
      },
      {
        "course": "INTERNSHIP SPRT MGT",
        "credits": 6,
        "sections": 2
      },
      {
        "course": "CO-OP EDUCATION",
        "credits": 6,
        "sections": 1
      },
      {
        "course": "AFR STDY SCHOL PROJ",
        "credits": 6,
        "sections": 1
      },
      {
        "course": "CO-OP ARTS & SCIENCE",
        "credits": 6,
        "sections": 1
      },
      {
        "course": "HONORS IN CHINESE",
        "credits": 6,
        "sections": 1
    ... (2 more lines truncated)
    ```

  - **Got:**

    ```json
    [
      {
        "title": "ACTING IN LONDON",
        "sections": 1,
        "credits": 12
      },
      {
        "title": "CLINICAL PRAC 2",
        "sections": 1,
        "credits": 11
      },
      {
        "title": "NSG CARE ADULT/OA",
        "sections": 14,
        "credits": 6
      },
      {
        "title": "NSG CARE CHLDBRG FAM",
        "sections": 14,
        "credits": 6
      },
      {
        "title": "PROF PRAC INTERNSHIP",
        "sections": 6,
        "credits": 6
      },
      {
        "title": "INTERNSHIP SPRT MGT",
        "sections": 2,
        "credits": 6
      },
      {
        "title": "CO-OP EDUCATION",
        "sections": 1,
        "credits": 6
      },
      {
        "title": "AFR STDY SCHOL PROJ",
        "sections": 1,
        "credits": 6
      },
      {
        "title": "CO-OP ARTS & SCIENCE",
        "sections": 1,
        "credits": 6
      },
      {
        "title": "HONORS IN CHINESE",
        "sections": 1,
        "credits": 6
    ... (7 more lines truncated)
    ```

- **Test:** `p1-small-dataset`
  - Test with smaller dataset (first 3 departments) to verify sorting logic.
  - **Expected:**

    ```json
    [
      {
        "course": "CO-OP EDUCATION",
        "credits": 6,
        "sections": 1
      },
      {
        "course": "INTRO FINANCIAL ACCT",
        "credits": 3,
        "sections": 9
      },
      {
        "course": "INTRO TO MNGRL ACCTG",
        "credits": 3,
        "sections": 5
      },
      {
        "course": "INTERMED ACCTNG I",
        "credits": 3,
        "sections": 3
      },
      {
        "course": "ADVANCED ACCOUNTING",
        "credits": 3,
        "sections": 3
      },
      {
        "course": "AUDIT ANALYTICS",
        "credits": 3,
        "sections": 3
      },
      {
        "course": "ACCTNG INFORM SYSTS",
        "credits": 3,
        "sections": 3
      },
      {
        "course": "INTERMED ACCTNG II",
        "credits": 3,
        "sections": 2
      },
      {
        "course": "CONCEPTS OF AUDITING",
        "credits": 3,
        "sections": 2
      },
      {
        "course": "INCOME TAX ACCOUNTNG",
        "credits": 3,
        "sections": 2
    ... (2 more lines truncated)
    ```

  - **Got:**

    ```json
    [
      {
        "title": "CO-OP EDUCATION",
        "sections": 1,
        "credits": 6
      },
      {
        "title": "INTRO FINANCIAL ACCT",
        "sections": 9,
        "credits": 3
      },
      {
        "title": "INTRO TO MNGRL ACCTG",
        "sections": 5,
        "credits": 3
      },
      {
        "title": "INTERMED ACCTNG I",
        "sections": 3,
        "credits": 3
      },
      {
        "title": "ADVANCED ACCOUNTING",
        "sections": 3,
        "credits": 3
      },
      {
        "title": "AUDIT ANALYTICS",
        "sections": 3,
        "credits": 3
      },
      {
        "title": "ACCTNG INFORM SYSTS",
        "sections": 3,
        "credits": 3
      },
      {
        "title": "INTERMED ACCTNG II",
        "sections": 2,
        "credits": 3
      },
      {
        "title": "CONCEPTS OF AUDITING",
        "sections": 2,
        "credits": 3
      },
      {
        "title": "INCOME TAX ACCOUNTNG",
        "sections": 2,
        "credits": 3
    ... (7 more lines truncated)
    ```

**P3:**

- **Test:** `p3-full-catalog`
  - Count all departments, courses, and sections in the catalog.
  - **Expected:**

    ```json
    {
      "departments": 169,
      "courses": 2819,
      "sections": 7461
    }
    ```

  - **Got:**

    ```json
    {
      "department": 169,
      "courses": 2819,
      "sections": 7461
    }
    ```

- **Test:** `p3-small-dataset`
  - Count with smaller dataset (first 3 departments) to verify counting logic.
  - **Expected:**

    ```json
    {
      "departments": 3,
      "courses": 37,
      "sections": 86
    }
    ```

  - **Got:**

    ```json
    {
      "department": 3,
      "courses": 37,
      "sections": 86
    }
    ```


---

**Test completed:** 11/1/2025, 7:59:48 PM  
**Log file:** `Fall-2025-Accelerator/hw1/hw1_results.md`
