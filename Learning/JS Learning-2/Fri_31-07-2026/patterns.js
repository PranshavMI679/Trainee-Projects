
// for (let i = 1; i <= 5; i++){
//     let text = ""
//     for (let j = 1; j <= i; j++ ){
//         text = text + "*"
//     }
//     console.log(text)
// }

// result
// *
// **
// ***
// ****
// *****


// let n = 5
// for (let i = 1; i <= n; i++){
//     let text = ""
//     for (let j = 1; j <= (n - i + 1); j++ ){
//         text = text + "*"
//     }
//     console.log(text)
// }

// result
// *****
// ****
// ***
// **
// *

// --------------------


// let n = 5;
// for (let i = 1; i <= n; i++) {
//     let text = "";
//     for (let j = 1; j <= n - i; j++) {
//         text = text + " ";
//     }
//     for (let k = 1; k <= i; k++) {
//         text = text + "*";
//     }
//     console.log(text);
// }


// result
//     *
//    **
//   ***
//  ****
// *****

// ---------------


// let n = 5;
// for (let i = 1; i <= n; i++) {
//     let text = "";
//     for (let j = 1; j < i; j++) {
//         text = text + " ";
//     }
//     for (let k = 1; k <= n - i + 1; k++) {
//         text = text + "*";
//     }
//     console.log(text);
// }

// result
// *****
//  ****
//   ***
//    **
//     *

// --------------------

// for(let i = 1; i <= 5; i++){
//     let text = ""
//     for(let j = 1; j <= 5; j++){
//         text = text + "*";
//     }
//     console.log(text);
// }

// result
// *****
// *****
// *****
// *****
// *****

// --------------------

// for (let i = 1; i <= 5; i++){
//     let text = ""
//     for (let j = 1; j <= i; j++ ){
//         text = text + j
//     }
//     console.log(text)
// }

// result
// 1
// 12
// 123
// 1234
// 12345

// --------------------

// let n = 5
// for (let i = 1; i <= n; i++){
//     let text = ""
//     for (let j = 1; j <= (n - i + 1); j++ ){
//         text = text + j + " "
//     }
//     console.log(text)
// }

// result
// 12345
// 1234
// 123
// 12
// 1

// --------------------

// let count = 1;
// for (let i = 1; i <= 5; i++) {
//   let text = "";
//   for (let j = 1; j <= i; j++) {
//     text = text + count + " ";
//     count++;
//   }
//   console.log(text);
// }

// result
// 1 
// 2 3
// 4 5 6
// 7 8 9 10
// 11 12 13 14 15

// --------------------

// let rows = 5;

// for (let i = 1; i <= rows; i++) {
//   let text = "";
//   for (let space = 1; space <= rows - i; space++) {
//     text += " ";
//   }
//   for (let j = 1; j <= i; j++) {
//     text += "* ";
//   }
//   console.log(text);
// }

// result
//     * 
//    * * 
//   * * * 
//  * * * * 
// * * * * *

// ----------------------------

// let rows = 5;

// for (let i = rows - 1; i >= 1; i--) {
//   let text = "";
//   for (let space = 1; space <= rows - i; space++) {
//     text += " ";
//   }
//   for (let j = 1; j <= i; j++) {
//     text += "* ";
//   }
//   console.log(text);
// }

// result
// * * * * 
//  * * * 
//   * * 
//    *

// ----------------------------

// for (let i = 1; i <= 5; i++){
//     let text = ""
//     for (let j = 1; j <= i; j++ ){
//         if((i + j)%2 === 0) {text = text + "1"}
//         else {text = text + "0"}
//     }
//     console.log(text)
// }

// result
// 1
// 01
// 101
// 0101
// 10101

// ----------------------------

// let rows = 5;

// for (let i = 1; i <= rows; i++) {
//   let text = "";
//   for (let space = 1; space <= rows - i; space++) {
//     text += " ";
//   }
//   for (let j = 1; j <= rows; j++) {
//     text += "* ";
//   }
//   console.log(text);
// }

// result
//     * * * * * 
//    * * * * *
//   * * * * *
//  * * * * *
// * * * * *    

// ----------------------------

// let rows = 5;

// for (let i = 1; i <= rows; i++) {
//   let text = "";
//   for (let space = 1; space < i; space++) {
//     text += " ";
//   }
//   for (let j = 1; j <= rows; j++) {
//     text += "* ";
//   }
//   console.log(text);
// }

// result
// * * * * *
//  * * * * *
//   * * * * *
//    * * * * *
//     * * * * *   

// ----------------------------

