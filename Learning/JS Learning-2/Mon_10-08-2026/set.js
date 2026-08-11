
// // Create an empty Map
// const fruits = new Map();

// // Set Map Values
// fruits.set("apples", 500);
// fruits.set("bananas", 300);
// fruits.set("oranges", 200);

// console.log(fruits.size)
// console.log(fruits.has("apples"))


// let p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(10);
//     }, 3 * 1000);
// });

// p.then((result) => {
//     console.log(result); // 10
//     return result * 2;
// }).then((result) => {
//     console.log(result); // 20
//     return result * 3;
// }).then((result) => {
//     console.log(result); // 60
//     return result * 4;
// });


// A Greet Function
function greet(name, callback) {
  callback("Hello " + name);
}

// A Display Function
function display(message) {
  console.log(message);
}

// Call greet() with a callback function (display)
greet("John", display);

