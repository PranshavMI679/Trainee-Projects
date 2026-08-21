// Solve the rest 4 problems using predefined methods and also by not using it - 2 times
// When solving using predefined methods and functios - use only Array and string methods strictly.
// not even regexp or any thing else - just pure array related tasks/questions.
// Question-1 should be solved by normal methods and should not use any methods and the particular function should
// work same as the mentioned method - with any kind of array input

arr = [
	"Proin sed nisl vel turpis elementum facilisis vel ut metus.",
	"Nam venenatis arcu et maximus pulvinar.",
	"Vivamus at diam pellentesque ex tempus porta.",
	"Cras imperdiet tortor euismod, sollicitudin lorem ut, accumsan ipsum.",
	"Cras vestibulum arcu a magna ornare, non bibendum purus ultricies."
]

arr1 = [
	"Proin et tortor molestie est pretium congue sit amet ut tortor.",
	"Donec consectetur neque ac purus posuere dapibus.",
	"Morbi congue nibh in ipsum lobortis ullamcorper.",
	"Nam lacinia metus ac nisi lacinia, non sollicitudin nisl sodales.",
	"Cras vestibulum arcu a magna ornare, non bibendum purus ultricies.",
	"Nam venenatis arcu et maximus pulvinar."
]
//console.log("Morbi congue nibh in ipsum lobortis ullamcorper.".length)

//1 Create functions don’t use the specified predefined methods.
//concat()
function concat(arr, arr1){
	let result = []
	for(let i=0; i<arr.length; i++){
		result[result.length] = arr[i]
	}
	for(let j=0; j<arr1.length - 1; j++){
		result[result.length] = arr[j]
	}
	return result
}
//console.log(concat(arr, arr1))

//filter()
// function filter(array, callback){
// 	let result = []
// 	for(let i=0; i<array.length; i++){
// 		if(callback(array[i], i, array)){
// 			result[result.length] = array[i]
// 		}
// 	}
// 	return result
// }
// //console.log(filter(arr1, item=>item.length > 50))

//find()
function find(array, callback){
	for(let i=0; i<array.length; i++){
		if(callback(array[i], i, array)){
			return array[i]
		}
	}
}
//console.log(find(arr1, item => item.length < 50))

//forEach()
function forEach(array, callback){
 for(let i=0; i<array.length; i++){
	callback(array[i], i, array)
		//console.log(array[i] + `hello world how are you how do you do?`)
 }
}
// forEach(arr1, item => {
// 	if(item.length < 50){
// 	console.log(item + ` hello world how are you how do you do?`);
// 	}
// })

//includes()
function includes(array, item){
	for(let i=0; i<array.length; i++){
		if(array[i] === item){
			return true
		}
	}
	return false
}
//console.log(includes(arr1, "Morbi congue nibh in ipsum lobortis ullamcorper."))

//slice()
function slice(array, start, stop){ 
    let result = [];

	//start === undefined ? 0 : start
	//if(start < 0){ start = array.length + start }
	start = start === undefined ? 0 : (start < 0 ? array.length + start : start)
    
    //stop === undefined ? array.length : stop
	//if(stop < 0) { stop = array.length + stop}
	stop = stop === undefined ? array.length : (stop < 0 ? array.length + stop : stop)
	
    for(let i = start; i < stop; i++) {
        if(i < array.length) {
            result[result.length] = array[i];
        }
    }
    return result;
}
//console.log(slice(arr1, -3))
//console.log(arr1.slice(-3))

//map()
function map(array, callback){
	let result = []
 	for(let i=0; i<array.length; i++){
		result[result.length] = callback(array[i], i, array)
 	}
	return result
}
let mapResult = map(arr1, item => {
    if (item.length < 50) {
        item = item + ` hello world how are you how do you do?`;
	}
	return item
});
//console.log(mapResult)


//2 - Get diff of "arr" & "arr1" [ which strings are not the same "print that strings" ].
//method
function difference(a, b){
	let result = a.filter(item => !b.includes(item))
	return result
}
//console.log(difference(arr, arr1))

//normal
function normalDifference(a, b){
	let result = []
	for(let i=0; i<a.length; i++){
		let found = false;
		for(let j=0; j<b.length; j++){
			if (a[i] === b[j]){
				found = true
				break;
			}
		}
		if(found != true)
		result[result.length] = a[i]
	}
	return result
}
//console.log(normalDifference(arr, arr1))


