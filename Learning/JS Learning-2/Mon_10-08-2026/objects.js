// Invert Keys and Values
// let obj = { a:1, b:2 }
// let newObj = {}
// for (let key in obj){
//     let value = obj[key]
//     newObj[value] = key
// }
// console.log(newObj) // output: {1:"a", 2:"b"}


// // Count Property Types
// let obj = { a:1, b:"hello", c:true, d:5 }
// let types = {}
// for (let key in obj){
//     let actualValue = obj[key]
//     let typeName = typeof actualValue

//     types[typeName] = (types[typeName] || 0) + 1
// }

// console.log(types) //Output: { number:2, string:1, boolean:1 }


// Shallow Object Comparison
// let obj1 = {a:1,b:2}
// let obj2 = {a:1,b:2}

// function isShallowEqual(o1, o2) {
//     let keys1 = Object.keys(o1);
//     let keys2 = Object.keys(o2);
//     if (keys1.length !== keys2.length) {
//         return false;
//     }
//     for (let key in o1) {
//         if (o1[key] !== o2[key]) {
//             return false;
//         }
//     }
//     return true;
// }
// console.log(isShallowEqual(obj1, obj2));



// // Convert Object story to Query String
// let object = { name:"john", age:25 }
// let pieces = []
// for(let key in object){
//     pieces.push(key + "=" + object[key]);
// }
// let string = pieces.join("&")
// console.log(string) // Output: "name=john&age=25"