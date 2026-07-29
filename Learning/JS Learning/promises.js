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
//const checkFlight = new Promise(res => setTimeout(() => res("Flight booked"), 1000));
//const checkHotel  = new Promise(res => setTimeout(() => res("Hotel booked"), 2000));
//const checkCar    = new Promise((_, rej) => setTimeout(() => rej("No cars available"), 1500));


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



// async function processOrder() {
//   try {
//     const message = await checkStock("laptop");
//     console.log(message); // Logs: "Item is in stock!"
//   } catch (error) {
//     console.error(error.message); // Catches the rejected promise error
//   }
// }

// processOrder();


// const promise = new Promise(function(resolve, reject) {
//   const success = true;

//  if (success) {
//     resolve("Operation completed");
//  } else {
//     reject("Operation failed");
//   }
// });

// promise
// .then(function(value) {
//   myDisplayer(value);
// })
// .catch(function(error) {
//   myDisplayer(error);
// });

// function myDisplayer(text){
//     console.log(text)
// }


// Step 1: Create a function that returns a Promise
// function verifyInventory(item) {
//   return new Promise((resolve, reject) => {
//     console.log("Checking stock...");
    
//     setTimeout(() => {
//       const inStock = item === "laptop";

//       if (inStock) {
//         resolve("Item available!"); // Moves state from pending -> fulfilled
//       } else {
//         reject(new Error("Out of stock")); // Moves state from pending -> rejected
//       }
//     }, 1500); // Simulates database latency
//   });
// }

// // Step 2: Consume the Promise using chaining
// verifyInventory("laptop")
//   .then((message) => {
//     console.log("Success:", message); 
//   })
//   .catch((error) => {
//     console.error("Error:", error.message);
//   })
//   .finally(() => {
//     console.log("Inventory check completed."); // Always runs
//   });




// const fetchUserData = new Promise((resolve, reject) => {
//   let success = true; // Simulating an operation outcome

//   setTimeout(() => {
//     if (success) {
//       resolve({ id: 101, name: "Alice" }); // Changes state to Fulfilled
//     } else {
//       reject("User data could not be retrieved."); // Changes state to Rejected
//     }
//   }, 1500);
// });

// fetchUserData
//   .then((data) => {
//     console.log("Success:", data.name);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   })
//   .finally(() => {
//     console.log("Operation finished.");
//   });



//------------Checking  Promises
// const promise = new Promise((resolve) => {
//   console.log("1: Sync Setup"); // RUNS INSTANTLY
//   resolve();
// });
// promise.then(() => {
//   console.log("3: Async Callback"); // RUNS LATER
// });
// console.log("2: Sync End"); // RUNS INSTANTLY


//--------------Checking Async Await
// async function myTask() {
//   console.log("1: Sync execution"); // RUNS INSTANTLY
//   await null; 
//   console.log("3: Async execution"); // RUNS LATER
// }
// myTask();
// console.log("2: Global Sync code"); // RUNS INSTANTLY



// async function homeRoutine(){
//   try {
//     await Promise.all([turnOnGeyser(), turnOnToaster()]);
//     await makeBreakfast();
// }
// catch(error){
//   console.log("power tripped", error)
// }
// }



// Simulating an asynchronous action that takes 2 seconds
// function turnOnGeyser() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("Geyser is hot!");
//       resolve("Geyser Done");
//     }, 2000);
//   });
// }

// // Simulating an asynchronous action that takes 1 second
// function turnOnToaster() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("Toast is ready!");
//       resolve("Toaster Done");
//     }, 1000);
//   });
// }

// // Simulating the final step that takes 1.5 seconds
// function makeBreakfast() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("Breakfast is served!");
//       resolve("Breakfast Done");
//     }, 1500);
//   });
// }

// // Your Async/Await Function
// async function homeRoutine() {
//   try {
//     console.log("Starting morning routine...");
//     // Both start running together right here
//     await Promise.all([turnOnGeyser(), turnOnToaster()]);
//     // This runs only after BOTH the geyser and toaster finish
//     await makeBreakfast(); 
//     console.log("Routine finished successfully!");
//   } 
//   catch (error) {
//     console.log("Power tripped!", error);
//   }
// }
// // Execute the function
// homeRoutine();


// setTimeout(myFunction, 3000);

// function myFunction() {
//   console.log("Helloooo");
// }

//myFunction()



// fetch("fetch.txt")
// .then(function(response) {
//   return response.text();
// })
// .then(function(text) {
//   myDisplayer(text);
// })
// .catch(function(error) {
//   myDisplayer(error);
// });
// function myDisplayer(text) {
//   console.log(text);
// }


// const promise = new Promise(function(resolve, reject) {
//   const success = false;

