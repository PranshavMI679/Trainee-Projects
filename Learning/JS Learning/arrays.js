// // const cars = new Array("Saab", "Volvo", "BMW");

// // const vehicle = JSON.stringify(cars);

// // console.log(cars);
// // console.log(vehicle);


// // const priceCalculations = [
// //     (price) => price + 5,      
// //     (price) => price * 1.15,  
// //     (price) => price - 10      
// // ];

// // let finalPrice = 100;
// // for (const calculate of priceCalculations) {
// //     finalPrice = calculate(finalPrice); 
// // }
// // console.log(finalPrice); // Output: 110.75


// // const shoppingList = ['Eggs', 'Milk', 'Bread', 'Apples'];

// // shoppingList.forEach(item => {
// //     console.log(`Remember to buy: ${item}`);
// // });

// // const checklist = shoppingList.map(item => {
// //     return {
// //         name: item,
// //         isCompleted: false
// //     };
// // });

// // console.log(checklist);

// //let x = "";

// // const myObj = {
// //   name: "John",
// //   age: 30,
// //   cars: [
// //     {name:"Ford", models:["Fiesta", "Focus", "Mustang"]},
// //     {name:"BMW", models:["320", "X3", "X5"]},
// //     {name:"Fiat", models:["500", "Panda"]}
// //   ]
// // }

// // for (let i in myObj.cars) {
// //   x += myObj.cars[i].name;
// //   console.log(myObj.cars[i].name);
// //   for (let j in myObj.cars[i].models) {
// //     x += myObj.cars[i].models[j];
// //     console.log(myObj.cars[i].models[j]);
// //   }
// // }


// let x = new Array(3);
// let y = [1, 2, 3, 4, 5];

// console.log(x);
// console.log(y);

// const fruits = ["Banana", "Orange", "Apple", "Mango"];

// let myList = fruits.toString();
// console.log(myList); // Output: "Banana,Orange,Apple,Mango"


//const cars = ["Saab", "Volvo", "BMW"];
//let car = cars[0];
//console.log(car)

// cars[0] = "Audi";
// console.log(cars)

// let y = cars.toString();
// console.log(y)

// let z = cars;
// console.log(z);

// let text = JSON.stringify(cars);
// console.log(text);


// const person = ["John", "Doe", 46];
// console.log(typeof person);
// console.log(person.length);
// let x = person.sort;
// console.log(x);
// console.log(person[0])
// console.log(person[person.length - 1])


//const person = {firstName:"John", lastName:"Doe", age:46};
//console.log(person.firstName);


// const fruits = ["Banana", "Orange", "Apple", "Mango"];
// let fLen = fruits.length;

// let text = "";
// for (let i = 0; i < fLen; i++) {
//   text = fruits[i];
//   console.log(text);
// }


// const fruits = ["Banana", "Orange", "Apple", "Mango"];

// console.log(typeof fruits);
// console.log(Array.isArray(fruits));
// console.log(fruits instanceof Array);

// let text = "";
// fruits.forEach(myFunction);
// text = "";

// function myFunction(value) {
//   text = " " + value + "";
//   console.log(text);
// }

//fruits.push("Lemon")
//fruits.pop("Mango")
//fruits[fruits.length] = "Kiwi"
//fruits[6] = "Cherry"
//console.log(fruits);


// const person = [];
// person["firstName"] = "John";
// person["lastName"] = "Doe";
// person["age"] = 46;
// console.log(person.length);     // Will return 0
// console.log(person[0]);  



// const myObj = {
//   name: "John",
//   age: 30,
//   cars: [
//     {name:"Ford", models:["Fiesta", "Focus", "Mustang"]},
//     {name:"BMW", models:["320", "X3", "X5"]},
//     {name:"Fiat", models:["500", "Panda"]}
//   ]
// }
// let x;

// for (let i in myObj.cars) {
//   x = " " + myObj.cars[i].name + " " ;
//         console.log(x)

//   for (let j in myObj.cars[i].models) {
//     x = myObj.cars[i].models[j];
//         console.log(x)
//   }

// }



// const fruits = ["Banana", "Orange", "Apple", "Mango"];
// //console.log(fruits.join("-"))
// //let fruit = fruits.shift();
// console.log(fruits);

// let fruit = fruits.unshift("Lemon");

// console.log(fruits)




// Edabit questions

// -----Convert All Array Items to String
//-------Similar Bread
//---------50-30-20 Strategy
//--------Less Than, Greater Than
//----------Check if an Array Contains a Given Number
//------Find the Index (Part #2)


//-------------Converting Objects to Arrays
// function toArray(obj) {
// 	return Object.entries(obj)
//}

//---------------Conveinience Store
// function changeEnough(change, amountDue) {
//   let quarters = change[0] * 0.25
//   let dime = change[1] * 0.10
//   let nikel = change[2] * 0.05
//   let penny = change[3] * 0.01
//   let haveChange = quarters + dime + nikel + penny
//   if (haveChange >= amountDue ? true : false)  
// }

//-----------Concatenate Variable Number of Input Arrays
// function concat(...args) {
// 	return args.flat()
// }

//------------Jackpot
// function testJackpot(result) {
//   return result.every((val) => val === result[0]);	
// }

// const numbers = [];

// // Purpose: Just print them out
// numbers.forEach(num => console.log(num * 2)); 
// // Output: 2, 4, 6

// const result = numbers.forEach(num => num * 2);
// console.log(result); // Output: undefined 🚨 (It returns nothing!)



// let numbers = [];

// // Purpose: Multiply every number by 10 and keep the results
// let doubled = numbers.map(num => num * 10);

// console.log(doubled); // Output: [10, 20, 30] ✅ (Brand new array)
// console.log(numbers); // Output: [1, 2, 3]     (Original remains safe)




const orderItems = [
  { item: "Burger", price: 12, quantity: 2 },
  { item: "Fries", price: 5, quantity: 1 },
  { item: "Soda", price: 3, quantity: 3 }
];

// ✅ Correct: We capture a BRAND NEW array of identical length
const receiptLines = orderItems.map(line => {
  return `${line.quantity}x ${line.item} ($${line.price * line.quantity})`;
});

console.log(receiptLines);
/* Output a fresh array of strings:
[
  "2x Burger ($24)",
  "1x Fries ($5)",
  "3x Soda ($9)"
]
*/

// ✅ Correct: We crush the array down into a single final numerical value
// The '0' at the very end is our starting point (initial accumulator value)
const grandTotal = orderItems.reduce((runningTotal, line) => {
  const lineCost = line.price * line.quantity;
  return runningTotal + lineCost;
}, 0);

console.log(grandTotal); 
// Output: 38 (A single number)


// // ✅ Correct: No variable captures this. It returns undefined. 
// // It simply runs a fire-and-forget operation for every item.
// orderItems.forEach(line => {
//   // Simulating a database update query
//   decreaseInventoryInDatabase(line.item, line.quantity); 
//   console.log(`Inventory reduced: ${line.quantity} units of ${line.item}.`);
// });

// /* Output:
//    Inventory reduced: 2 units of Burger.
//    Inventory reduced: 1 units of Fries.
//    Inventory reduced: 3 units of Soda.
// */



const names = ["Alice", "Bob", "Charlie"];

// Just print each name out to the screen
names.forEach(name => console.log("Hello " + name));

/* Output:
   Hello Alice
   Hello Bob
   Hello Charlie
*/
