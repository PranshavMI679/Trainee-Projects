//Frequency Counter
// let arr = ["a",1,"a",2,1,1,true]
// let obj = {}
// for (let i=0; i<arr.length; i++){
//     let item = arr[i]
//     obj[item] = (obj[item] || 0) + 1
// }
// console.log(obj) // output: { a:2, 1:3, 2:1, true:1 }


//Most Frequent Character
// let text = "javascript"
// let arr = text.split("")
// let counts = {}

// for(let i=0; i<arr.length; i++){
//         let letter = arr[i]
//         counts[letter]=(counts[letter] || 0) + 1
//     }

// let maxCount = 0
// let mostNum = ""

// for (let letter in counts) {
//     if (counts[letter] > maxCount) {
//         maxCount = counts[letter];      
//         mostNum = letter;  
//     }
// }
// console.log(mostNum)//output: a


// Find Common Element Between Arrays
// let arr1 = [1,2,3,4]
// let arr2 = [3,4,5,6]

// let concat = arr1.concat(arr2)
// let dup = concat.filter((item, index) => concat.indexOf(item) !== index).sort();
// console.log(dup); 


//deeply COunt elements
// let arr = [1,[2,5,[3,4]],6]
// let arr1 = arr.flat(2)
// let count = arr1.length
// console.log(count)


//Ultimate logic mix
// let arr = [
//  {name:"John", score:90},
//  {name:"Alex", score:70},
//  {name:"Emma", score:90},
//  {name:"Mike", score:50}
// ]

// let result = []
// for (let item of arr){
//     if (item.score >= 90){
//         result.push(item.name)
//     }
// }
// console.log(result) //Output: ["John", "Emma"]
// const allScores = arr.map(item => item.score);
// const highestScore = Math.max(...allScores);
// const topStudents = arr.filter(item => item.score === highestScore); 
// const result = topStudents.map(item => item.name);
// console.log(allScores)
// console.log(highestScore)
// console.log(topStudents)
// console.log(result); 


// console.log(["1","2","3"].map(parseInt))
// //output: [ 1, NaN, NaN ]

// console.log([]+[])
// console.log([]+{})
// console.log({}+[])

// console.log(Number((0.1 + 0.2).toFixed(1)) === 0.3)

