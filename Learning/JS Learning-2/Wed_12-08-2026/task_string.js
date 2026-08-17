// Solve the 6 questions using predefined function/methods and without using them - 2 times
// When solving using predefined methods and functios - use only and only String methods strictly.
// String methods which only return string or single value - no array no object allowed as result (split, match, matchAll)
// not even regexp or any thing else - just pure string related tasks/questions.

str = `Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Vestibulum id turpis vehicula magna interdum venenatis. Sed pulvinar laoreet turpis quis cursus. 
    Maecenas felis felis, auctor eget nisl eget, tempor ullamcorper dui. Proin eu nisl enim. 
    Pellentesque porta, felis eget consequat dapibus, nunc justo dapibus erat, eu lobortis ex odio id nulla. 
    Phasellus vitae egestas tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. 
    Nulla et massa quam. Nulla ornare est non magna pulvinar convallis.`

str1 = `Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.`

//1 - "str" word count.
//console.log(str.length)

function question1(str){
    let len = str.length
    return len
}
console.log(question1(str))


//2 - Merge "str" & "str1".
let text = str.concat(str1)
//console.log(text)

function add(a, b){
    return a + b
}
//console.log(add(str, str1))


//3 - Get all the same words from the merge of "str" & "str1".(find the words which are in str1 from str)
let words = str.search(str1)
//console.log(words)

function compare(a, b){
    return a == b 
}
//console.log(compare(str, str1))


//4 - Find position of given word in str or str1 in which string 
console.log(str1.search("Class"))


//5 - String has given word or not. if it has show its position.
function pos(a, b){
    if (a.includes(b) === true){
        console.log(a.indexOf(b))
    }
}
//pos(str1, "Class")


//6 - Find All unique words from “str1” in comparison of “str”.
let bool = str.includes(str1)

function compare(c){
    if(c === true){
        console.log(str.indexOf(str1))
    }
    else {
        console.log("not unique words found")
    }
}
//compare(bool)

//7 - List all words & how many times it’s used.
let n = str1.length
for(let i = 0; i<n; i++){
    //console.log(str1[i])
}