// const orderBurger = new Promise((resolve, reject) => {
//     let foodIsReady = false; 

//     console.log("Kitchen is cooking...");
    
//     setTimeout(() => {
//         if (foodIsReady) {
//             resolve("Delicious Burger!"); 
//         } else {
//             reject("Sorry, out of ingredients."); 
//         }
//     }, 2000);
// });

// async function handleOrder() {
//     try {
//         const message = await orderBurger;
//         console.log("Success:", message);
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }
// handleOrder();


// // 1. CREATING the Promise
// const checkInventory = new Promise((resolve, reject) => {
//     let itemInStock = true;
//     if (itemInStock) {
//         resolve("Item is ready!"); // Moves to Fulfilled state
//     } else {
//         reject("Out of stock.");    // Moves to Rejected state
//     }
// });

// // 2. CONSUMING the Promise
// checkInventory
//     .then((result) => console.log(result))   // Runs if resolved
//     .catch((error) => console.error(error))  // Runs if rejected
//     .finally(() => console.log("Done."));    // Runs no matter what




// A standard function returning a Promise
// function fetchUserData() {
//     return new Promise((resolve) => setTimeout(() => resolve("User: Trainee"), 1000));
// }

// async function displayDashboard() {
//     try {
//         console.log("Loading dashboard...");
//         const user = await fetchUserData(); 
//         console.log(`Welcome back, ${user}`);
//     } catch (error) {
//         console.error("Failed to load dashboard:", error);
//     }
// }

// displayDashboard();



// const myPromise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("foo");
//   }, 300);
// });

// myPromise
//   .then((value) => `${value} and bar`)
//   .then((value) => `${value} and bar again`)
//   .then((value) => `${value} and again`)
//   .then((value) => `${value} and again`)
//   .then((value) => {
//     console.log(value);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// let myPromise = new Promise(function(myResolve, myReject) {
//   throw "Error 444";
// });

// myPromise.catch(x => myDisplay(x));

// function myDisplay(some) {
//   console.log(some);
// }


// let myPromise = new Promise(function(resolve, reject) {

// // Code that might take some time goes here

//   let success = true;
//   if (success) {
//     resolve("Done");
//   } else {
//     reject("Failed");
//   }
// });

// // Using the Promise
// myPromise.then(
//   function(value) {myDisplayer(value)},
//   function(value) {myDisplayer(value)}
// );

// // Funtion to display any text
// function myDisplayer(text) {
//   document.getElementById("demo").innerHTML = text;
//}




//------------Initial Method

// // 1. Create the promise using the constructor
// const fetchUserProfile = new Promise((resolve, reject) => {
//   console.log("Fetching user profile... Please wait.");
  
//   setTimeout(() => {
//     const isNetworkConnected = true; // Change to false to test the error state

//     if (isNetworkConnected) {
//       // Data to return on success
//       const user = { id: 42, username: "dev_coder", role: "admin" };
//       resolve(user); 
//     } else {
//       // Reason to return on failure
//       reject("Network Error: Unable to connect to the server."); 
//     }
//   }, 2000); // 2-second delay
// });

// // 2. Consume the promise
// fetchUserProfile
//   .then((userData) => {
//     console.log("Success! Profile Data received:");
//     console.log(`ID: ${userData.id}, Username: ${userData.username}`);
//   })
//   .catch((errorMessage) => {
//     console.error(`Failure! ${errorMessage}`);
//   })
//   .finally(() => {
//     console.log("Request operation finished.");
//   });

// console.log(fetchUserProfile)




//------------ShortCut Method


// 1. Instantly return a resolved promise with cached data
// function getCachedData() {
//   const cache = "Cached HTML Content";
//   return Promise.resolve(cache); // Bypasses the full constructor
// }

// // 2. Instantly return a rejected promise for invalid input
// function validateAge(age) {
//   if (age < 18) {
//     return Promise.reject("Access Denied: You must be 18 or older.");
//   }
//   return Promise.resolve("Access Granted.");
// }

// // Test the resolved shortcut
// getCachedData()
//   .then((data) => console.log(`Resolve Shortcut Result: ${data}`))
//   .catch((err) => console.error(err));

// // Test the rejected shortcut
// validateAge(15)
//   .then((status) => console.log(status))
//   .catch((errorReason) => console.error(`Reject Shortcut Result: ${errorReason}`));




// Creating a Promise
// const fetchData = new Promise((resolve, reject) => {
//   let success = true; // Simulating a condition
//   if (success) {
//     resolve("Data successfully fetched!"); // Transitions to Fulfilled
//   } else {
//     reject("Error: Could not fetch data."); // Transitions to Rejected
//   }
// });

