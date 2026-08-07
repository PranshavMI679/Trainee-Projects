// --- 1. Creating and Managing a Set ---
// const activeUserIds = new Set();

// activeUserIds.add(101);
// activeUserIds.add(102);
// activeUserIds.add(101); // Duplicate! Ignored automatically.

// console.log(activeUserIds.has(101)); // Output: true
// console.log(activeUserIds.size);     // Output: 2

// // --- 2. Deduplicating an Array in Real Life ---
// const duplicateTags = ["tech", "sales", "tech", "marketing"];
// const uniqueTagsArray = [...new Set(duplicateTags)]; 

// console.log(uniqueTagsArray); // Output: ["tech", "sales", "marketing"]




// const phrases = ["hello world", "javascript is fun"];

// // Using map() gives you a nested array
// const mapped = phrases.map(phrase => phrase.split(" "));
// console.log(mapped); 
// // Output: [ ["hello", "world"], ["javascript", "is", "fun"] ]

// //  Using flatMap() maps AND flattens
// const flatMapped = phrases.flatMap(phrase => phrase.split(" "));
// console.log(flatMapped); 
// // Output: ["hello", "world", "javascript", "is", "fun"]



// const orders = [
//   { userId: 1, cart: ["prod_101", "prod_102"] },
//   { userId: 2, cart: ["prod_103"] },
//   { userId: 3, cart: ["prod_101", "prod_104"] }
// ];

// // Extracts the cart arrays and flattens them into a single list
// const allProducts = orders.flatMap(order => order.cart);

// console.log(allProducts);
// // Output: ["prod_101", "prod_102", "prod_103", "prod_101", "prod_104"]


// const fruits = ["Apple", "Banana", "Cherry", "Date"];

// const items = fruits.slice(1, 3); 

// console.log(items);  // Logs: ["Banana", "Cherry"]
// console.log(fruits); // Logs: ["Apple", "Banana", "Cherry", "Date"] (Unchanged)



// async function getFastestServerData() {
//   try {
//     // Querying redundant data mirrors
//     const fastestData = await Promise.any([
//       fetchFromMirrorA(),
//       fetchFromMirrorB(),
//       fetchFromMirrorC()
//     ]);
//     console.log("Got data from fastest working server:", fastestData);
//   } catch (aggregateError) {
//     console.error("All mirrors failed completely!");
//     console.log(aggregateError.errors); // Array of individual rejection errors
//   }
// }


// let string = "apple,banana,orange"

// let array = string.split(",");
// console.log(array); // Output: ["apple", "banana", "orange"]

// let joinedString = array.join("-");
// console.log(joinedString); // Output: "apple-banana-orange"


const fruits = ["Banana", "Orange", "Apple", "Mango", "Kiwi"];
let newArr = fruits.copyWithin(2, 0, 2);
console.log(newArr); // Output: ["Banana", "Orange", "Banana", "Orange", "Kiwi"]