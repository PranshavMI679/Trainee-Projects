// Solve the rest 4 problems using predefined methods and also by not using it - 2 times
// When solving using predefined methods and functios - use only Array and string methods strictly.
// not even regexp or any thing else - just pure array related tasks/questions.
//Question-1 should be solved by normal methods and should not use any methods and the particular function should
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
function concatArray(arr, arr1){
	let newArr = [...arr, ...arr1]
	return newArr
}
//console.log(concatQuestion1(arr, arr1))

//filter()
function filter(array){
	let result = []
	for(let i=0; i<array.length; i++){
		if(array[i].length > 50){
			result[result.length] = array[i]
		}
	}
	return result
}
//console.log(filter(arr1))


//find()
function find(array){
	for(let i=0; i<array.length; i++){
		if(array[i].length < 50){
			return array[i]
		}
	}
}
//console.log(find(arr1))

//forEach()
function forEach(array){
 for(let i=0; i<array.length; i++){
	if(array[i].length<50){
		console.log(array[i] + `hello world how are you how do you do?`)
	}
 }
}
//console.log(forEach(arr1))

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
function slice(array, start, end){ 
    let result = [];
    let stop = end === undefined ? array.length : end;
    for(let i = start; i < stop; i++) {
        if(i < array.length) {
            result[result.length] = array[i];
        }
    }
    return result;
}
//console.log(slice(arr1, 1, 5))

//map()
function map(array){
	let result = []
 for(let i=0; i<array.length; i++){
	let item = array[i]
	if(item.length<50){
		item = item + `hello world how are you how do you do?`
	}
	return result[result.length] = array[i]
 }
 return result
}
//console.log(map(arr1))



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

//refer the method solution and help me correct the normal solution - without using any methods
//4 - Get the string from an array which has given word or words. [ print that string & in both array with array name ]
//method
function findWord(a, b, word){
	for(let i=0; i<a.length; i++){
		let found = a[i].split(" ").filter(item => item === word ).length
		if(found > 0){
			console.log(`The word "${word}" was found in "${a[i]}" string of array a`)
		}
	}
	for(let i=0; i<b.length; i++){
		let found = b[i].split(" ").filter(item => item === word).length
		if(found > 0){
			console.log(`The word "${word}" was found in "${b[i]}" string of array b`)
		}
	}
}
//findWord(arr, arr1, "arcu")


//normal
function normalFindWord(a, b, word) {
  for (let i = 0; i < a.length; i++) {
    let str = a[i];
    let tempString = "";
    let isFound = false;

    for (let j = 0; j < str.length; j++) {
      if (str[j] != ' ') {
        tempString = tempString + str[j];
      } else {
        if (tempString === word) {
          isFound = true;
        }
        tempString = "";
      }
    }
    if (tempString === word) {
      isFound = true;
    }

    if (isFound) {
      console.log(`The word "${word}" was found in "${a[i]}" string of array a`);
    }
  }

  for (let i = 0; i < b.length; i++) {
    let str = b[i];
    let tempString = "";
    let isFound = false;

    for (let j = 0; j < str.length; j++) {
      if (str[j] != ' ') {
        tempString = tempString + str[j];
      } else {
        if (tempString === word) {
          isFound = true;
        }
        tempString = "";
      }
    }
    if (tempString === word) {
      isFound = true;
    }

    if (isFound) {
      console.log(`The word "${word}" was found in "${b[i]}" string of array b`);
    }
  }
}
normalFindWord(arr, arr1, "arcu");



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