// // // //Learning about Var, Let and Const

// // // // if (true) {
// // // //     var globalLeak = "I leak out!";
// // // //     let blockSecured = "I am locked inside!";
// // // // }
// // // // console.log(globalLeak);   // Outputs: "I leak out!"
// // // // console.log(blockSecured); // ReferenceError: blockSecured is not defined


// // // // var x = 1;

// // // // if (x === 1) {
// // // //   var x = 2;

// // // //   console.log(x);
// // // //   // Expected output: 2
// // // // }

// // // // console.log(x);
// // // // // Expected output: 2

// // // var a = 1;
// // // var a = 2;
// // // console.log(a); // 2
// // // var a;
// // // console.log(a); // 2; not undefined

// // // /*
// // // function foo() {
// // //   var x = 1;
// // //   function bar() {
// // //     var y = 2;
// // //     console.log(x); // 1 (function `bar` closes over `x`)
// // //     console.log(y); // 2 (`y` is in scope)
// // //   }
// // //   bar();
// // //   console.log(x); // 1 (`x` is in scope)
// // //   console.log(y); // ReferenceError, `y` is scoped to `bar`
// // // }

// // // foo();
// // // */

// // function varTest() {
// //   var x = 1;
// //   {
// //     var x = 2; // same variable!
// //     console.log(x); // 2
// //   }
// //   console.log(x); // 2
// // }

// // // function letTest() {
// // //   let x = 1;
// // //   {
// // //     let x = 2; // different variable
// // //     console.log(x); // 2
// // //   }
// // //   console.log(x); // 1
// // // }

// let x=1;

// letTest();

// console.log(x); // 

// function letTest() {
//   x=2;
//   console.log(x); // 2
// }                             

// const strPrim = "foo"; // A literal is a string primitive
// const strObj = new String(strPrim); // A String object

// console.log(strObj);


//String.raw`Hi\n${2 + 3}!`;

const a = Number("hello");

console.log(a); // 1