// // Consuming a Promise
// fetchData
//   .then((result) => console.log(result))  // Runs if fulfilled
//   .catch((error) => console.error(error)) // Runs if rejected
//   .finally(() => console.log("Done."));   // Runs regardless of outcome


// let myPromise = new Promise(function(resolve, reject) {

// // Code that might take some time goes here
//   let success = true;
//   if (success) {
//     resolve("Done");
//   } else {
//     reject("Failed");
//   }
// });
// // Using the Promise
// myPromise.then(
//   function(value) {myDisplayer(value)},
//   function(value) {myDisplayer(value)}
// );
// // Funtion to display any text
// function myDisplayer(text) {
//   return text;
// }

// console.log(myPromise)



////------------ .then()
// const orderPizza = Promise.resolve("Hot Pizza");

// orderPizza.then((food) => {
//   console.log(`Success: Eating ${food}!`);
// });
// console.log(orderPizza)

////-------------- .catch()

// const orderPizza = Promise.reject("Delivery driver crashed!");

// orderPizza.catch((error) => {
//   console.log(`Error caught: ${error}. Making a sandwich instead.`);
// });
// console.log(orderPizza)


////-------------- .finally()
// const orderPizza = Promise.resolve("Hot Pizza");

// orderPizza
//   .then((food) => console.log(food))
//   .catch((error) => console.log(error))
//   .finally(() => console.log("Closing the front door. Done!"));

// console.log(orderPizza)



//-------------Promise Methods

// Setup background tasks for the examples below
const checkFlight = new Promise(res => setTimeout(() => res("Flight booked"), 1000));
const checkHotel  = new Promise(res => setTimeout(() => res("Hotel booked"), 2000));
const checkCar    = new Promise((_, rej) => setTimeout(() => rej("No cars available"), 1500));


////----------- .all()

// Promise.all([checkFlight, checkHotel])
//   .then((results) => console.log("Vacation ready!", results)) // ["Flight booked", "Hotel booked"]
//   .catch((error) => console.log("Trip canceled because:", error));

// Promise.all([checkFlight, checkHotel, checkCar])
//   .catch((error) => console.log(error)); // Logs: "No cars available" (even though flight/hotel worked)


// const promise1 = Promise.resolve(3);
// const promise2 = 42;
// const promise3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, "foo");
// });

// Promise.all([promise1, promise2, promise3]).then((values) => {
//   console.log(values);
// });
// Expected output: Array [3, 42, "foo"]


// const myPromise1 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 200, "King");
// });

// // Create another Promise
// const myPromise2 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, "Queen");
// });

// // Both resolves. Who is faster?
// Promise.all([myPromise1, myPromise2]).then((x) => {
//   myDisplay(x);
// });

// // Funtion to run when a Promise is settled:
// function myDisplay(some) {
//   console.log(some);
// }

//-------------.allSettled()

// Promise.allSettled([checkFlight, checkHotel, checkCar])
//   .then((results) => console.log(results));



// const promise1 = Promise.resolve(3);
// const promise2 = new Promise((resolve, reject) =>
//   setTimeout(reject, 100, "foo"),
// );
// const promises = [promise1, promise2];

// Promise.allSettled(promises).then((results) =>
//   results.forEach((result) => console.log(result.status)),
// );



//------------------.any()

// const expedia = new Promise(res => setTimeout(() => res("Ticket from Expedia"), 2000));
// const kayak   = new Promise(res => setTimeout(() => res("Ticket from Kayak"), 500)); // Fastest success

// Promise.any([expedia, kayak, checkCar])
//   .then((fastestSuccess) => console.log(fastestSuccess)) // Logs: "Ticket from Kayak"
//   .catch((err) => console.log("All sites failed", err));



//-------------.race()

// const serverData = new Promise(res => setTimeout(() => res("Server Data Loaded"), 3000)); // Takes 3 seconds
// const timeout    = new Promise((_, rej) => setTimeout(() => rej("Timeout Error!"), 1000));  // Takes 1 second

// Promise.race([serverData, timeout])
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error)); // Logs: "Timeout Error!" because it was faster



//--------------------------- ASYNC AWAIT

//-----------Instances

// async function handlePizzaOrder() {
//   try {
//     // 1. Replaces .then()
//     const food = await orderPizza(); 
//     console.log(`Success: Eating ${food}!`);
//   } catch (error) {
//     // 2. Replaces .catch()
//     console.log(`Error caught: ${error}. Making a sandwich instead.`);
//   } finally {
//     // 3. Replaces .finally()
//     console.log("Closing the front door. Done!");
//   }
// }

// // Execute the function
// handlePizzaOrder();





