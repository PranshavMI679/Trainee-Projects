function sayMyName(){
    console.log("P")
    console.log("R")
    console.log("A")
    console.log("N")
    console.log("S")
    console.log("H")
    console.log("A")
    console.log("V")
}

//sayMyName()

function addTwoNums(num1, num2){
    console.log(num1 + num2)
}
//const result = addTwoNums(2, 5)
// console.log(result)


function addTwoNums(num1, num2){
    let result = num1 + num2
    return result
}
//console.log(addTwoNums(2, 5))
//console.log(result)


function loginUserMessage(username = "Pranshav"){
    if(!username){
        console.log("Please enter a username")
        return 
    }
    return `${username} just logged in`
} 
//console.log(loginUserMessage("Trainee"))


function calculateCartPrice(val1, val2, ...num1){
    return num1
}
//console.log(calculateCartPrice(200, 400, 500, 700))

// const user = {
//     name: "Pranshav",
//     age: 22
// }

function handleObject(anyobject){
    console.log(`Username is ${anyobject.username} and age is ${anyobject.age}`);
}
//handleObject(user)
// handleObject({
//      name: "Pranshav",
//     age: 22
// })


const myArr = [200, 400, 100, 600]

function return2ndValue(getArray){
    return getArray[1]
}
//console.log(return2ndValue(myArr))
//console.log(return2ndValue([200, 400, 100, 600]))

// let a = 22
// {
//     let a = 25
//     console.log(a)
// }
// console.log(a)


function addOne(num){
    return num + 1
}
//console.log(addOne(5))


const addTwo = function(num){
    return num + 2
}

//console.log(addTwo(5))



const user = {
    username: "Pranshav",
    age: 22,
    welcomeMessage: function(){
        console.log(`${this.username} , welcome to wedbsite`)
        //console.log(this)
    }
}
// user.welcomeMessage()
// user.username = "Trainee"
// user.welcomeMessage()

//console.log(this)


// function chai(){
//     let username = "hitesh"
//     console.log(this.username);
// }

// const chai = function(){
//     let username = "Pranshav"
//     console.log(this.username);
// }

// const chai = () => {
//     let username = "Pranshav"
//     console.log(this.username);
// }

//chai()


// const add2 = (num1, num2) => {
//     return num1 + num2
// }
//const add2 = (num1, num2) => (num1 + num2)
//const add2 = (num1, num2) => num1 + num2
//console.log(add2(3, 4))


// function chai(){
//     console.log(`DB Connected`);
// }
//chai()

;(function chai(){
    console.log(`DB Connected`);
})();

((name) => {
    console.log(`Pranshav ${name}`)
})('Patel');

