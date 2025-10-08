/**
 * regex-practice.js
 * A beginner-friendly set of small functions that demonstrate simple, useful
 * regular expression patterns in Node.js.
 */

// -------------------- Beginner helpers (easy) --------------------

/**
 * Q1. Does the string contain at least one digit?
 * Teach: RegExp.prototype.test(), `\d` character class.
 * Input: string
 * Output: boolean
 */
function hasDigit(str) {
  return /\d/.test(str);
}

/**
 * Q2. Extract the first "word" (letters/numbers/underscore) from the start.
 * Teach: ^ anchor, \w+, .match(), null-safety.
 * Input: string
 * Output: matched word or null
 */
function firstWord(str) {
  const m = str.match(/^\w+/);
  return m ? m[0] : null;
}

/**
 * Q3. Collapse runs of whitespace to a single space and trim ends.
 * Teach: \s+, .replace(), global flag g.
 */
function collapseSpaces(str) {
  return str.trim().replace(/\s+/g, " ");
}

/**
 * Q4. Validate a simple US ZIP code: 5 digits or 5-4 (e.g. 12345 or 12345-6789).
 * Teach: anchors ^$, quantifier {n}, optional group (?:...)?
 */
function isZipCode(str) {
  return /^\d{5}(?:-\d{4})?$/.test(str);
}

/**
 * Q5. Find all very-simple emails in a text (local@domain).
 * Teach: character classes, global g, case-insensitive i, matchAll or match.
 * Returns an array of found addresses (may be empty).
 */
function findEmails(text) {
  const emailLike = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;
  return [...text.matchAll(emailLike)].map(m => m[0]);
}

// -------------------- Intermediate (medium) --------------------

/**
 * Q6. Reformat "Last, First" → "First Last".
 * Teach: capturing groups, replace with $2 $1.
 */
function nameSwap(str) {
  return str.replace(/^\s*([A-Za-z'-]+),\s*([A-Za-z'-]+)\s*$/, "$2 $1");
}

/**
 * Q7. Validate 24-hour time "HH:MM" (00:00 - 23:59).
 */
function is24HourTime(str) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(str);
}

/**
 * Q8. Grab all 3-letter words (letters only), case-insensitive.
 * Returns array or null if none.
 */
function threeLetterWords(text) {
  const threeLetters = /\b[a-z]{3}\b/gi;
  return text.match(threeLetters) || [];
}

// -------------------- Advanced (harder) --------------------

/**
 * Q9. 5-character palindrome ignoring whitespace.
 * Teach: backreferences and anchors. This expects exactly five non-space
 * characters in palindrome order, but allows spaces between them.
 */
function is5CharPalindromeIgnSpace(str) {
  const pal5 = /^\s*(\S)\s*(\S)\s*(\S)\s*\2\s*\1\s*$/;
  return pal5.test(str);
}

/**
 * NOTE: We removed the BONUS HTML parsing-with-regex example because that
 * example was getting more complex and encourages parsing HTML with regex.
 * For reliable HTML parsing use a DOM parser like `cheerio` or the DOM
 * APIs in a browser environment.
 */

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
