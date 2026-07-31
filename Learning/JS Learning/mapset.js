// Map

// Create an empty Map
//const fruits = new Map();

// // Set Map Values
// fruits.set("apples", 500);
// fruits.set("bananas", 300);
// fruits.set("oranges", 200);

// Create a Map
// const fruits = new Map([
//   ["apples", 500],
//   ["bananas", 300],
//   ["oranges", 200]
// ]);

// console.log(fruits)


// Map Methods

// const serverConfig = new Map();

// // --- Adding Data ---
// serverConfig.set('port', 8080);
// serverConfig.set('environment', 'production');
// serverConfig.set('isSecure', true);

// // Maps can be chained!
// serverConfig.set('timeout', 3000).set('retries', 3).set('name', 'Pranshav');

// console.log(serverConfig)

// // --- Retrieving and Checking ---
// console.log(serverConfig.get('port')); // 8080
// console.log(serverConfig.has('database')); // false

// // --- Deleting ---
// serverConfig.delete('isSecure');
// console.log(serverConfig.has('isSecure')); // false

// // --- Iterating (Loops) ---
// // Using .forEach()
// serverConfig.forEach((value, key) => {
//   console.log(`Config [${key}]: ${value}`);
// });

// // Using for...of with .entries()
// for (const [key, value] of serverConfig.entries()) {
//   console.log(`${key} -> ${value}`);
// }

// // --- Clearing ---
// serverConfig.clear();
// console.log(serverConfig.size); // 0



// WeakMap Methods

// const userSessions = new WeakMap();

// // Keys MUST be objects
// let user1 = { username: 'alice99' };
// let user2 = { username: 'bob_builder' };

// // --- Adding Data ---
// userSessions.set(user1, { token: 'abc-123', loggedInAt: Date.now() });
// userSessions.set(user2, { token: 'xyz-789', loggedInAt: Date.now() });

// console.log(userSessions)

// // --- Retrieving and Checking ---
// console.log(userSessions.has(user1)); // true
// console.log(userSessions.get(user1).token); // "abc-123"

// // --- Deleting ---
// userSessions.delete(user2);
// console.log(userSessions.has(user2)); // false

// // --- The WeakMap Magic ---
// // If user1 logs out and we destroy the object reference:
// user1 = null; 
// // The Garbage Collector will eventually wipe the session data 
// // from userSessions automatically. You don't need to manually delete it!


// const myWeakMap = new WeakMap();
// const obj = { id: 1 };
// myWeakMap.set(obj, "Secret Data");

// console.log(myWeakMap.get(obj));


// Set Methods

const allowedRoles = new Set();

// --- Adding Data ---
allowedRoles.add('admin');
allowedRoles.add('editor');
allowedRoles.add('viewer');

// Adding a duplicate does nothing
allowedRoles.add('admin'); 
console.log(allowedRoles.size); // 3 (admin was not duplicated)

// --- Checking ---
console.log(allowedRoles.has('editor')); // true
console.log(allowedRoles.has('super-admin')); // false

// --- Deleting ---
allowedRoles.delete('viewer');
console.log(allowedRoles.has('viewer')); // false

// --- Iterating ---
for (const role of allowedRoles) {
  console.log(`Role allowed: ${role}`);
}

// --- Converting back to an Array ---
// Very common pattern to remove duplicates from arrays
const roleArray = [...allowedRoles]; 

// --- Clearing ---
allowedRoles.clear();
console.log(allowedRoles.size); // 0



// Weak-set

const processedNodes = new WeakSet();

let domNode1 = { id: 'header' };
let domNode2 = { id: 'footer' };

// --- Adding Data ---
processedNodes.add(domNode1);

// --- Checking ---
console.log(processedNodes.has(domNode1)); // true
console.log(processedNodes.has(domNode2)); // false

// --- Deleting manually ---
processedNodes.delete(domNode1);
console.log(processedNodes.has(domNode1)); // false

// --- The WeakSet Magic ---
processedNodes.add(domNode2);

// If the footer is removed from our application and the reference is lost:
domNode2 = null;
// The memory tracking that domNode2 was processed is safely garbage collected.