// function sayHi() {
//   return "Hi";
// }
// const greet = sayHi;
// console.log(greet());


// function outer() {
//   let count = 0;
//   return function () {
//     count++;
//     return count;
//   };
// }
// const c1 = outer();
// const c2 = outer();
// console.log(c1());
// console.log(c1());
// console.log(c2());


// let message = "Hello";
// function test() {
//   console.log(message);
//   let message = "World";
// }
// test();


// function multiply(x) {
//   return function(y) {
//     return x * y;
//   };
// }
// const double = multiply(2);
// console.log(double(5));


// for (var i = 0; i < 3; i++) {
//   setTimeout(() => console.log(i), 0);
// }

// for (let i = 0; i < 3; i++) {
//   setTimeout(() => console.log(i), 0);
// }


// const p = new Promise(resolve => {
//   setTimeout(() => {
//     resolve(console.log("Done"));
//   }, 2000);
// });


// function checkAge(age) {
//   return new Promise((resolve, reject) => {
//     if (age >= 18) {
//       resolve(console.log("Allowed"));
//     } else {
//       reject(console.log("Not Allowed"));
//     }
//   });
// }

// checkAge(22)

let arr = [1,2,3,4]
const result = arr.reduce((acc, item) => {
  acc[item] = (acc[item] || 0) + 1;
  return acc;
}, {});

console.log(result)