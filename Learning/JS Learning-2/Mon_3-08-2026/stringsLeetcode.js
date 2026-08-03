//------------Valid Anagram

// var isAnagram = function(s, t) {
//     if (s.length !== t.length) {
//         return false;
//     }
//     return s.split("").sort().join("") === t.split("").sort().join("");
// }

//-------------Add Strings

// var addStrings = function(num1, num2) {
//     let a = Number(num1)
//     let b = Number(num2)

//     let result = a + b
//     return result.toString()
// };

//------------Robot

// var judgeCircle = function(moves) {
//     let x = 0;
//     let y = 0;

//     for (let m of moves){
//         if (m === 'U') {y++}
//         else if(m === 'D'){y--}
//         else if (m === 'R'){x++}
//         else if (m === 'L'){x--}
//     }
//     return x===0 && y===0
// };


//----------keyboard Row

// var findWords = function(words) {
//     const row1 = "qwertyuiop";
//     const row2 = "asdfghjkl";
//     const row3 = "zxcvbnm";
    
//     return words.filter(word => {
//         const letters = word.toLowerCase().split('');

//         return letters.every(char => row1.includes(char)) ||
//                letters.every(char => row2.includes(char)) ||
//                letters.every(char => row3.includes(char));
//     });
// };
