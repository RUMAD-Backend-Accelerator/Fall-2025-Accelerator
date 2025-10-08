/**
 * regex-practice.js
 * Small, beginner-friendly regex examples (Node.js).
 */

/**
 * Q1. Contains a digit?
 * Input: string
 * Output: boolean
 */
function hasDigit(str) {
  return /\d/.test(str);
}

/**
 * Q2. First word from start.
 * Input: string
 * Output: string or null
 */
function firstWord(str) {
  const m = str.match(/^\w+/);
  return m ? m[0] : null;
}

/**
 * Q3. Collapse whitespace and trim.
 * Input: string
 * Output: string
 */
function collapseSpaces(str) {
  return str.trim().replace(/\s+/g, " ");
}

/**
 * Q4. Simple US ZIP validator (12345 or 12345-6789).
 * Input: string
 * Output: boolean
 */
function isZipCode(str) {
  return /^\d{5}(?:-\d{4})?$/.test(str);
}

/**
 * Q5. Find simple emails in text.
 * Input: string
 * Output: string[]
 */
function findEmails(text) {
  const emailLike = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;
  return [...text.matchAll(emailLike)].map(m => m[0]);
}

// -------------------- Intermediate (medium) --------------------

/**
 * Q6. Swap "Last, First" → "First Last".
 * Input: string
 * Output: string
 */
function nameSwap(str) {
  return str.replace(/^\s*([A-Za-z'-]+),\s*([A-Za-z'-]+)\s*$/, "$2 $1");
}

/**
 * Q7. Validate 24-hour time (HH:MM).
 * Input: string
 * Output: boolean
 */
function is24HourTime(str) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(str);
}

/**
 * Q8. Find 3-letter words.
 * Input: string
 * Output: string[]
 */
function threeLetterWords(text) {
  const threeLetters = /\b[a-z]{3}\b/gi;
  return text.match(threeLetters) || [];
}

// -------------------- Advanced (harder) --------------------

/**
 * Q9. 5-char palindrome ignoring spaces.
 * Input: string
 * Output: boolean
 */
function is5CharPalindromeIgnSpace(str) {
  const pal5 = /^\s*(\S)\s*(\S)\s*(\S)\s*\2\s*\1\s*$/;
  return pal5.test(str);
}

/** Short note: avoid parsing HTML with regex; use a real parser (e.g. cheerio). */

// Export the functions so `regex-test.js` can import them.
module.exports = {
  hasDigit,
  firstWord,
  collapseSpaces,
  isZipCode,
  findEmails,
  nameSwap,
  is24HourTime,
  threeLetterWords,
  is5CharPalindromeIgnSpace,
};
