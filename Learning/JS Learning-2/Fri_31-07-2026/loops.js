//--------Loops and Iterations

//----------For Loop

// for (initialization(begin); condition; afterthought(step))
//   statement---loop body



// for (let i = 0; i < 10; i++) {
//   console.log(i);
// }

// let i = 0
// for (; i < 10; i++) {
//   //console.log(i);
// }
// console.log(i)


// const cars = ["BMW", "Volvo", "Saab", "Ford"];
// let len = cars.length;
// console.log(len)

// let text = "";
// for (let i = 0; i < len; i++) {
//   text = cars[i];
//   console.log(text)
// }


//--------expression-1 can be declared outside before of loop

// const cars = ["BMW", "Volvo", "Saab", "Ford"];
// let len = cars.length;

// let i = 2;

// let text = "";
// for (; i < len; i++) {
//   text = cars[i];
//   console.log(text)
// }

//-------------expression-2 can also be declared inside loop

// const cars = ["BMW", "Volvo", "Saab", "Ford"];
// let len = cars.length;

// let i = 0;

// let text = "";
// for (; i < len; ) {
//   text = cars[i];
//   //i++;
//   console.log(text)
// }

//-------expression-3 also can be written isnide the loop but with a condition statement

// let i = 0; 

// for (;;) { 
//   if (i >= 10) {
//     break;
//   }
//   i++; 
//   console.log(i)
// }


// const fruits = ['apple', 'banana', 'orange'];

// for (const values in fruits) {
//   console.log(values);        // Prints: "0", "1", "2" (as strings!)
//   console.log(typeof values); // Prints: "string"
// }



