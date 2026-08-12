// Q-1 : Take 2 value and apply all the comparison operators on it
let a = 2
let b = 3

//console.log(`a==b : ${a==b}`)
//console.log('a==b : ' + (a==b))
//console.log({"a==b":a==b})

console.log('a==b : ' , a==b)
console.log('a===b : ', a===b)
console.log('a!=b : ', a!=b)
console.log('a!==b : ', a!==b)
console.log('a>=b : ', a>=b)
console.log('a<=b : ', a<=b)
console.log('a>b : ', a>b)
console.log('a>b : ', a<b)


// Q-2 : Take 2 value and apply all arithmetic operators on it

console.log('a+b : ', a+b)
console.log('a-b : ', a-b)
console.log('a*b : ', a*b)
console.log('a/b : ', a/b)
console.log('a%b : ', a%b)
console.log('a**b : ', a**b)


// Q-3 : Implement airthmettic opertaions using given conditions

if (a === 2*b){
    console.log("1 : a = 2b : ", a+b)
}
else if (b === 2*a){
    console.log("2 : b = 2a : ", a-b)
}
else if (b === 0){
    console.log("3: b = 0 : ", a+1)
}
else if (a === 0){
    console.log("4: a = 0 : ", b+1)
}
else if (a < b){
    console.log("5: a < b : ", a/2)
}
else if (a > b){
    console.log("6: a > b : ", a*b)
}