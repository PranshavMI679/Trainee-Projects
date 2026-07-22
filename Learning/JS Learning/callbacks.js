// Callbacks

// let value = 1;

// doSomething = () => {
//   value = 2;
// };
// console.log(value); // 1 


// The Callback Function
// const greet = () => console.log("Hello!");

// // The Higher-Order Function (receives the callback)
// const processUser = (callback) => {
//     callback(); // Executing the callback here
// };

// processUser(greet); 



// Synchromous callback

// const numbers = [1, 2, 3];
// // (num) => num * 2 is the callback function passed to .map()
// const doubled = numbers.map(num => num * 2); 
// console.log(doubled); // [2, 4, 6]


// Asynchromous callback

// function downloadFile(url, callback) {
//     console.log("Downloading started...");
//     setTimeout(() => {
//         console.log("Download complete!");
//         callback("photo.jpg"); // Triggering the callback with data
//     }, 2000);
// }

// downloadFile("https://example.com", (fileName) => {
//     console.log(`Processing file: ${fileName}`);
// });




//<---------------Sync
// The Callback (The specific task)
// function makeCopy() {
//     console.log("2. The photocopy is printed!");
// }

// // The Main Function (The shopkeeper)
// function copyShop(task) {
//     console.log("1. You hand over the paper.");
//     task(); // He does it right now while you wait
//     console.log("3. You take the copy and leave.");
// }
// // Run the code
// copyShop(makeCopy);


//<-------------Async

// The Callback (What you do only when the food arrives)
// function eatPizza() {
//     console.log("The delivery guy is here! Time to eat!");
// }

// // The Main Function (The pizza order)
// function orderPizza(callback) {
//     console.log("1. You place the order on your phone.");
//     // The kitchen takes time to bake and deliver (Simulating a 3-second wait)
//     setTimeout(callback, 3000); 
//     console.log("2. You sit on the couch and watch TV.");
// }
// // Run the code
// orderPizza(eatPizza);



// // ONE CODE BLOCK (The Callback)
// const notifyUser = (message) => {
//     console.log(`[NOTIFICATION]: ${message}`);
// };

// // FUNCTION 1: A Synchronous Login Process
// function loginUser(username, callback) {
//     console.log("Checking password...");
//     callback(`Welcome back, ${username}!`); // Reusing the callback here
// }

// // FUNCTION 2: An Asynchronous Timer
// function setAlarm(seconds, callback) {
//     setTimeout(() => {
//         callback("Wake up! Time is up!"); // Reusing the callback here
//     }, seconds * 1000);
// }

// // FUNCTION 3: An Event (Like a button click)
// function simulateButtonClick(callback) {
//     console.log("User clicked the Red Button!");
//     callback("Button action completed successfully."); // Reusing the callback here
// }

// // --- RUNNING THE CODE ---
// loginUser("Alex", notifyUser);
// simulateButtonClick(notifyUser);
// setAlarm(3, notifyUser);



//-----Callback Hell
// Callback nest

// // Simulating the coffee making process
// function boilWater(callback) {
//     setTimeout(() => {
//         console.log("1. Water is boiled.");
//         callback();
//     }, 1000);
// }

// function addCoffee(callback) {
//     setTimeout(() => {
//         console.log("2. Coffee powder added.");
//         callback();
//     }, 1000);
// }

// function addMilk(callback) {
//     setTimeout(() => {
//         console.log("3. Milk added. Your coffee is ready!");
//         callback();
//     }, 1000);
// }

// // --- CALLBACK HELL START ---
// boilWater(() => {
//     addCoffee(() => {
//         addMilk(() => {
//             console.log("Coffee process finished!");
//         });
//     });
// });
// --- CALLBACK HELL END ---


//------------Solution for callback hell


// Wrapping the same tasks in Promises
// const boilWater = () => new Promise(res => setTimeout(() => res("1. Water is boiled."), 1000));
// const addCoffee = () => new Promise(res => setTimeout(() => res("2. Coffee powder added."), 1000));
// const addMilk = () => new Promise(res => setTimeout(() => res("3. Milk added. Your coffee is ready!"), 1000));

// // --- THE CLEAN SOLUTION ---
// async function makeCoffee() {
//     const step1 = await boilWater();
//     console.log(step1);

//     const step2 = await addCoffee();
//     console.log(step2);

//     const step3 = await addMilk();
//     console.log(step3);

//     console.log("Coffee process finished!");
// }

// makeCoffee();




// setTimeout(myFunction, 3000);

// function myFunction() {
//   console.log("hello world");
// }



// function myDisplayer(some) {
//   console.log(some);
// }

// // Function to calculate a sum
// function myCalculator(num1, num2) {
//   let sum = num1 + num2;
//   return sum;
// }

// // Call the calculator
// let result = myCalculator(5, 5);

// // Call the displayer
// myDisplayer(result);



// function myDisplayer(some) {
//   console.log(some);
// }

// function myCalculator(num1, num2, myCallback) {
//   let sum = num1 + num2;
//   myCallback(sum);
// }

// myCalculator(5, 5, myDisplayer);

// "use strict"
// function myFunction() {
//   return this;
// }

// console.log(myFunction())

// "use strict"
// let x = this
// console.log(x)