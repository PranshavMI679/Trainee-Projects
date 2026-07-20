//---------Functional parameters-------------

//---default parameters
// function multiply(a, b = 1) {
//   //b = typeof b !== "undefined" ? b : 1;
//   return a * b;
// }

// console.log(multiply(5)); 

//rest parameters
// function multiply(multiplier, ...theArgs) {
//   return theArgs.map((x) => multiplier * x);
// }

// const arr = multiply(2, 1, 2, 3);
// console.log(arr);


//-------Arrow Functions--------
// shorter fnctions

// const a = ["Hydrogen", "Helium", "Lithium", "Beryllium"];

// const a2 = a.map(function (s) {
//   return s.length;
// });
// console.log(a2); // [8, 6, 7, 9]

// const a3 = a.map((s) => s.length);
// console.log(a3); // [8, 6, 7, 9]

//No Separate this

// function Person() {
//   this.age = 0;
//   setInterval(function growUp() {this.age++;}, 1000);
// }

// const p = new Person();
// console.log(p)

// strict mode
// function Person() {
//   const self = this;
//   self.age = 0;

//   setInterval(function growUp() {self.age++;}, 1000);
// }

// const p = new Person();
// console.log(p)


//--------IIFE--------

// (function chai(){
//   console.log(`DB CONNECTED`);
// })();

// ( (name) => {
//   console.log(`Hello ${name}`)
// })('Pranshav')

//----------Argument Object Functions----------

// function func1(a, b, c) {
//   console.log(arguments[0]);
//   // Expected output: 1

//   console.log(arguments[1]);
//   // Expected output: 2

//   console.log(arguments[2]);
//   // Expected output: 3
// }

// func1(1, 2, 3);

// Scopes and Function Stack

// const x = "declared inside function"; // x can only be used in exampleFunction

// function exampleFunction() {
//   console.log("Inside function");
//   //console.log(x);
// }

// console.log(x); 


// function calculateAge(yearString) {
//   // You are using the built-in parseInt() inside your own function
//   const currentYear = 2026;
//   const birthYear = parseInt(yearString); 
//   return currentYear - birthYear;
// }

// console.log(calculateAge(2004));

// const user = {
//   name: "Pranshav",
//   age: 22
// }

// function userInformation(anyObject){
//   console.log(`Username is ${anyObject.name} and age is ${anyObject.age}`)
// }

// userInformation(user);


// const arr = [200, 100, 300, 400]

// function arrayValues(...getArray){
//   return getArray
// }

// console.log(arrayValues(arr))


// const user = {
//   username : "pranshav",
//   age: 22,
//   welcomeMessage: function(){
//     console.log (`${this.username}, welcome`);
//     //console.log(this);
//   }
// }

// user.welcomeMessage()
// user.username = "sam"
// user.welcomeMessage()

//console.log(this);

// const chai = () => {
//   let username = "hitesh"
//   //console.log()
// }

// chai()


// function myFunc(theObject) {
//   theObject.make = "Toyota";
// }

// const myCar = {
//   make: "Honda",
//   model: "Accord",
//   year: 1998,
// };

// console.log(myCar.make); // "Honda"
// myFunc(myCar);
// console.log(myCar.make); // "Toyota"




// function addSquares(a, b) {
//   function square(x) {
//     return x * x;
//   }
//   return console.log(square(a) + square(b));
// }

// addSquares(2, 3)



// const square = function (number) {
//   return number * number;
// };

// console.log(square(4)); // 16



// const factorial = function fac(n) {
//   return n < 2 ? 1 : n * fac(n - 1);
// };

// console.log(factorial(3)); // 6




// function map(f, a) {
//   const result = new Array(a.length);
//   for (let i = 0; i < a.length; i++) {
//     result[i] = f(a[i]);
//   }
//   return result;
// }

// const numbers = [0, 1, 2, 5, 10];
// const cubedNumbers = map(function (x) {
//   return x * x * x;
// }, numbers);
// console.log(cubedNumbers); // [0, 1, 8, 125, 1000]



// function factorial(n) {
//   if (n === 0 || n === 1) {
//     return console.log(1);
//   }
//   return console.log(n * factorial(n - 1));
// }

// factorial(5)