//W3Schools Example

// let cars = ["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi"];

// let text;

// for (let i = 0; i < cars.length; i++) {
//     text = cars[i];
//     console.log(text);
// }


// let i=5

// for (i=0;i <=10 ; i++){
//     console.log(i);
// }

// let i = 0;

// while (i < 10) {
//     text = "The number is " + i;
//     console.log(text);
//     i++;
// }   

// let j = 0;

// do {
//     text = "The number is " + j;
//     console.log(text);
//     j++;
// } while (j !== 10);    

// let text = "";

// for (let i = 0; i < 5; i++) {
//   text = "The number is " + i;
//   console.log(text);
// }


// const cars = ["BMW", "Volvo", "Saab", "Ford"];
// let len = cars.length;

// let text = "";

// for (let i = 2; i < len; i++) {
//   text = cars[i];
// }
// console.log(text);


// var i = 5;

// for (var i = 0; i < 10; i++) {
//   //console.log(i);
// }
// console.log("Outside the loop: " + i);

// let i = 0;
// while (i < 10) {
//   text = "The number is " + i;
//   i++;
//   console.log(text);
// }

// let i = 0;
// do {
//   text = "The number is " + i;
//   i++;
//   console.log(text);
// }
// while (i <= 10);



// Comparing for loop with while loop

// const cars = ["BMW", "Volvo", "Saab", "Ford"];
// let i = 0;
// let text = "";

// for ( ; cars[i]; ) {
//   text = cars[i];
//   i++;
//     console.log(text);
// }

// while (cars[i]) {
//   text = cars[i];
//   i++;
//   console.log(text);
// }


// for (let i = 0; i < 10; i++) {
//   if (i === 3) { 
//     break; 
// }
//   text = "The number is " + i;
//   console.log(text);
// }


// switch (new Date().getDay()) {
//   case 0:
//     day = "Sunday";
//     break;
//   case 1:
//     day = "Monday";
//     break;
//   case 2:
//      day = "Tuesday";
//     break;
//   case 3:
//     day = "Wednesday";
//     break;
//   case 4:
//     day = "Thursday";
//     break;
//   case 5:
//     day = "Friday";
//     break;
//   case 6:
//     day = "Saturday";
// }

// console.log("Today is " + day);

// let y;
// const cars = ['BMW', 'Volvo', 'Mini'];
// for (let x of cars) {
//   y = console.log(x);
// }

// const obj = { a: 1, b: 2, c: 3 };

// for (const prop in obj) {
//   console.log(`${prop} = ${obj[prop]}`);
// }


// const triangle = { a: 1, b: 2, c: 3 };

// function ColoredTriangle() {
//   this.color = "red";
// }

// ColoredTriangle.prototype = triangle;

// const obj = new ColoredTriangle();

// for (const prop in obj) {
//   if (Object.hasOwn(obj, prop)) {
//     console.log(`obj.${prop} = ${obj[prop]}`);
//   }
// }


// const obj = { a: 1, b: 2 };

// for (const prop in obj) {
//   console.log(`obj.${prop} = ${obj[prop]}`);
//   obj.c = 3;
// }


// const array = ["a", "b", "c"];

// for (const element of array) {
//   console.log(element);
// }

// const iterable = [10, 20, 30];

// for (let value of iterable) {
//   value += 1;
//   console.log(value);
// }


//const iterable = [10, 20, 30];
// const iterable = "trainee";

// for (const value of iterable) {
//   console.log(value);
// }

const iterable = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);

for (const entry of iterable) {
  console.log(entry);
}
// ['a', 1]
// ['b', 2]
// ['c', 3]

for (const [key, value] of iterable) {
  console.log(value);
}
// 1
// 2
// 3


//Edabait - easy questions

//Question- Buggy Code (Part 5)

// function printArray(number) {
//   var newArray = [];

//   for(var i = 1; i <= number; i++) {
//     newArray.push(i);
//   }

//   return newArray;
// }


//------------Forbiden Letter
// function forbiddenLetter(char, arr) {
// 	for (let letter of arr){
// 		if (letter.includes(char)){
// 			return false
// 		}
// 	}
// 	return true
// }

//-------------Filter Strings from Array
// function filterArray(arr) {
// 	let arr2 = []
// 	for (let a of arr){
// 		if(Number.isInteger(a)){
// 			arr2.push(a)
// 		}
// 	}
// 	return arr2
// }

//------------Get the Sum of All Array Elements
// function getSumOfItems(arr) {
// 	let sum = 0;
// 	for (let num of arr) {
// 		sum += num; 
// 	}
	
// 	return sum;
// }

//----------Return Types
// function arrayValuesTypes(arr) {
// 	let arr2 = []
// 	for (let val of arr){
// 		let a = typeof val
// 		arr2.push(a)
// 	}
// 	return arr2
// }

//------------True Ones, False Zeros
// function integerBoolean(n) {
// 	let arr =[]
// 	for (let x of n){
// 		arr.push(x == 1 ? true : false)
// 	}
// 	return arr
// }



//------------Resistance
// function seriesResistance(arr) {
// 	let R = 0;
// 	for (let r of arr){
// 		R = R + r
// 	}
// 	let unit = R <= 1 ? "ohm" : "ohms"
// 		return `${R} ${unit}`
// }

//------------Count Instances of a Character in a String
// function charCount(myChar, str) {
// 	let a = 0;
// 	for (let val of str){
// 		if (val === myChar){
// 			a = a + 1
// 		}
// 	}
// 	return a
// }

//-------------Sum of Cubes
// function sumOfCubes(nums) {
// 	let cube = 0;
// 	for (let val of nums){
// 		let c = val ** 3
// 		cube = cube + c
// 	}
// 	return cube
// }

//---------------Is the Average of All Elements a Whole Number?
// function isAvgWhole(arr) {
// 	let a = 0;
// 	for (let val of arr) {
// 		a = a + val;
// 	}
// 	let average = a / arr.length;
// 	return Number.isInteger(average);
// }