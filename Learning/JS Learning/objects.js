// // const myHonda = {
// //   color: "red",
// //   wheels: 4,
// //   engine: { cylinders: 4, size: 2.2 },
// // };

// // console.log(myHonda); // red`


// // Animal properties and method encapsulation
// const animalProto = {
//   type: "Invertebrates", // Default value of properties
//   displayType() {
//     // Method which will display the type of animal
//     console.log(this.type);
//   },
// };

// // Create a new animal type called `animal`
// const animal = Object.create(animalProto);
// animal.displayType(); // Logs: Invertebrates

// // Create a new animal type called fish
// const fish = Object.create(animalProto);
// fish.type = "Fishes";
// fish.displayType(); // Logs: Fishes

// const myCar = {
//   make: "Ford",
//   model: "Mustang",
//   year: 1969,
// };

// console.log(myCar.make);
// console.log(myCar.model);
// console.log(myCar.year);

// function makeUser(name, age) {
//   return {
//     name: name,
//     age: age,
//   };
// }

// let user = makeUser("John", 30);
// console.log(user.name); 
// console.log(user.age); 

// let user = {
//   name: "John",
//   age: 30,
//   isAdmin: true
// };

// for (let key in user) {
//   // keys
//   console.log( key );  // name, age, isAdmin
//   // values for the keys
//   console.log( user[key] ); // John, 30, true
// }

// let user = {
//   name: "John",
//   age: 30,
//   isAdmin: true
// };

// console.log( user.name ); // John
// console.log( user.age ); // 30
// console.log( user.isAdmin ); // true

// const myObj = { a: 5, b: 12 };

// // Removes the a property, leaving myObj with only the b property.
// delete myObj.a;
// console.log("a" in myObj); // false
// console.log(myObj);


// const manager = {
//   name: "Karina",
//   age: 27,
//   job: "Software Engineer",
// };
// const intern = {
//   name: "Tyrone",
//   age: 21,
//   job: "Software Engineer Intern",
// };

// function sayHi() {
//   console.log(`Hello, my name is ${this.name}`);
// }

// Add sayHi function to both objects
manager.sayHi = sayHi;
intern.sayHi = sayHi;

manager.sayHi(); // Hello, my name is Karina
intern.sayHi(); // Hello, my name is Tyrone

prototype.sayHi = function() {
  console.log(`Hello, my name is ${this.name}`);
};

manager.sayHi();
intern.sayHi();