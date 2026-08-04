//--------------Palindrome Number

// var isPalindrome = function(x) {
//     const str = x.toString()
//     const revstr = str.split('').reverse().join('')
//     return str == revstr
// };

//-------------Add Binary
// var addBinary = function(a, b) {
//     let binaryA = "0b" + a;
//     let binaryB = "0b" + b;
    
//     let num1 = BigInt(binaryA);
//     let num2 = BigInt(binaryB);

//     let sum = num1 + num2

//     return sum.toString(2)
// };

//---------------Valid Palindrome
// var isPalindrome = function(s) {
//     let lowerCaseString = s.toLowerCase();
//     let cleanString = lowerCaseString.replace(/[^a-z0-9]/g, "");
//     let reversedString = cleanString.split("").reverse().join("");
//     return cleanString === reversedString;
// };

//---------Convert to Hexadecimal
// var toHex = function(num) {
//     if(num===0){
//         return 0
//     }
//     return (num>>>0).toString(16)
// };

//------------Length of Last Word
// var lengthOfLastWord = function(s) {
//     let cleanString = s.trim();
//     let words = cleanString.split(" ");
//     let lastWord = words[words.length - 1];
//     return lastWord.length;
// };