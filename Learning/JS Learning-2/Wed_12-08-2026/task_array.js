// Solve the 4 problems using predefined methods and also by not using it - 2 times
// When solving using predefined methods and functios - use only Array and string methods strictly.
// not even regexp or any thing else - just pure array related tasks/questions.

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

//1 Create functions don’t use predefined methods.
//concat()
function concatArray(arr, arr1){
	let newArr = [...arr, ...arr1]
	return newArr
}
//console.log(concatQuestion1(arr, arr1))

//filter()
let newArr = arr1.filter(filterArray)
function filterArray(value, index, array){
	//string length of strings inside array > 48
	if(value.length > 50){
		return value
	}
}
console.log(newArr)

//find()
//forEach()
//includes()
//slice()
//map()

//2 - Get diff of "arr" & "arr1" [ which strings are not the same "print that strings" ].



//3 - Get count of words in every string of "arr"



//4 - Get the string from an array which has given word or words. [ print that string & in both array with array name ]



//5 - Get the same string from both arrays.