//3 - Get count of words in every string of "arr"
//method
function wordCount(array){
	let result = []
	let count = 0
	for(let i=0; i<array.length; i++){
		let count = array[i].split(" ").filter(word => word !== "").length;
		result.push(count)
	}
	return result
}
//console.log(wordCount(arr))

//normal
function normalWordCount(array){
	let counts = []
	for(let i=0; i<array.length; i++){
		let newArr = []
		let tempString = ""
		let str = array[i]
		for(let j=0; j<str.length; j++){
			if(str[j] != ' '){
				tempString = tempString + str[j]
			}
			else{                       
				if (tempString != "") {
					newArr[newArr.length] = tempString
				}
				tempString = "";             
			}
		}
		if (tempString != "") {
			newArr[newArr.length] = tempString
		}
		counts[counts.length] = newArr.length
	}
	return counts
}
//console.log(normalWordCount(arr))

//4 - Get the string from an array which has given word or words. [ print that string & in both array with array name ]
//method
function findWord(a, b, word){
	let smallWord = word.toLowerCase()
	let result = []
	for(let i=0; i<a.length; i++){
		let str = a[i].toLowerCase()
		let found = str.split(" ").filter(item => item === smallWord ).length
		if(found > 0){
			//console.log(`The word "${word}" was found in "${a[i]}" string of array a`)
			result.push(a[i])
		}
	}
	for(let i=0; i<b.length; i++){
		let str = b[i].toLowerCase()
		let found = str.split(" ").filter(item => item === smallWord).length
		if(found > 0){
			//console.log(`The word "${word}" was found in "${b[i]}" string of array b`)
			result.push(b[i])
		}
	}
	return result
}
//console.log(findWord(arr, arr1, "arcu"))

//normal
function normalFindWord(a, b, word) {
	let smallWord = word.toLowerCase()
	let result = []
  for (let i = 0; i < a.length; i++) {
    let str = a[i].toLowerCase();
    let tempString = "";
    let isFound = false;
    for (let j = 0; j < str.length; j++) {
      if (str[j] != ' ') {
        tempString = tempString + str[j];
      } else {
        if (tempString === smallWord) {
          isFound = true;
        }
        tempString = "";
      }
    }
    if (tempString === smallWord) {
      isFound = true;
    }
    if (isFound === true) {
     // console.log(`The word "${word}" was found in "${a[i]}" string of array a`);
      result[result.length] = a[i];
    }
  }

  for (let i = 0; i < b.length; i++) {
    let str = b[i].toLowerCase();
    let tempString = "";
    let isFound = false;
    for (let j = 0; j < str.length; j++) {
      if (str[j] != ' ') {
        tempString = tempString + str[j];
      } else {
        if (tempString === smallWord) {
          isFound = true;
        }
        tempString = "";
      }
    }
    if (tempString === smallWord) {
      isFound = true;
    }
    if (isFound === true) {
      //console.log(`The word "${word}" was found in "${b[i]}" string of array b`);
      result[result.length] = b[i];
    }
  }
  return result
}
//console.log(normalFindWord(arr, arr1, "arcu"));


//5 - Get the same string from both arrays.
//method
function duplicate(a, b){
	let result = a.filter(item => b.includes(item))
	console.log(result)
}
//duplicate(arr, arr1)

//normal
function normalDuplicate(a, b){
	let result = []
	for(let i=0; i<a.length; i++){
		let found = false;
		for(let j=0; j<b.length; j++){
			if (a[i] === b[j]){
				found = true
				break;
			}
		}
		if(found == true)
		result[result.length] = a[i]
	}
	return result
}
//console.log(normalDuplicate(arr, arr1))



//correct this code the same way - dont chnage it
function filter(array, callback){
    let result = [];
    for(let i=0; i<array.length; i++){
        if(callback(array[i], i, array)){
            result[result.length] = array[i];
        }
    }
    return result;
}

function wordTask(array, searchWord) {
	let word = searchWord.toLowerCase()
			let result = []
    let matchedArray = filter(array, currStr => {
        let tempString = "";
		let str = currStr.toLowerCase()
        for (let j = 0; j < str.length; j++) {
            let char = str[j];
            if (char === ' ') {
                if (tempString === word) {
                    return true;
                }
                tempString = "";
            } else {
                tempString = tempString + char;
            }
        }
        if (tempString === word) {
            return true;
        }
        return false;
    });
    for (let i = 0; i < matchedArray.length; i++) {
        //console.log("Found word in sentence: " + matchedArray[i]);
		result[result.length] = macthedArray[i]
    }
	return result
}
console.log(wordTask(arr1, "arcu"));
