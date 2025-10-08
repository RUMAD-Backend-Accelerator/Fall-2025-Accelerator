// regex-test.js
// Simple runner to call functions from regex-practice.js.
// Run with: `node regex-test.js`.

const rp = require('./regex-practice');

console.log('Running regex-test.js examples');

// 1) hasDigit
// console.log('hasDigit("abc123") =>', rp.hasDigit('abc123'));
// console.log('hasDigit("no-digits") =>', rp.hasDigit('no-digits'));

// 2) firstWord
// console.log('firstWord("Hello world!") =>', rp.firstWord('Hello world!'));
// console.log('firstWord("!nope") =>', rp.firstWord('!nope'));

// 3) collapseSpaces
// console.log('collapseSpaces("  a   b \t c  ") =>', rp.collapseSpaces('  a   b \t c  '));

// 4) isZipCode
// console.log('isZipCode("08901") =>', rp.isZipCode('08901'));
// console.log('isZipCode("08901-1234") =>', rp.isZipCode('08901-1234'));
// console.log('isZipCode("8901") =>', rp.isZipCode('8901'));

// 5) findEmails
// const sample = 'Ping ayush.mishra@rutgers.edu and AM3606@scarletmail.rutgers.edu.';
// console.log('findEmails(sample) =>', rp.findEmails(sample));

// 6) nameSwap
// console.log('nameSwap("Mishra, Ayush") =>', rp.nameSwap('Mishra, Ayush'));

// 7) is24HourTime
// console.log('is24HourTime("09:30") =>', rp.is24HourTime('09:30'));
// console.log('is24HourTime("24:00") =>', rp.is24HourTime('24:00'));

// 8) threeLetterWords
// console.log('threeLetterWords("The fox ran far") =>', rp.threeLetterWords('The fox ran far'));

// 9) is5CharPalindromeIgnSpace
// console.log('is5CharPalindromeIgnSpace("a1b1a") =>', rp.is5CharPalindromeIgnSpace('a1b1a'));
// console.log('is5CharPalindromeIgnSpace(" a 1b 1a ") =>', rp.is5CharPalindromeIgnSpace(' a 1b 1a '));
// console.log('is5CharPalindromeIgnSpace("abxba!") =>', rp.is5CharPalindromeIgnSpace('abxba!'));

console.log('Done. Uncomment any example to run it.');
