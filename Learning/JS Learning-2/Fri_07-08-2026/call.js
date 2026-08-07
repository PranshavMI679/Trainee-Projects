// const user1 = { name: "Alice" };
// const user2 = { name: "Bob" };
// const user3 = { name: "Charlie" };


// function greet(greeting, punctuation) {
//   console.log(`${greeting}, my name is ${this.name}${punctuation}`);
// }

// // "this" points to user; arguments passed individually
// greet.call(user1, "Hello", "!"); 
// // Output: Hello, my name is Alice!
// greet.call(user2, "Hi", "."); 
// // Output: Hi, my name is Bob!
// greet.call(user3, "Hey", "!"); 
// // Output: Hey, my name is Charlie!



// Apply


// bind

// console.log("Step 1");

// function sayHello() {
//   console.log("Hello from inside!");
// }

// // call runs IMMEDIATELY here
// sayHello.call(); 

// console.log("Step 2");

// // bind runs IMMEDIATELY here to create 'myBoundFunc'. 
// // It does NOT run sayHello.
// const myBoundFunc = sayHello.bind(); 

// console.log("Step 3");

// // sayHello only runs here because YOU explicitly called the copy
// myBoundFunc(); 

// console.log("Step 4");



// const account = {
//   owner: "Alex",
//   balance: 1000
// };

// function updateBalance(deposit, bonus, currency) {
//   this.balance += (deposit + bonus);
//   console.log(`${this.owner}'s new balance: ${currency}${this.balance}`);
//   return this.balance; // Returns a value
// }

// console.log("--- 1. Using CALL (Immediate / Comma-separated) ---");
// // Arguments are passed one by one. Runs IMMEDIATELY.
// // 'callResult' receives the returned number (1150).
// const callResult = updateBalance.call(account, 100, 50, "$"); 
// console.log(`Result stored in variable: ${callResult}`); 


// console.log("\n--- 2. Using APPLY (Immediate / Array) ---");
// // Arguments are packed in an array. Runs IMMEDIATELY.
// // 'applyResult' receives the returned number (1370).
// const applyResult = updateBalance.apply(account, [200, 20, "$"]); 
// console.log(`Result stored in variable: ${applyResult}`);


// console.log("\n--- 3. Using BIND (Delayed / Pre-loaded or Future args) ---");
// // Does NOT run yet! It creates and returns a brand-new function.
// // 'boundFunction' receives a FUNCTION, not a number.
// const boundFunction = updateBalance.bind(account, 500, 0); 

// console.log("Look! The balance hasn't changed yet because the bound function wasn't executed.");
// console.log(`Type of boundFunction: ${typeof boundFunction}`);

// // We manually execute the copy later, passing the remaining argument ("$")
// console.log("\n-> Now executing the bound function manually:");
// const bindResult = boundFunction("$"); 
// console.log(`Result stored in variable: ${bindResult}`);

//Q-1
// const player = {
//   score: 100,
//   getScore() { return this.score; }
// };

// const totalScore = player.getScore.call(player); // Using call to invoke getScore with player as 'this'
// console.log(totalScore); 


// //Q-2
// const user = { name: "Sam" };
// function greet() { 
//     return `Hi, ${this.name}`; 
// }

// const boundGreet = greet.bind(user);
// console.log(boundGreet.call({ name: "Alex" }));




// const person = {
//   fullName: function() {
//     return this.firstName + " " + this.lastName;
//   }
// }
// const person1 = {
//   firstName:"John",
//   lastName: "Doe"
// }
// const person2 = {
//   firstName:"Mary",
//   lastName: "Doe"
// }

// // This will return "John Doe":
// const fullName1 = person.fullName.call(person1);
// console.log(fullName1);



// const add = (a, b) => a + b;

// // Passing "null" for context (ignored), but arguments work perfectly
// const sum1 = add.call(null, 5, 10);   // Result: 15
// const sum2 = add.apply(null, [5, 10]); // Result: 15

// // Using bind to create a pre-filled "addFive" function
// const addFive = add.bind(null, 5);
// console.log(sum1); // Output: 15
// console.log(sum2); // Output: 15
// console.log(addFive(2)); // Output: 7



// 1. Setup global names for context comparison
// this.name = "Global Window";

// const hero = { name: "Batman" };
// const villain = { name: "Joker" };

// // 2. Define our two test functions
// // A. Regular function: Dynamic (Can be changed/locked)
// function regularLog(tool, vehicle) {
//   console.log(`[Regular] ${this.name} uses ${tool} and drives a ${vehicle}`);
// }

// // B. Arrow function: Lexical (Permanently locked to Global Window scope)
// const arrowLog = (tool, vehicle) => {
//   console.log(`[Arrow] ${this.name} uses ${tool} and drives a ${vehicle}`);
// };

// // ==========================================
// // 🚀 SCENARIO 1: Testing call()
// // ==========================================
// console.log("--- TESTING CALL ---");

// // Regular: "this" shifts successfully to 'hero'
// regularLog.call(hero, "Batarang", "Batmobile");
// // ➔ Output: [Regular] Batman uses Batarang and drives a Batmobile

// // Arrow: "this" stays 'Global Window'. 'hero' is ignored, but arguments work!
// arrowLog.call(hero, "Batarang", "Batmobile");
// // ➔ Output: [Arrow] Global Window uses Batarang and drives a Batmobile


