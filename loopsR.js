function printTriangle(n) {
    for (let i = 1; i <= n; i++) {
        console.log("• ".repeat(i));
    }
}

printTriangle(4);



//tester10@yopmail.com
//tester..679


// -----------Edabit Medium questions


// ---------------Triangle sequence
// function triangle(n) {
// 	let totaldots = 0
// 	for(let i = 0; i <= n; i++){
// 		totaldots = totaldots + i
// 	}
// 	return totaldots
// }

//------------Check if All Values Are True
// function allTruthy(...args) {
// 	for(let val of args){
// 		if (!val){
// 			return false
// 		}
// 	}
// 	return true
// }


//------------Factorize a Number
// function factorize(num) {
// 	let factors = []
// 	for (let i=0; i<=num; i++){
// 		if(num%i === 0){
// 			factors.push(i)
// 		}
// 	}
// 	return factors
// }


//------------War of Numbers
// function warOfNumbers(arr) {
// 	let evenSum = 0
// 	let oddSum = 0
// 	for (let val of arr){
// 		if(val % 2 === 0){
// 			evenSum = evenSum + val
// 		}else{
// 			oddSum = oddSum + val
// 		}
// 	}
// 	return Math.abs(evenSum - oddSum)
// }


//------------Progress
function progressDays(runs) {
	let progress = 0;
	for (let i = 1; i < runs.length; i++) {
		if (runs[i] > runs[i - 1]) {
			progress++;
		}
	}
	return progress;
}