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
            text = text + j 
        } 
        for(let s = 1; s <= (rows - i) * 2; s++){
            text = text + " "
        }
        for(let j = i; j >= 1; j--){
          text = text + j
        }
        console.log(text) 
    } 
} 
//pattern2(5)


// Result
// 1        1
// 12      21
// 123    321
// 1234  4321
// 1234554321

//---extra
function patternExtra(rows){ 
    for(let i=1; i<=rows; i++){ 
        let text = "" 
        for(let j = 1; j<=i; j++){ 
            text = text + j 
        } 
        for(let s = 1; s <= [(rows - i)*2]-1; s++){
            text = text + " "
        }
        for(let j = i; j>=1; j--){
            if(j==rows){
            text = text
          }
            else{text = text + j}
        }
        console.log(text) 
    } 
} 
//patternExtra(3)

// Result
// 1       1
// 12     21
// 123   321
// 1234 4321
// 123454321

//3
function pattern3(nums){
  for(let i=1; i<=nums; i++){
    let text = ""
    for (let j=nums; j>=1; j--){
     if(j<nums-i+1){
      text = text + (nums-i+1)
     }
     else{
      text = text + j
     }
    }
    console.log(text)
  }
}
pattern3(5)

//Results
// 5 5 5 5 5 
// 5 4 4 4 4 
// 5 4 3 3 3 
// 5 4 3 2 2 
// 5 4 3 2 1 

//Results
// 5 5 5 5 5 5 5 5 5 
// 5 4 4 4 4 4 4 4 5 
// 5 4 3 3 3 3 3 4 5 
// 5 4 3 2 2 2 3 4 5 
// 5 4 3 2 1 2 3 4 5 
// 5 4 3 2 2 2 3 4 5 
// 5 4 3 3 3 3 3 4 5 
// 5 4 4 4 4 4 4 4 5 
// 5 5 5 5 5 5 5 5 5



