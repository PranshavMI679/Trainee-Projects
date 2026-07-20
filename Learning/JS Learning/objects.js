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



// const car = {
//   type: "Fiat",
//   model: "500",
//   color: "white"
// };
// //console.log(car);

// const person = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};

// console.log(person);

// Create an Object
// const person = {};

// // Add Properties
// person.firstName = "John";
// person.lastName = "Doe";
// person.age = 50;
// person.eyeColor = "blue";

// console.log(person);
// // console.log(person.firstName)
// // //let x = person["firstName"]
// // let x = person.firstName
// // console.log(typeof x)

// console.log(firstName + " " + this.lastName)


// const person = {
//   firstName: "John",
//   lastName : "Doe",
//   age      : 50,
//   fullName : function() {
//     return this.firstName + " " + this.lastName;
//   }
// };

//console.log(person)

//const person = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};

//person.age = 22
//delete person.age;
// delete person["age"];

// let x = ("age" in person)

//console.log(x)


// myObj = {
//   name:"John",
//   age:30,
//   myCars: {
//     car1:"Ford",
//     car2:"BMW",
//     car3:"Fiat"
//   }
// }

// console.log(myObj.myCars.car2)

// const person = {
//   firstName: "John",
//   lastName: "Doe",
//   id: 5566,
//   getId: function() {
//     return this.id;
//   }
// };
// //person.getId()
// //let number = person.getId();
// console.log(person.getId())


// const person = {
//   firstName: "John",
//   lastName: "Doe",
//   age: 50,
//   fullName: function() {
//     //return this.firstName + " " + this.lastName;
//     return (this.firstName + " " + this.lastName).toUpperCase();
//   }
// };

// let arr = Object.values(person)

// console.log(arr)


// const fruits = {Bananas:300, Oranges:200, Apples:500};

// //let text = "";
// // for (let [fruit, value] of Object.entries(fruits)) {
// //   text = text + fruit + ": " + value ;
// // }
// let x = JSON.stringify(fruits)
// console.log(x)


// function Person(first, last, age, eye) {
//   this.firstName = first;
//   this.lastName = last;
//   this.age = age;
//   this.eyeColor = eye;
// }

// const myFather = new Person("John", "Doe", 50, "blue");
// Person.prototype.nationality = "Indian";

// console.log(myFather + " is also" + myFather.nationality )


// function Person(first, last, age, eyecolor) {
//   this.firstName = first;
//   this.lastName = last;
//   this.age = age;
//   this.eyeColor = eyecolor;
// }

// const myFather = new Person("John", "Doe", 50, "blue");
// const myMother = new Person("Sally", "Rally", 48, "green");

// myMother.changeName = function (name){
//   this.lastName = name
// }

// myMother.changeName("Doe")

// console.log(myMother.lastName)


// const fruits = {Bananas:300, Oranges:200, Apples:500};

// // let x = JSON.stringify(fruits)
// // console.log(x)

// //let y = JSON.isRawJSON(x)
// console.log(JSON.isRawJSON(fruits))


//---------------Edabit Questions

//----------Upvotes and Downvotes
// function getVoteCount(votes) {
// 	return votes.upvotes - votes.downvotes
// }


//-----------------Lowercase and Uppercase Map
// function mapping(letters) {
// 	return Object.fromEntries(letters.map(letter => [letter, letter.toUpperCase()]));
// }


//-----------------Luke, I Am Your ...
// function relationToLuke(name) {
// 	const relations = {
// 		"Darth Vader": "father",
// 		"Leia": "sister",
// 		"Han": "brother in law",
// 		"R2D2": "droid"
// 	};
// 	return `Luke, I am your ${relations[name]}.`;
// }

//-------------Return the Objects Keys and Values
// function keysAndValues(obj) {
// 	return new Array(Object.keys(obj), Object.values(obj));
// }

//------------Can You Spare a Square?
// function tpChecker(home) {
// 	let a = home.tp * 500
// 	let b = home.people * 57
	
// 	let days = Math.floor(a / b)
// 	return (days >= 14 
// 	 ? `Your TP will last ${days} days, no need to panic!`
// 	 : `Your TP will only last ${days} days, buy more!`)
// }

//-------------Classes For Fetching Information on a Sports Player
// class Player {
// 	constructor(name, age, height, weight) {
// 		this.name = name
// 		this.age = age
// 			this.height = height
// 			this.weight = weight
// 	}
// 	getAge() {
// 		return `${this.name} is age ${this.age}`
// 	}
// 	getHeight() {
// 		return `${this.name} is ${this.height}cm`
// 	}
// 	getWeight() {
// 		return `${this.name} weighs ${this.weight}kg`
// 	}
// }		


//----------Find the Bug: Returning Valid Units of Measure
// function hasValidUnitOfMeasure(product = {}) {
// 	const { unitOfMeasure, comment } = product
// 	return (Boolean(comment) || unitOfMeasure === 'L' || unitOfMeasure === 'PCE')
// }

//