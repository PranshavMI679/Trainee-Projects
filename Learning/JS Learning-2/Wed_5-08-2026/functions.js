// numbers = [1, 2, 3, 4, 5];

// function sumAll(...numbers) {
//   return numbers.reduce((a, b) => a + b);
// }

// console.log(sumAll(...numbers));



// // A higher-order function that generates a multiplier function
// function createMultiplier(factor) {
//   return function(number) {
//     return number * factor;
//   };
// }

// // Create a specific function that triples any number
// const triple = createMultiplier(3);

// // Execute the function
// const result = triple(5);

// console.log(result); // Output: 15



// const user = {
//   username: "Alex",
//   greet() {
//     setTimeout(function() {
//       console.log(`Hello, ${this.username}`); 
//     }, 1000);
//   }
// };

// user.greet(); 
// // Prints: "Hello, undefined" after 1 second!
// // WHY? Because setTimeout executes the anonymous inner function standalone. 
// // Inside that inner function, 'this' reverted back to the Global Window object.


const modernSmartHome = {
  device: "Smart Thermostat",
  temperature: 22,
  
  activate() {
    //console.log(`Checking connection for: ${this.device}`);
    setTimeout(() => {
      console.log(`[Success] ${this.device} is running at ${this.temperature}°C`);
    }, 1000);
  }
};

modernSmartHome.activate();
