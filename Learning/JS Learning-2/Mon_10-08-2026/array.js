// // Flatten array
// let arr = [1, [2, [3, 4], 5], 6];
// console.log(arr.flat(2));


//Find Duplicate
// let arr = [1,2,3,2,4,1]
// let dup = arr.filter((item, index) => arr.indexOf(item) !== index).sort();
// console.log(dup); // Output: [2, 1]


//Rotate Array Right Once
// let arr = [1,2,3,4]
// let firstDigit = arr.pop();
// arr.unshift(firstDigit);
// console.log(arr); // Output: [4,1,2,3]

//Group Even & Odd
// let arr = [4,5,2,7,8]
// let even = []
// let odd = []
// for(let i=0; i<arr.length; i++){
//     if (arr[i] % 2 === 0){
//         even.push(arr[i])
//     }
//     else { odd.push(arr[i]) }
// }
// let finalArr = even.concat(odd)
// console.log(finalArr) // output: [4,2,8,5,7]


//Find Second Largest
// let arr = [10,5,8,20,15]
// let sortedArr = arr.sort((a, b)=> a - b)
// console.log(sortedArr)
// let secondLargest = arr[arr.length - 2]
// console.log(secondLargest)


//Find Longest String
// let arr = ["hi","javascript","wow"]
// let longWord = arr[0]

// for(let i=0; i<arr.length; i++){
//     if(arr[i].length > longWord.length){
//         longWord = arr[i]
//     }
// }
// console.log(longWord) // Output: "javascript"


// //Remove Falsy Values
// let arr = [0,false,1,"",2,null]
// let cleanArr = []
// for(let i=0; i<arr.length; i++){
//     if(arr[i] !== 0 && arr[i] !== false && arr[i] !== null && arr[i] !== ""){
//         cleanArr.push(arr[i])
//     }
//}
//console.log(cleanArr)


// const numbers =[1,2,3,4,5];
// const doubled = []; // 1. External array

// numbers.forEach((num) => {
//     doubled.push(num * 2); // 2. Manually populate it
// });

// console.log(doubled); // Output: [2, 4, 6] (Not undefined!)
// console.log(Array.isArray(doubled))


// const numbers =[1,2,3];
// let total = 0; // 1. Create an external variable

// // 2. Modify it inside the callback
// numbers.forEach((num) => {
//     total += num; 
// });

// console.log(total); // Output: 6 (Not undefined!)
// console.log(typeof total)



// function withdrawMoney(amount, balance) {
//     if (amount > balance) {
//         throw new Error("Insufficient funds!"); // Stops execution immediately
//     }
//     return balance - amount;
// }

// try {
//     withdrawMoney(100, 50);
// } catch (error) {
//     console.log("Caught an error:", error.message); // Output: Caught an error: Insufficient funds!
// }


// const scores = [1, 2, 3, 4, 5];
// const newScores = scores.toSpliced(0, 2);

// console.log(scores);
// console.log(newScores);


// const scores = [3, 4, 5];
// const newScores = scores.toSpliced(0, 0, 1, 2);

// console.log(scores);
// console.log(newScores);


// let a = {name:"test", age:22}
// //let b = Object.assign({}, a)
// let b = {...a}
// b.name = "tester2"

// console.log(a)
// console.log(b)
// //----------------------------------------
// let c = {name:"test", age:22}
// let d = c
// d.name = "tester2"

// console.log(c)
// console.log(d)



// function getScores() {
//   return [70, 80, 90];
// }
// let scores = getScores();

// let x = scores[0],
//   y = scores[1],
//   z = scores[2];

// console.log({ x, y, z });


// const myArr = [[1, 2, 3], [4, 5], 6];
// const newArr = myArr.flat().map(x => [x, x * 10]);
// console.log(newArr)


const myArr = [[1, 2, 3], [4, 5], [6]];
const newArr = myArr.flatMap(x => [x, x * 10]);
console.log(newArr)