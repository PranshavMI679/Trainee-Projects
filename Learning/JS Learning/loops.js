// const colors = ["red", "blue"];

// colors.themeName = "Dark Mode";

// console.log(colors.length); 
// console.log(colors.themeName);

// for (const key in colors) {
//     console.log(key); 
// }


// const word = "Hi";
// for (const key in word) {
//     console.log(key); // "0", "1"
// }



const spaceship = { name: "Apollo", speed: "Mach 3", fuel: "Liquid Hydrogen" };

for (const property in spaceship) {
    console.log(property); // Prints the KEY name
}
// Output:
// "name"
// "speed"
// "fuel"


