// Type Conversion - Explicit
// Manually changing types
let n = "100";
let a = Number(n); // Converts string to number 100

let m = 1;
let b = Boolean(m); // Converts number to boolean true

console.log(a)
console.log(b)

//Type Coercion - Implicit Typecasting

let result = "The answer is " + 42; // "The answer is 42" (Number becomes String)
let mix = "5" + 2;                   // "52" (Number 2 becomes String "2")
let boolStr = true + " friend";     // "true friend" (Boolean becomes String)


let sub = "5" - 2;      // 3 (String "5" becomes Number 5)
let mult = "4" * "2";   // 8 (Both Strings become Numbers)
let wrong = "apple" - 2;// NaN (String cannot be parsed into a valid number)

// Special values converted to numbers:
let check1 = true + 1;  // 2 (true becomes 1)
let check2 = false + 1; // 1 (false becomes 0)
let check3 = null + 5;  // 5 (null becomes 0)


