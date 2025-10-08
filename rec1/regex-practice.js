/**
 * Q1. Does the string contain at least one digit?
 * - Teach: .test(), \d, basic boolean result.
 */
const hasDigit = /\d/;
console.log("Q1:", hasDigit.test("abc123")); // true
console.log("Q1:", hasDigit.test("no-digits")); // false


/**
 * Q2. Extract the first "word" (letters/numbers/underscore) from the start.
 * - Teach: ^ anchor, \w+, .match(), null-safety.
 */
function firstWord(s) {
  const m = s.match(/^\w+/);
  return m ? m[0] : null;
}
console.log("Q2:", firstWord("Hello world!"), firstWord("!nope")); // "Hello", null


/**
 * Q3. Collapse runs of whitespace to a single space.
 * - Teach: \s+, .replace(), global flag g.
 */
function collapseSpaces(s) {
  return s.trim().replace(/\s+/g, " ");
}
console.log("Q3:", collapseSpaces("  a   b \t c  ")); // "a b c"


/**
 * Q4. Validate a simple US ZIP code: 5 digits or 5-4.
 * - Teach: grouping (?: ), optional part ?, anchors ^$, quantifier {n}.
 *   NOTE: This is a simplified classroom validator.
 */
const zip = /^\d{5}(?:-\d{4})?$/;
console.log("Q4:", zip.test("08901"), zip.test("08901-1234"), zip.test("8901")); // true true false


/**
 * Q5. Find all very-simple emails in a text (local@domain).
 * - Teach: Character classes, global g, case-insensitive i, matchAll.
 *   NOTE: This is intentionally simple; production email regexes are more complex.
 */
const emailLike = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;
const sampleEmails = "Ping ayush.mishra@rutgers.edu and AM3606@scarletmail.rutgers.edu.";
console.log("Q5:", [...sampleEmails.matchAll(emailLike)].map(m => m[0]));


/**
 * Q6. Reformat "Last, First" → "First Last".
 * - Teach: Capturing groups (), backreferences \1 \2, .replace().
 */
function nameSwap(s) {
  return s.replace(/^\s*([A-Za-z'-]+),\s*([A-Za-z'-]+)\s*$/, "$2 $1");
}
console.log("Q6:", nameSwap("Mishra, Ayush")); // "Ayush Mishra"


/**
 * Q7. Validate 24-hour time "HH:MM".
 * - Teach: Alternation (|), precise numeric ranges via regex, anchors.
 *   Valid: 00:00 to 23:59
 */
const hhmm = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
console.log("Q7:", hhmm.test("09:30"), hhmm.test("24:00")); // true false


/**
 * Q8. Grab all 3-letter words (letters only), case-insensitive.
 * - Teach: \b word boundaries, {3}, global and i flags.
 */
const threeLetters = /\b[a-z]{3}\b/gi;
console.log("Q8:", "The fox ran far".match(threeLetters)); // [ 'The', 'fox', 'ran', 'far' ]


/**
 * Q9. 5-character palindrome ignoring whitespace.
 * - Teach: Backreferences, grouping, making whitespace ignorable with \s*.
 *   Exactly 5 non-space characters mirrored around the middle.
 *   Examples that should pass: "a1b1a", " a 1b 1a ", "#a? a#"
 */
const pal5 = /^\s*(\S)\s*(\S)\s*(\S)\s*\2\s*\1\s*$/;
console.log("Q9:", pal5.test("a1b1a"), pal5.test(" a 1b 1a "), pal5.test("abxba")); // true true true
console.log("Q9:", pal5.test("abxba!")); // false (extra char breaks ^$ anchors)


/**
 * BONUS. Parse a VERY SPECIFIC HTML line with regex (demo only).
 * - Teach: Named pieces via capture groups, non-greedy [^<]+, escaping slashes.
 * - IMPORTANT: In general, use a proper HTML parser. This is acceptable only because
 *   we fully control the exact format and it's a single line with no nesting.
 *
 *   Expected exact format (single line):
 *   <li class="user"><a href="/u/<username>" data-id="<digits>"><Name Text></a></li>
 *
 *   Extract:
 *   1) username  (letters/digits/._-)
 *   2) numeric id
 *   3) text inside the <a>…</a>
 */
const userLine =
  '<li class="user"><a href="/u/ayush.mishra" data-id="42">Ayush Mishra</a></li>';

const userRegex =
  /^<li class="user">\s*<a href="\/u\/([a-z0-9._-]+)"\s+data-id="(\d+)">([^<]+)<\/a>\s*<\/li>$/i;

const m = userLine.match(userRegex);
if (m) {
  const [_, username, id, text] = m;
  console.log("BONUS:", { username, id, text });
} else {
  console.log("BONUS: no match");
}
