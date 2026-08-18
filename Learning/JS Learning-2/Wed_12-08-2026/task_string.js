// Solve the 6 questions using predefined function/methods and without using them - 2 times
// When solving using predefined methods and functios - use only and only String methods strictly.
// String methods which only return string or single value - no array no object allowed as result (split, match, matchAll)
// not even regexp or any thing else - just pure string related tasks/questions.
// you can use only arrays not array methods for normal solutions.

str = `Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Vestibulum id turpis vehicula magna interdum venenatis. Sed pulvinar laoreet turpis quis cursus. 
    Maecenas felis felis, auctor eget nisl eget, tempor ullamcorper dui. Proin eu nisl enim. 
    Pellentesque porta, felis eget consequat dapibus, nunc justo dapibus erat, eu lobortis ex odio id nulla. 
    Phasellus vitae egestas tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. 
    Nulla et massa quam. Nulla ornare est non magna pulvinar convallis.`

str1 = `Class aptent taciti sociosqu ad Trainee litora Probation torquent per Trainee conubia nostra, Probation per inceptos himenaeos.`

//1 - "str" word count.
//Method
//console.log(str.length)

//Normal
function question1(str){
    let len = str.length
    return len
}
console.log(question1(str))


//2 - Merge "str" & "str1".
//method
let text = str.concat(str1)
//console.log(text)

//normal
function add(a, b){
    return a + b
}
//console.log(add(str, str1))


//3 - Get all the same words from the merge of "str" & "str1".(find the words which are in str1 from str)]
// Normal
// function normalQuestion3(str, str1){
//     let result = ""
//     let word = ""

//     for(let i=0; i<=str1.length; i++){

//     }
// }
// normalQuestion3(str, str1)

//Method
function question3(str, str1) {
    let result = "";
    let word = "";

    for (let i = 0; i <= str1.length; i++) {
        let char = str1.charAt(i);
        if (char === ' ' || i === str1.length) {
            if (word !== "" && str.indexOf(word) !== -1) {
                result = result.concat(word, " ");
            }
            word = "";
        } else {
            word = word + char;
        }
    }
    return result;
}
//console.log(question3(str, str1))


//4 - Find position of given word in str or str1 in which string 
//5 - String has given word or not. if it has show its position.
//Normal
function normalQuestion4and5(text, word) {
    for (let i = 0; i < text.length; i++) {
        let match = true;
        for (let j = 0; j < word.length; j++) {
            if (text[i + j] !== word[j]) {
                match = false;
            }
        }
        if (match === true) {
            return "Found at position " + i;
        }
    }
    return "Not found";
}
normalQuestion4and5(text, "Class")


//method
function question4and5(text, word) {
    let pos = text.indexOf(word);
    if (pos !== -1) {
        return "Found at position " + pos;
    }
    return "Not found";
}
//console.log(question4and5(text, "patel"))


//6 - Find All unique words from “str1” in comparison of “str”.
//Method
function question6(str, str1) {
    let result = "";
    let word = "";

    for (let i = 0; i <= str1.length; i++) {
        let char = str1.charAt(i);
        if (char === ' ' || i === str1.length) {
            if (word !== "" && str.indexOf(word) === -1) {
                result = result.concat(word, " ");
            }
            word = "";
        } else {
            word = word + char;
        }
    }
    return result;
}
const string = question6(str, str1)
console.log(string)

//7 - List all unique words & how many times it’s used.
// result string which we gets from ques-6 - use that and solve this 
// Dont change the code - correct it

//method

function question7(uni) {
    let total = 0;
    let word = "";
    let result = "";

    for (let i = 0; i <= uni.length; i++) {
        if (uni[i] !== " " && i !== uni.length) {
            word = word + uni[i];
        } 
        else if (word !== "") {
            if (result.indexOf(word) === -1) {
                total = 0;
                let position = uni.indexOf(word);
             while (position !== -1) {
                total = total + 1;
                position = uni.indexOf(word, position + word.length);
    }
    result = result + word + " = " + total + "\n";
 }
    word = "";
}
}
    return result;
}
console.log(question7(string));


// function question7(uni){
// let total = 0
// let word = ""

// for(let i = 0; i<=uni.length; i++){
//     let char = uni.charAt(i)
//    if (char === ' ' || i === uni.length) {
//     if (word !== "") {
//         total = 1; 
//         console.log(`${word} = ${total}`);
//         }
//     word = ""; 
//     }
//     else {
//         word = word + char
//     }
//     for(let value of string){
//         let wordCount = 0

//     }
// }
// }
// console.log(question7(string))

