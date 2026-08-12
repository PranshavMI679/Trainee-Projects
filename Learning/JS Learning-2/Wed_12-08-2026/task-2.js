// Use loops, functions and other features to create Patterns

//1
function pattern1(rows) {
  for (let i = 1; i <= rows; i++) {
    let text = ""
    for (let space = 1; space <= rows - i; space++) {
      text = text + " ";
    }
    for (let j = 1; j <= i; j++) {
        if(j==1 || j == i){
            text = text + "* "
        }
        else{text += "  ";}
    }
    console.log(text);
  }
  for (let i = rows - 1; i>=1; i--){
    let text = ""
    for (let space = 1; space <= rows - i; space++) {
      text = text + " ";
    }
    for (let j = 1; j <= i; j++) {
        if(j==1 || j == i){
            text = text + "* "
        }
        else{text += "  ";}
    }
    console.log(text);
  }
}
//pattern1(5);

// Result
//     *
//    * *
//   *   *
//  *     *
// *       *
//  *     *
//   *   *
//    * *
//     *

//2
function pattern2(rows){
    for(let i=1; i<=rows; i++){
        let text = ""
        for(let j = 1; j<=i; j++){
            text=  text + j
        }
        
        console.log(text)
    }
}
pattern2(5)


// Result
// 1        1
// 12      21
// 123    321
// 1234  4321
// 1234554321