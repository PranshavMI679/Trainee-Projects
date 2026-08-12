let arr = ["apple", "banana", "grapes", "cherry", "mango"]

function print(a){
    let text = ""
    for(let i=0; i<a.length; i++){
        text = text + " " + a[i]
    }
    return text
}
//console.log(print(arr))

function string(b){
    let str = ""
    for(let i=0; i<b.length; i++){
        str = str + " " + "I have " + b[i]
    }
    return str
}
//console.log(string(arr))

function printit(c){
    let text = ""
    let i = 0
    while( i < c ){
        text = text + " " + c
        //i++
        //console.log(text)
    }
    return text
}
//console.log(printit(7))


// let nums = [1,2,3,4,5]
// let value = nums.reduce((acc,curr)=> acc+curr,10)
// console.log(value)