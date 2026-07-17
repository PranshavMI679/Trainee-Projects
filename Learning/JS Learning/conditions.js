//w3school examples

// let hour = 14;
// if (hour < 15) {
//   greeting = "Good day";
//   console.log(greeting);
// }

// let age = 16;
// let text = "You can Not drive";

// if (age >= 18) {
//   text = "You can drive";
// }
// console.log(text);


// let age = 16;
// let country = "USA";
// let text = "You can Not drive!";

// if (country == "USA" && age >= 16) {
//     text = "You can drive!";
//   }

// console.log(text);

// let hour = 20;

// if (hour < 18) {
//   greeting = "Good day";
// } else {
//   greeting = "Good evening";
// }

// if (hour < 18) {
//   greeting = "Good day";
// } else {
//   greeting = "Good evening";
// }


// let time = 22;
// let greetings;

// if (time < 10) {
//   greetings = "Good morning";
// } else if (time < 20) {
//   greetings = "Good day";
// } else {
//   greetings = "Good evening";
// }
// console.log(greetings);



// let text;
// if (Math.random() < 0.5) {
//   text = "<a href='https://w3schools.com'>Visit W3Schools</a>";
// } else {
//   text = "<a href='https://wwf.org'>Visit WWF</a>";
// }
// console.log(text);

// let age = 16;
// let text = (age < 18) ? "Minor" : "Adult";
// console.log(text);

// let isMember = false;
// let discount = isMember ? 0.2 : 0;
// console.log(discount);


// let d = 6;
// switch (d) {
//   case 6:
//     text = "Today is Saturday";
//     break;
//   case 0:
//     text = "Today is Sunday";
//     break;
//   default:
//     text = "Looking forward to the Weekend";
// }
// console.log(text);


// switch (new Date().getDay()) {
//   case 4:
//   case 5:
//     text = "Soon it is Weekend";
//     break;
//   case 0:
//   case 6:
//     text = "It is Weekend";
//     break;
//   default:
//     text = "Looking forward to the Weekend";
// }

// console.log(text);


// let x = 0 ;
// console.log(Boolean(x)); 


// let x = 6;
// let y = 3;
// let z = (x < 10 && y > 1)

// console.log(z);



// let x = 6;
// let y = -3;
// let z = (x > 0 || y > 0)
// console.log(z)


let name = null;
let text;
let result = name ?? text
console.log(result)