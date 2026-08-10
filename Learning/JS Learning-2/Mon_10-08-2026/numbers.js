//12345 -> 54321
// let num = 12345;
// let num2 = num.toString().split("").reverse().join("");
// let num3 = Number(num2)

// console.log(num3); // Output: 54321
// console.log(typeof num3); // Output: number

//987 -> 24
// let num = 987
// let num2 = num.toString().split("").reduce((start, use) => start + Number(use), 0)
// console.log(num2); // Output: 24
// console.log(typeof num2)

//Check Palindrome Number
// let num = 123;
// let num2 = Number(num.toString().split("").reverse().join(""));
// console.log(num2 === num)

//Count Even Digits
// let num = 123456789
// let n = num.toString().split("").reduce((start, use) => {
//     if(Number(use) % 2 === 0) {
//         return start + 1 } return start }, 0)
// console.log(n)

//12345 -> 51234
// let num = 12345;
// let num2 = num.toString().split("");
// let firstDigit = num2.pop();
// num2.unshift(firstDigit);
// let num3 = Number(num2.join(""));
// console.log(num3); // Output: 51234

//Find Missing Number
//[1,2,3,5] -> 4
// let num = [1,2,3,5];
// let n = num.length + 1;
// let totalSum = (n * (n + 1)) / 2;
// let arraySum = num.reduce((start, use) => start + use, 0);
// let missingNumber = totalSum - arraySum;
// console.log(missingNumber); // Output: 4

//Largest Difference Between Adjacent Digits
//91357 -> 8
// let num = 91357;
// let num2 = num.toString().split("").map(Number);
// console.log(num2);
// let maxDiff = 0
// for(let i = 0; i<num2.length - 1; i++) {
//     let diff = Math.abs(num2[i] - num2[i + 1]);
//     if(diff > maxDiff) {
//         maxDiff = diff;
//     }
// }
// console.log(maxDiff); // Output: 8