//  if (success) {
//     resolve("Operation completed");
//  } else {
//     reject("Operation failed");
//   }
// });

// promise.then(function(value) {
//   myDisplayer(value);
// })
// .catch(function(error) {
//   myDisplayer(error);
// });

// function myDisplayer(text) {
//   console.log(text);
// }


// 📦 You ordered the package (Promise is created and pending)
// const orderData = new Promise((resolve) => {
//   setTimeout(() => {
//     resolve("New Smartphone");
//   }, 2000);
// });

// // If you stop here, the package arrives at your doorstep, 
// // but you never open the box. The data is unusable.

// orderData
//   .then((package) => console.log("Unboxed:", package)) // "Unboxed: 🎁 New Smartphone"
//   .catch((err) => console.error("Delivery failed:", err));

// async function openPackage() {
//   const package = await orderData;
//   console.log("Unboxed:", package);
// }
// openPackage();



// 1. CREATION (A simple number verification promise)
// function checkEvenNumber(number) {
//   return new Promise((resolve, reject) => {
//     if (number % 2 === 0) {
//       resolve("Success: The number is even.");
//     } else {
//       reject("Error: The number is odd.");
//     }
//   });
// }

// // 2. CONSUMPTION (Using Async / Await)
// async function runTests() {
//   // Test Case A: Success Path
//   try {
//     const result = await checkEvenNumber(4);
//     console.log(result); 
//   } catch (error) {
//     console.log(error);
//   }

//   // Test Case B: Error Path
//   try {
//     const result = await checkEvenNumber(7);
//     console.log(result);
//   } catch (error) {
//     console.log(error); // This block runs instead
//   }
// }

// runTests();


// async function checkAge(age) {
//   if (age < 18) {
//     // This instantly rejects the promise with a rich stack trace
//     throw new Error("You must be 18 or older."); 
//   }
//   return "Access Granted"
// }

// // Consuming it
// try {
//   const statusMessage = await checkAge(10);
//   console.log(statusMessage)
// } catch (error) {
//   console.error(error.message); // "You must be 18 or older."
//   console.error(error.stack);   // Shows exactly where the error happened
//}



// function getSecretData() {
//   return new Promise((resolve) => {
//     resolve("Top Secret Code");
//   });
// }

// // 1. You run the function and save the promise to a variable
// const trappedResult = getSecretData();

// // 2. You try to print the variable directly
// console.log(trappedResult); 
// // Option A: Pull it out using .then()
// trappedResult.then(data => console.log("Extracted:", data));

// // Option B: Pull it out using await inside an async function
// const data = await trappedResult;
// console.log("Extracted:", data);

// // Step 2: Consume the Promise using chaining
// verifyInventory("laptop")
//   .then((message) => {
//     console.log("Success:", message); 
//   })
//   .catch((error) => {
//     console.error("Error:", error.message);
//   })
//   .finally(() => {
//     console.log("Inventory check completed."); // Always runs
//   });



//   console.log("Start");

// setTimeout(function cb(){
//     console.log("Callback");
// }, 5000);

// console.log("End");

// let startDate = new Date().getTime();
// let endDate = startDate;
// while(endDate < startDate + 10000){
//     endDate = new Date().getTime();
// }

// console.log("While Expires");




// Simulates checking database credentials
function checkUserLogin(username, password) {
  return new Promise((resolve, reject) => {
    console.log("Connecting to authentication server...");

    setTimeout(() => {
      // Setup structural pass/fail criteria
      if (username === "admin" && password === "secret123") {
        resolve({ userId: 101, role: "Administrator", token: "xyz_987" }); // Changes state to Fulfilled
      } else {
        reject(new Error("Authentication failed: Invalid username or password.")); // Changes state to Rejected
      }
    }, 1500); // 1.5-second network delay
  });
}

function runWithChaining() {
  console.log("--- Starting .then/.catch Demo ---");

  // Scenario A: Simulating Success
  checkUserLogin("admin", "secret123")
    .then((userData) => {
      console.log("Success (.then): User logged in!", userData);
    })
    .catch((error) => {
      console.error("Error (.catch):", error.message);
    })
    .finally(() => {
      console.log("Cleanup (.finally): Connection closed for Success Demo.");
    });

  // // Scenario B: Simulating Failure
  // checkUserLogin("wrong_user", "wrong_pass")
  //   .then((userData) => {
  //     console.log("Success (.then):", userData);
  //   })
  //   .catch((error) => {
  //     console.error("Error (.catch):", error.message);
  //   })
  //   .finally(() => {
  //     console.log("Cleanup (.finally): Connection closed for Failure Demo.\n");
  //   });
}

// Execute the chaining demonstration
runWithChaining();



// Promise.allSettled{
//   settimout = 1 sec
//   console.log
//   settimeout = 2 sec

// }