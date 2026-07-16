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

const fruits = ["Banana", "Orange", "Apple", "Mango"];

let myList = fruits.toString();
console.log(myList); // Output: "Banana,Orange,Apple,Mango"