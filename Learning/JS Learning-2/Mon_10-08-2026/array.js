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


//Remove Falsy Values
let arr = [0,false,1,"",2,null]
let cleanArr = []
for(let i=0; i<arr.length; i++){
    if(arr[i] !== 0 && arr[i] !== false && arr[i] !== null && arr[i] !== ""){
        cleanArr.push(arr[i])
    }
}
console.log(cleanArr)