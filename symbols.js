// const sym1 = Symbol('id');
// const sym2 = Symbol('id');

// console.log(sym1 === sym2); // Output: false (They are entirely unique)

// const user = {
//     name: "John",
//     [sym1]: 12345 // This property is safely hidden from standard Object.keys() loops
// };




// const userSchema = {
//     username: "dev_node",
//     role: "admin"
// };

// // Imagine we want to attach a temporary socket ID or a unique DB identifier 
// // for internal tracking, but we don't want it exposed when we loop through the object.
// const internalId = Symbol("db_id");
// userSchema[internalId] = "60d5ecb54b123";

// // 1. No Collision Risk:
// console.log(userSchema[internalId]); // "60d5ecb54b123"

// // 2. Hidden from standard iteration:
// console.log(Object.keys(userSchema)); 
// // Output: ["username", "role"] (The Symbol is hidden!)

// for (let key in userSchema) {
//     console.log(key); // Only prints "username" and "role"
// }

// // 3. Serializing safely:
// console.log(JSON.stringify(userSchema)); 
// // Output: {"username":"dev_node","role":"admin"} (Symbols are ignored in JSON!)

// console.log(Object.getOwnPropertySymbols(userSchema))



// const sym1 = Symbol();
// const sym2 = Symbol("foo");
// const sym3 = Symbol("foo");

// console.log(Symbol("foo") === Symbol("foo")); // false

// const sym = Symbol("foo");
// typeof sym; // "symbol"
// const symObj = Object(sym);
// typeof symObj; // "object"


// console.log(Symbol.for("bar") === Symbol.for("bar"));
// // Expected output: true

// console.log(Symbol("bar") === Symbol("bar"));
// // Expected output: false

// const symbol1 = Symbol.for("foo");

// console.log(symbol1.toString());
// // Expected output: "Symbol(foo)"

// Creating a global symbol
const globalSym = Symbol.for('app.database.connection');
const anotherRef = Symbol.for('app.database.connection');

console.log(globalSym === anotherRef); // true

// Retrieving the key
console.log(Symbol.keyFor(globalSym)); // 'app.database.connection'