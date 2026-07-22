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
// manager.sayHi = sayHi;
// intern.sayHi = sayHi;

// manager.sayHi(); // Hello, my name is Karina
// intern.sayHi(); // Hello, my name is Tyrone

// prototype.sayHi = function() {
//   console.log(`Hello, my name is ${this.name}`);
// };

// manager.sayHi();
// intern.sayHi();



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



//mr_tester2
//tester2@yopmail.com
//tester..679


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


//mrtester4@yopmail.com
//tester..679


//-----------Make a Circle with OOP
// class Circle {
// 	// write your code here
// 	constructor(radius){
// 		this.radius = radius
// 	}
// 	getArea(){return Math.PI * (this.radius ** 2)}
//   getPerimeter(){return (Math.PI * this.radius) *2}
// }

//-------------Get Sum of People's Budget
// function getBudgets(arr) {
// 	let sum = 0
// 	arr.forEach((person) => {
// 		sum = sum + person.budget
// 	})
// 	return sum
// }

//---------------Burglary Series (04): Add its Name
// function addName(obj, name, value) {
// 	return {...obj, [name]: value}
// }

//------------------Rectangle Series 1: Skeleton
// Rectangle Class
// class Rectangle{
// 	constructor(x, y, width, height){
// 		this.x = x
// 		this.y = y
// 		this.width = width
// 		this.height = height
// 	}
// 	toString(){
// 		return `[x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}]`;
// 	}
// }

//-----------------Name Classes
// class Name {
//   constructor(fname, lname) {
//     this.fname = fname.charAt(0).toUpperCase() + fname.slice(1).toLowerCase();
//     this.lname = lname.charAt(0).toUpperCase() + lname.slice(1).toLowerCase();
//   }

//   get fullname() {
//     return `${this.fname} ${this.lname}`;
//   }

//   get initials() {
//     return `${this.fname.charAt(0)}.${this.lname.charAt(0)}`;
//   }
// }

//-------First class, second class, third class levers
// function determineLever(arr) {
// 	const levers = {
// 		'efl': 'first class lever',
// 		'elf': 'second class lever',
// 		'fel': 'third class lever'
// 	}
// 	const key = arr.join('')
// 	return levers[key]
// }

//----------------------------------Burglary Series (20): Sign Your Name
// function signYourName(obj) {
//   // write your code here
// 	// don't use a return statement
// 		if ('yourSignature' in obj) obj.yourSignature = "Whatever";
//     if ('spouseSignature' in obj) obj.spouseSignature = "Nice Try";
	
// 	Object.freeze(obj);
	
//   // DON'T CHANGE OR REMOVE THE LINES BELOW
//   obj.yourSignature = "Whatever";
// 	obj.spouseSignature = "Nice Try"
//   return obj;
// }

//-----------------Printer Levels
// function inkLevels(inks) {
// 	return Math.min(...Object.values(inks))
// }


// const obj1 = {
//   car1: "BMW",
//   model1: "M5"
// }

// const obj2 = {
//   car2: "Audi",
//   model2: "A4"
// }

//---------Longer method
// const arr1 = Object.entries(obj1)
// const arr2 = Object.entries(obj2)

// const arr = arr1.concat(arr2)

// const mainObj = Object.fromEntries(arr)

// console.log(mainObj)

//-----easy method
// const cars = {...obj1, ...obj2}

// console.log(cars)

// Object.values(cars).forEach(val => {
//   console.log(val)
// });



// const myHonda = {
//   color: "red",
//   wheels: 4,
//   engine: { cylinders: 4, size: 2.2 },
// };


// console.log(Object.entries(myHonda))


// function Person(first, last, age, eye) {
//   this.firstName = first;
//   this.lastName = last;
//   this.age = age;
//   this.eyeColor = eye;
// }

// const myFather = new Person('X', 'Z', 50, 'brown');

// console.log('My father age is ' + myFather.age + '.')

// console.log(myFather)



// //.preventExtension
// const car = { brand: "Tesla", color: "Red" };
// Object.preventExtensions(car);

// car.year = 2026;   //  Ignored! Cannot add new properties.
// car.color = "Blue"; //  Works! Can modify existing properties.
// delete car.brand;   //  Works! Can delete existing properties.

// console.log(car); // Output: { color: 'Blue' }

// // .seal()
// const user = { name: "Alice", role: "Admin" };
// Object.seal(user);

// user.age = 25;       //  Ignored! Cannot add.
// delete user.role;    // Ignored! Cannot delete.
// user.role = "User";  // Works! Can modify values.

// console.log(user); // Output: { name: 'Alice', role: 'User' }


// // .freeze()
// const config = { theme: "dark", version: 1.0 };
// Object.freeze(config);

// config.version = 2.0; //  Ignored! Cannot modify.
// config.lang = "en";   //  Ignored! Cannot add.
// delete config.theme;  //  Ignored! Cannot delete.

// console.log(config); // Output: { theme: "dark", version: 1 }




// Animal properties and method encapsulation
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


