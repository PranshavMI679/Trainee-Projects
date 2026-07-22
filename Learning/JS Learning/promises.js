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


