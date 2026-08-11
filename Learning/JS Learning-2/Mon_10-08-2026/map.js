// Create an empty Map
const fruits = new Map();

// Set Map Values
fruits.set("apples", 500);
fruits.set("bananas", 300);
fruits.set("oranges", 200);

fruits.delete("apples")
fruits.clear()
console.log(fruits.get("apples"))
console.log(fruits)
console.log(fruits instanceof Map)
console.log(fruits.size)
