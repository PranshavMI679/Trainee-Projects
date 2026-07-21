// -----------Conditional operator-----------------
// conditon ? expression 1 : expression 2

// let age = 20;
// const status = age >= 18 ? "adult" : "minor";

// console.log(status)


//-------------Comma Operator----------

// let result = (5 + 5, 10 + 10, 20 + 20);

// console.log(result); // Output: 40


//---------Assignment Operators--------

// const obj = {};

// obj.x = 3;
// console.log(obj.x); // Prints 3.
// console.log(obj); // Prints { x: 3 }.

// const key = "y";
// obj[key] = 5;
// console.log(obj[key]); // Prints 5.
// console.log(obj); // Prints { x: 3, y: 5 }.

// let x = null;
// //let y = x &&= 10;
// let y = x ||= 10

// console.log(y)


//------Comparison Operators------

// let x = '5'

// console.log(x === 5)


//-------Arithmetic Operators--------

// let x = +false
// //let a = -x
// //let a = +x

// console.log(x)


//------------Bitwise Operators--------

// let a = 3
// let b = 4

// console.log(a >>> b)


// const a = 0b1010n; // 10n
// const b = 0b1100n; // 12n
// console.log(a & b); // 0b1000n (8n)



// ------ Logical Operator--------

// const a1 = true && true; // t && t returns true
// const a2 = true && false; // t && f returns false
// const a3 = false && true; // f && t returns false
// const a4 = false && 3 === 4; // f && f returns false
// const a5 = "Cat" && "Dog"; // t && t returns Dog
// const a6 = false && "Cat"; // f && t returns false
// const a7 = "Cat" || false; // t && f returns false

// console.log(a7)

//------Bigint operators--------

// // BigInt addition
// const a = 1n + 2n; // 3n
// // Division with BigInts round towards zero
// const b = 1n / 2n; // 0n
// // Bitwise operations with BigInts do not truncate either side
// const c = 40000000000000000n >> 2n; // 10000000000000000n

// let d = 8n >> 2n 
// console.log(d)

//------String Operators---------

console.log("my " + "string"); // console logs the string "my string".

let myString = "alpha";
myString += "bet"; // evaluates to "alphabet" and assigns this value to myString.

console.log(myString)