//reverse a string
// let str = "hello, world!";
// let revStr = String(str.split("").reverse().join(""));
// console.log(revStr); // Output: !dlrow ,olleh


//Capitalize every second word in a string
// let str = "i love javascript very much";
// let str2 = str.split(" ").map((word, index) => {
//     if(index % 2 !== 0){
//         return word.toUpperCase();
//     }
//     return word;
// })
// console.log(str2.join(" ")); // Output: i LOVE javascript VERY much


//count vowels and consonants in a string
// let str = "javascript";
// let vowels = 0;
// let consonants = 0;
// for(let i = 0; i < str.length; i++) {
//     let char = str[i].toLowerCase();
//     if("aeiou".includes(char)) {
//         vowels++;
//     } else {
//         consonants++;
//     }
// }
// console.log(`{ Vowels: ${vowels}, Consonants: ${consonants} }`); // Output: Vowels: 3, Consonants: 7


//remove duplicate characters from a string
// let str = "banana";
// let str2 = str.split("").filter((char, index, arr) => arr.indexOf(char) === index).join("");
// console.log(str2); // Output: ban

// let newStr = new Set(str2);
// console.log([...newStr].join("")); // Output: ban


//find first non-repeating character in a string
// let str = "swiss";
// let charCount = {};
// for(let i = 0; i < str.length; i++) {
//     let char = str[i];
//     charCount[char] = (charCount[char] || 0) + 1;
// }
// let firstNonRepeatingChar = null;
// for(let i = 0; i < str.length; i++) {
//     if(charCount[str[i]] === 1) {
//         firstNonRepeatingChar = str[i];
//         break;
//     }
// }
// console.log(firstNonRepeatingChar); // Output: w


//Check if Two Strings are Anagrams
// let str1 = "listen";
// let str2 = "silent";
// let sortedStr1 = str1.split("").sort().join("");
// let sortedStr2 = str2.split("").sort().join("");
// console.log(sortedStr1 === sortedStr2); // Output: true


// //Pig Latin Converter
// let str = "hello world";
// let str2 = str.split(" ").map(word => {
//     return word.slice(1) + word[0] + "ay";
// }).join(" ");
// console.log(str2); // Output: ellohay orldway    
