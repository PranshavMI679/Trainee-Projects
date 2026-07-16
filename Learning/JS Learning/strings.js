// // let text = "probation";
// // let length = text.length;

// // console.log(length);

// // let text2 = "Hello \"Pranshav\"!";

// // console.log(text2);

// // let x = "john";
// // let y = new String("john");
// // let z = String("john");

// // console.log(typeof x); // string
// // console.log(typeof y); // object
// // console.log(typeof z); // string

// // let text = `My name is ${x}`;
// // console.log(text);

// let price = 10;
// let VAT = 0.25;

// let total = `Total: ${(price * (1 + VAT)).toFixed(2)}`;
// console.log(total);


// let header = "Template Strings";
// let tags = ["template strings", "javascript", "es6"];

// let html = `<h2>${header}</h2><ul>`;

// for (const x of tags) {
//   html += `<li>${x}</li>`;
// }

// html += `</ul>`;
// console.log(html);

// let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// let length = text.length;

// console.log(length);

// let text2 = "Hello World!";
// //let char = text2.charAt(4);
// //let char = text2.at(4);
// let char = text2.charCodeAt(4);
// console.log(char);

// //let text3 = "o"
// //let char1 = text3.charCodeAt(0);
// let char2 = String.fromCharCode(111);
// console.log(char2);

//let text = "HELLO WORLD";
//t code = text.codePointAt(0);
//let char = text.at(-2);
//console.log(code);
//let char = text[0];

//console.log(char);

// let text1 = "Hello";
// let text2 = "World";
// let text3 = text1.concat(" ", text2);

// console.log(text3);

// let x = "JavaScript, HTML, CSS";
// let y = x.slice(0, 10);
// let z = x.substring(0, 10);
// console.log(y);
// console.log(z);
// let a = x.substr(0, 10);
// console.log(a);

// let text = "Hello world \uD800";
// let result = text.isWellFormed();
// let result2 = text.toWellFormed();

// console.log(result);
// console.log(result2);

// let text1 = "      Hello World!      ";
// let text2 = text1.trim();

// //console.log(text2);

// let x = "Hello World!";
// //let y = x.trimStart();
// let z = x.replace(" ", "");
// console.log(z);


// let text = "Hello world! ";
// let result = text.repeat(2);

// console.log(result);


// let text = "Please visit Microsoft and Microsoft!";
// let newText = text.replace(/Microsoft/g, "W3Schools");
// console.log(text);
// console.log(newText);


// let text = "Hi fox!";
// let arr = text.split("");
// //console.log(arr);

// let newArr = [...text];
// console.log(newArr);


//let text = "Please Locate where 'locate' occurs!";
//let index = text.lastIndexOf("locate", 22);

//let search = text.search("locate");
//let search2 = text.search(/locate/);

//console.log(index);
//console.log(search);
//console.log(search2);

//let match = text.match(/locate/ig);
//console.log(match);

//const iterator = text.matchAll("locate");
//console.log(iterator);

// let text = "I love cats. Cats are very easy to love. Cats are very popular."
// const iterator = text.matchAll(/Cats/ig);
// const matches = [...iterator];

// //console.log(matches);

// const include = text.includes("Cats");
// console.log(include);

// const start = text.includes("Cats",8);
// console.log(start);

// let a = "hello world";
// console.log(a.strike());


// let b = String.fromCharCode(72, 69, 76, 76, 79);
// console.log(b);


// for (let i = 0; ; i++) {
//   console.log(i);
//   if (i > 3) break;
//   // more statements
// }

// let energy = 2;

// do {
//     console.log("This runs exactly once, even though energy is 0!");
// } while (energy > 3);
// Output:
// This runs exactly once, even though energy is 0!


// Example syntax
const report = "Page 1 Data\r\nPage 2 Data";

console.log(report);




