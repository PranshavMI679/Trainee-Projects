// const person = {
//   firstName: "John",
//   lastName: "Doe",
//   age: 50,
//   fullName: function() {
//     return this.firstName + " " + this.lastName;
//   }
// };

// console.log(person.fullName()); // Output: "John Doe"


// const person = {
//   firstName: "John",
//   lastName: "Doe",
//   id: 5566,
//   getId: function() {
//     return this.id;
//   }
// };

// let number = person.getId()
// console.log(number) // Output: 5566


// const person = {
//   firstName: "John",
//   lastName: "Doe",
//   id: 5566,
// };
// // Add a Method
// person.name = function() {
//   return (this.firstName + " " + this.lastName).toUpperCase();
// };
// console.log("My name is " + person.name()); // Output: "My name is JOHN DOE"


// function myFunction() {
//   return this;
// }
// console.log(myFunction()); // Output: Window object (in browsers) or global object (in Node.js)



// const person = {
//   name: "John",
//   age: 30,
//   city: "New York"
// };

// let text = person;
// console.log(text) // Output: { name: 'John', age: 30, city: 'New York' }

// let keys = Object.keys(person);
// console.log(keys)

// let values = Object.values(person);
// console.log(values) // Output: [ 'John', 30, 'New York' ]

// let entries = Object.entries(person);
// console.log(entries) // Output: [ [ 'name', 'John' ], [ 'age', 30 ], [ 'city', 'New York' ] ]   

// let flatArr = entries.flat();
// console.log(flatArr) // Output: [ 'name', 'John', 'age', 30, 'city', 'New York' ]


// let data = JSON.stringify(person);
// console.log(data) // Output: {"name":"John","age":30,"city":"New York"}

// let arr = [1,2,3,4,5]
// let rest = {...arr}
// console.log(rest) 

// let spread = {...person}
// console.log(spread) // Output: { name: 'John', age: 30, city: 'New York' }

const person = {
  firstName: "John",
  lastName: "Doe"
};

let result = ("firstName" in person);
console.log(result)
