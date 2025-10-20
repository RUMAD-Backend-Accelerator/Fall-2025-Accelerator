// typical function notation
function fizzBuzz1(n) {
  let ans = [];
  if (typeof(n) !== "number" || n < 1) throw new Error("n must be a positive integer.")
  // at this point, n is some number 1 or greater, but n may be a floating point number...
  // we need to ensure that n is specifically an INTEGER.
  // to do this, we may use the following:
  if(!Number.isInteger(n)) throw new Error("n must be a positive integer.")

  for (i = 1; i <= n; i ++) {
    // for each i, we should check divisibility by 3, 5, or both
    // divisible by 3: add "Fizz" to the list
    // divisible by 5: add "Buzz" to the list
    // divisible by 3 AND 5: add "FizzBuzz" to the list
    if (i % 3 === 0 && i % 5 === 0) ans.push("FizzBuzz");
    else if (i % 3 === 0) ans.push("Fizz");
    else if (i % 5 === 0) ans.push("Buzz");
    else ans.push(i + "");
  }
  return ans;
}

// arrow function notation! let's give it a try
const fizzBuzz2 = (n) => {
  if (!Number.isInteger(n) || n < 1) throw new Error("n must be a positive integer.");
  const ans = [];                  // start with an empty list
  for (let i = 1; i <= n; i++) {   // 1-indexed; we start from i=1
    // This is a different approach. Let's start with an empty string instead,
    // since we can just append to this string.
    let s = "";
    if (i % 3 === 0) s += "Fizz";  // if i is divisible by 3, append "Fizz"
    if (i % 5 === 0) s += "Buzz";  // if i is divisible by 5, append "Buzz"
    // if i is divisible by both 3 and 5, it will build the string like this:
    // "" -> "Fizz" -> "FizzBuzz"
    ans.push(s || String(i));      // finally, push string onto list
  }
  return ans;
}

// both fizzBuzz1 and fizzBuzz2 work!

// console.log(fizzBuzz1(1.257)); // will throw Error
// console.log(fizzBuzz1(0));     // will throw Error
// console.log(fizzBuzz2(1));     // [1]
// console.log(fizzBuzz1(2));
// console.log(fizzBuzz2(3));     // == [1, 2, "Fizz"]
console.log(fizzBuzz1(4));        // == [1, 2, "Fizz", 4]
// console.log(fizzBuzz2(10));
console.log(fizzBuzz1(15));
// console.log(fizzBuzz2(20));
// console.log(fizzBuzz1(27));
console.log(fizzBuzz2("hi"));     // will also throw Error