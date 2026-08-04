// const numbers = [1, 2, 3];
// const doubleTracker = []; // An external array

// numbers.forEach(num => {
//   doubleTracker.push(num * 2); // Manually creating a side-effect
// });

// console.log(doubleTracker); // Output: [2, 4, 6]
// console.log(typeof doubleTracker); // Output: object



// const profiles = [
//   { id: 1, username: 'tech_guru', bio: '...' },
//   { id: 2, username: 'code_newbie', bio: '...' }
// ];

// // Extract just the usernames into a new list
// console.log(profiles.map(user => `@${user.username}`));

// console.log(userHandles); // ["@tech_guru", "@code_newbie"]




// const prices = [5,10,15];

// const forcedFilter = prices.filter(num => num * 2);
// console.log(forcedFilter); // Output: [10, 20, 30]
// // Failed! The numbers did NOT double. 


// const phrases = ["hello world", "good morning"];

// const words = phrases.flatMap(phrase => phrase.split(" "));
// console.log(words); 
// Output: ["hello", "world", "good", "morning"]  (Perfectly flat!)



// let text = "Please visit Microsoft and Microsoft!";
// let newText = text.replaceAll("Microsoft", "W3Schools");

// console.log(newText); // Output: "Please visit W3Schools and Microsoft!"


// Flat Map

// Add elements
// const numbers = [1, 2, 3];

// // Task: For every number, output the number itself AND its negative version
// const expanded = numbers.flatMap(num => [num, -num]);

// console.log(expanded);
// // Output: [1, -1, 2, -2, 3, -3] (The array grew from 3 items to 6!)


//Remove Arrays

// const numbers = [1, 2, 3];

// // Task: Keep only numbers greater than 1
// const filtered = numbers.flatMap(num => {
//   if (num > 1) {
//     return [num]; // Keep it by wrapping it in an array
//   } else {
//     return [];    // Returning an empty array deletes this slot completely
//   }
// });

// console.log(filtered); 
// // Output: [2, 3] (The number 1 was cleanly erased!)


//Modification of Arrays

// const numbers = [1, 2, 3];

// // Task: Convert the numbers into text strings
// const modified = numbers.flatMap(num => [`Number ${num}`]);

// console.log(modified); 
// // Output: ["Number 1", "Number 2", "Number 3"]


const person = {
  firstName: "John",
  lastName: "Doe",
  id: 5566,
  getId: function() {
    return this.id;
  }
};

let number = person.getId()
console.log(number) // Output: 5566