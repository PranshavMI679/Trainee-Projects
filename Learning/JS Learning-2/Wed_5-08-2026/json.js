// // let object = {
// //     name: "Trainee",
// //     age: 25,
// //     occupation: "Software Developer",
// //     skills: ["JavaScript", "React", "Node.js"],
// //     address: {
// //         street: "123 Main St",
// //         city: "San Francisco",
// //         state: "CA",
// //         zip: "94105"
// //     },
// //     greet: function() {
// //         console.log(`Hello, my name is ${this.name} and I am a ${this.occupation}.`);
// //     }
// // }

// // console.log(object);

// // let text = JSON.stringify(object);
// // console.log(text);

// // const person = JSON.parse(text);
// // console.log(person);




// const text = '{"name":"John","age":"30"}';

// const person = JSON.parse(text, function(key, value) {
// // Convert the age to a number
//   if (key == "age") {
//     return Number(value);
//   }
// // Return other keys/values unchanged
//   return value;
// });

// console.log(person.age); // 30

// console.log(typeof person.age); // number


const person = {
  name: "John",
  age: 30
};

const text = JSON.stringify(person, function(key, value) {
  if (key == "age") {
    return value + 1;
  }
  return value;
});
console.log(text); // {"name":"John","age":31}