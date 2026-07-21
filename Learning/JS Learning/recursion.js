// function recurse(x) {
//     if (x > 0){
//         console.log(x)
//         recurse(x - 1)
//         }
// }
// console.log(recurse(10))


// const getMaxCallStackSize = (i) => {
//   try {
//     return getMaxCallStackSize(++i);
//   } catch {
//     return i;
//   }
// };
// console.log(getMaxCallStackSize(0));


// const factorial = (n) => {
//   if (n === 0) {
//     return 1;
//   }
//   return n * factorial(n - 1);
// };
// console.log(factorial(10));
// // 3628800


// const fibonacci = (n) => (n <= 2 ? 1 : fibonacci(n - 1) + fibonacci(n - 2));
// console.log(fibonacci(10));
// // 55

const reduce = (fn, acc, [cur, ...rest]) =>
  cur === undefined ? acc : reduce(fn, fn(acc, cur), rest);
console.log(reduce((a, b) => a + b, 0, [1, 2, 3, 4, 5, 6, 7, 8, 9]));
// 45


// mr_tester3
// mrtester3@yopmail.com
// tester..679


//---------Edabit Questions

//------------very easy

// function length(str) {
//   if (str === "") {
//     return 0;
//   }
//   return 1 + length(str.slice(1));
// }

//---------Medium

//---------Find the largest Even Number
// function largestEven(nums) {
//   let x = -1
// 	for (let val of nums){
// 		if(val % 2 === 0 && val > x)
// 			x = val
// 	}
//   return x;
// }

//------------Sum of items in an Array
// function sumArray(arr) {
//     let sum = 0;
//     for (let val of arr) {
//         if (Array.isArray(val)) {
//             sum = sum + sumArray(val);
//         } else {
//             sum = sum + val;
//         }
//     }
//     return sum;
// }

//-----------the Collatz Conjecture
// function collatz(num) {
// 	if (num === 1){
// 		return 0
// 	}
// 	let nextNum = (num % 2 === 0 ? num/2 : num*3+1)
// 	return 1 + collatz(nextNum)
// }

