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



const fruits = ["Banana", "Orange", "Apple", "Mango"];
//console.log(fruits.join("-"))
//let fruit = fruits.shift();
console.log(fruits);

let fruit = fruits.unshift("Lemon");

console.log(fruits)