// // ==========================================
// // 📦 SCENARIO 2: Testing apply()
// // ==========================================
// console.log("\n--- TESTING APPLY ---");

// // Regular: "this" shifts successfully to 'villain'
// regularLog.apply(villain, ["Laugh Gas", "Joker Mobile"]);
// // ➔ Output: [Regular] Joker uses Laugh Gas and drives a Joker Mobile

// // Arrow: "this" stays 'Global Window'. 'villain' is ignored, but array arguments unpack perfectly!
// arrowLog.apply(villain, ["Laugh Gas", "Joker Mobile"]);
// // ➔ Output: [Arrow] Global Window uses Laugh Gas and drives a Joker Mobile


// // ==========================================
// // 🔒 SCENARIO 3: Testing bind()
// // ==========================================
// console.log("\n--- TESTING BIND ---");

// // Regular: Creates a new function and permanently LOCKS "this" to 'hero'
// const lockedRegular = regularLog.bind(hero);
// lockedRegular("Smoke Bomb", "Batcycle");
// // ➔ Output: [Regular] Batman uses Smoke Bomb and drives a Batcycle

// // Arrow: Returns a new function, but completely IGNORES the attempt to lock "this" to 'hero'
// const lockedArrow = arrowLog.bind(hero);
// lockedArrow("Smoke Bomb", "Batcycle");
// // ➔ Output: [Arrow] Global Window uses Smoke Bomb and drives a Batcycle



// // 1. Setup a global name variable for context fallback
// this.name = "Global Window Scope";

// // 2. The target object that wants to BORROW methods
// const civilian = {
//   name: "Bruce Wayne"
// };

// // 3. The owner object that HAS the methods
// const superhero = {
//   name: "Batman",
  
//   // A. Regular Method: Dynamic "this". Can be borrowed seamlessly.
//   regularGreet: function(gadget, vehicle) {
//     console.log(`[Regular Method] ${this.name} grabs a ${gadget} and jumps into the ${vehicle}.`);
//   },
  
//   // B. Arrow Method: Lexical "this". Bound to where superhero was defined (Global).
//   arrowGreet: (gadget, vehicle) => {
//     console.log(`[Arrow Method] ${this.name} grabs a ${gadget} and jumps into the ${vehicle}.`);
//   }
// };

// // ==========================================
// // 🚀 SCENARIO 1: Borrowing via call()
// // ==========================================
// console.log("--- BORROWING WITH CALL ---");

// // Success: civilian successfully borrows regular method; "this" becomes "Bruce Wayne"
// superhero.regularGreet.call(civilian, "Grapple Gun", "Batmobile");
// // ➔ Output: [Regular Method] Bruce Wayne grabs a Grapple Gun and jumps into the Batmobile.

// // Failure: civilian tries to borrow arrow method; "this" remains stuck on Global Window
// superhero.arrowGreet.call(civilian, "Grapple Gun", "Batmobile");
// // ➔ Output: [Arrow Method] Global Window Scope grabs a Grapple Gun and jumps into the Batmobile.


// // ==========================================
// // 📦 SCENARIO 2: Borrowing via apply()
// // ==========================================
// console.log("\n--- BORROWING WITH APPLY ---");

// // Success: civilian borrows regular method using an array of arguments
// superhero.regularGreet.apply(civilian, ["Batarang", "Batwing"]);
// // ➔ Output: [Regular Method] Bruce Wayne grabs a Batarang and jumps into the Batwing.

// // Failure: civilian tries to borrow arrow method; array unpacks fine, but context is ignored
// superhero.arrowGreet.apply(civilian, ["Batarang", "Batwing"]);
// // ➔ Output: [Arrow Method] Global Window Scope grabs a Batarang and jumps into the Batwing.


// // ==========================================
// // 🔒 SCENARIO 3: Borrowing and Locking via bind()
// // ==========================================
// console.log("\n--- BORROWING AND LOCKING WITH BIND ---");

// // Success: Returns a new function copy, permanently LOCKING "this" to civilian
// const boundRegularBorrow = superhero.regularGreet.bind(civilian);
// boundRegularBorrow("Smoke Bomb", "Batcycle");
// // ➔ Output: [Regular Method] Bruce Wayne grabs a Smoke Bomb and jumps into the Batcycle.

// // Failure: Returns a new function copy, but completely IGNORES the lock to civilian
// const boundArrowBorrow = superhero.arrowGreet.bind(civilian);
// boundArrowBorrow("Smoke Bomb", "Batcycle");
// // ➔ Output: [Arrow Method] Global Window Scope grabs a Smoke Bomb and jumps into the Batcycle.




// The standard shopping cart template
const standardCart = {
  taxRate: 0.08,
  calculateTotal(subtotal, deliveryFee) {
    const tax = subtotal * this.taxRate;
    return subtotal + tax + deliveryFee;
  }
};

// A VIP user who has a completely different object structure and a lower tax rate
const vipUser = {
  name: "Alex Jones",
  taxRate: 0.02 // VIP perk: Lower internal tax bracket
};

// VIP borrows standardCart's method. 'this' inside calculateTotal points to vipUser!
const totalForVIP = standardCart.calculateTotal.call(vipUser, 100, 15);

console.log(totalForVIP); // Output: 117 (100 + 2% tax + 15 delivery)
