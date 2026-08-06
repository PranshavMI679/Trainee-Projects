// setInterval(() => {
//   console.log("🐢 I had a 5000ms delay!");
// }, 0);

// setTimeout(() => {
//   console.log("⚡ I had a 5000ms delay!");
// }, 0);



// /// Sync Callback Function
// function greetUser(name, callback) {
//   console.log(`Hello, ${name}!`);
//   callback(); // Executing the callback function
// }
// console.log("Starting the greeting process...");
// function sayGoodbye() {
//   console.log("Goodbye! Have a great day.");
// }

// // Passing sayGoodbye as a callback argument
// greetUser("Alice", sayGoodbye);

// // Output:
// // 1. "Hello, Alice!"
// // 2. "Goodbye! Have a great day."




// 1. Simulating the Async API Functions using setTimeout
// function loginUser(email, password, callback) {
//   setTimeout(() => {
//     console.log("Step 1: User logged in successfully.");
//     callback({ userId: 101, userEmail: email }); // Pass data to callback
//   }, 1000);
// }

// function getUserCart(userId, callback) {
//   setTimeout(() => {
//     console.log(`Step 2: Fetched cart items for user ${userId}.`);
//     callback(["Laptop", "Wireless Mouse"]); // Pass data to callback
//   }, 1000);
// }

// function processPayment(items, callback) {
//   setTimeout(() => {
//     console.log(`Step 3: Payment processed for: ${items.join(", ")}.`);
//     callback({ status: "Success", transactionId: "TXN-998877" }); // Pass data to callback
//   }, 1000);
// }

// // 2. Executing the Callback Chain (The "Callback Hell" Structure)
// console.log("--- Checkout Process Started ---");
// loginUser("customer@email.com", "password123", (user) => {
//   // Inside Step 1 callback: Start Step 2
//   getUserCart(user.userId, (cartItems) => {
//     // Inside Step 2 callback: Start Step 3
//     processPayment(cartItems, (receipt) => {
//       // Inside Step 3 callback: Final Confirmation
//       console.log(`Checkout Complete! Receipt Info:`, receipt);
//       console.log("--- Process Ended ---");
//     });
//   });
// });


// function login(email, pass, cb) { setTimeout(() => cb({ id: 101 }), 1000); }
// function getCart(id, cb) { setTimeout(() => cb(["Laptop", "Mouse"]), 1000); }
// function pay(items, cb) { setTimeout(() => cb({ status: "Paid" }), 1000); }

// // The Callback Hell Pyramid
// login("user@mail.com", "123", (user) => {
//     getCart(user.id, (items) => {
//         pay(items, (receipt) => {
//             console.log("Success:", receipt);
//             // Imagine adding 5 more steps here...
//             // }
//           // }
//         });
//     });
// });



//---------------Promises

// const checkInventory = new Promise((resolve, reject) => {
//   let itemInStock = true; // Simulating a check

//   setTimeout(() => {
//     if (itemInStock) {
//       resolve(console.log("Item is available for shipping!")); // Moves state to Fulfilled
//     } else {
//       reject(console.log("Out of stock error.")); // Moves state to Rejected
//     }
//   }, 1000);
// });


// Simple helper to create simulated network successes
//const delayResolve = (value, ms) => new Promise(res => setTimeout(() => res(value), ms));

// Simple helper to create simulated network crashes
// const delayReject = (errorMessage, ms) => new Promise((_, rej) => setTimeout(() => rej(new Error(errorMessage)), ms));

// // Our 3 micro-services
// const getUsers = () => delayResolve("👥 Users Data", 1000);
// const getPosts = () => delayResolve("📝 Posts Data", 2000);
// const brokenAPI = () => delayReject("💥 Server Error 500", 500);


// async function runAll() {
//   try {
//     const data = await Promise.all([getUsers(), getPosts()]);
//     console.log("Promise.all Success:", data); 
//     // Output after 2 seconds: ["👥 Users Data", "📝 Posts Data"]
//   } catch (err) {
//     console.log("Promise.all Failed!", err.message);
//   }
// }
// runAll();





console.log("1. Sync Start");

fetchDataPromise()
  .then((data) => {
    console.log("4. Promise Resolved:", data); // Runs LATER
  })
  .catch((err) => {
    console.log("Alternative 4. Promise Failed:", err); // Runs LATER if error
  });

console.log("2. Sync End");



async function displayData() {
  console.log("2. Inside Async Function Start");
  
  // The Pause Point
  const data = await fetchDataPromise(); 
  
  console.log("4. Inside Async Function End:", data); // Runs LATER
}

console.log("1. Global Start");
displayData();
console.log("3. Global End");
