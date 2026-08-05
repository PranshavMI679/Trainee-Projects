// const fruits = new Map([
//   ["apples", 500],
//   ["bananas", 300],
//   ["oranges", 200]
// ]);

// console.log(fruits);

// let text = "";
// fruits.forEach (function(value, key) {
//   text = key + ' = ' + value;
//   console.log(text);
// })



// Create an Array
// const fruits = [
//   {name:"apples", quantity:300},
//   {name:"bananas", quantity:500},
//   {name:"oranges", quantity:200},
//   {name:"kiwi", quantity:150}
// ];

// // Callback function to Group Elements
// function myCallback({ quantity }) {
//   return quantity > 200 ? "ok" : "low";
// }

// // Group by Quantity
// const result = Map.groupBy(fruits, myCallback);

// console.log(result);


// const fruits = {
//     0 : "apples",
//     1 : "bananas",
//     2 : "oranges",
//     3 : "kiwi"
// }

// console.log(fruits);



// const coatCheckMap = new Map();

// const guestAlex = { name: "Alex" };
// const guestSarah = { name: "Sarah" };

// // Check in their coats
// coatCheckMap.set(guestAlex, "Heavy Winter Coat");
// coatCheckMap.set(guestSarah, "Leather Jacket");

// console.log(coatCheckMap); // Output: Map(2) { { name: 'Alex' } => 'Heavy Winter Coat', { name: 'Sarah' } => 'Leather Jacket' }

// //  SUCCESS:
// console.log(coatCheckMap.get(guestAlex)); // Output: "Heavy Winter Coat"
// console.log(coatCheckMap.get(guestSarah)); // Output: "Leather Jacket"

// // Instantly see how many items are checked in
// console.log(coatCheckMap.size); // Output: 2



// const coatCheckWeakMap = new WeakMap();

// let guestAlex = { name: "Alex" }; // Guest is at the party

// // Check in the coat
// coatCheckWeakMap.set(guestAlex, "Heavy Winter Coat");

// console.log(coatCheckWeakMap.has(guestAlex)); // Output: true
// console.log(coatCheckWeakMap.get(guestAlex)); // Output: "Heavy Winter Coat"

// // Alex decides to leave the party. We delete his profile reference.
// guestAlex = null; 

//  AUTOMATIC CLEANUP:
// You don't have to write any cleanup code! The computer realizes "guestAlex" 
// no longer exists, and automatically wipes "Heavy Winter Coat" out of the 
// computer's memory to keep your application running fast.



// let safeCache = new WeakMap();
// let user2 = { name: "Blake" };

// safeCache.set(user2, "Secret Session Token Data");
// console.log(safeCache.get(user2)); // Output: "Secret Session Token

// user2 = null; // Wiped out!
// console.log(safeCache.get(user2)); // Output: undefined
// // The WeakMap automatically drops the data. 
// // Memory is reclaimed instantly during the next Garbage Collection cycle.




// Create a Set
const letters = new Set(["a","b","c"]);

// List all entries
let text = "";
letters.forEach (function(value) {
  text = value;
  console.log(text);
})