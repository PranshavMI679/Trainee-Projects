for (let i = 1; i <= 5; i++){
    let text = ""
    for (let j = 1; j <= i; j++ ){
        text = text + "*"
    }
    console.log(text)
}
//result
// *
// **
// ***
// ****
// *****

let n = 5
for (let i = 1; i <= n; i++){
    let text = ""
    for (let j = 1; j <= (n - i + 1); j++ ){
        text = text + "*"
    }
    console.log(text)
}
