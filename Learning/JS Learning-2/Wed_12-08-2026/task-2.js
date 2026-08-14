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

//extra
function pattern3extra(nums){
  for(let i=1; i<=nums; i++){
    let text = ""
    for (let j=nums; j>=1; j--){
     if(j<nums-i+1){
      text = text + (nums-i+1) + " "
     }
     else{
      text = text + j + " "
     }
    }
    console.log(text)
  }
}
//pattern3extra(5)

//Results
// 5 5 5 5 5 
// 5 4 4 4 4 
// 5 4 3 3 3 
// 5 4 3 2 2 
// 5 4 3 2 1 

//extra
function pattern3Extra(nums){
  for(let i=1; i<=nums; i++){
    let text = ""
    for (let j=1; j<=nums; j++){
     if(j<i){
      text = text + j + " "
     }
     else{
      text = text + i + " "
     }
    }
    console.log(text)
  }
}
//pattern3Extra(5)

//REsult
//11111
//12222
//12333
//12344
//12345

//3
function pattern3(nums) {
  let value = nums * 2 - 1;

  for (let i = 1; i <= value; i++) {
    let text = "";
    let row = i;
    if (i > nums) {
      row = value - i + 1;
    }

    for (let j = 1; j <= value; j++) {
      let col = nums - j + 1;
      if (j > nums) {
        col = j - nums + 1;
      }

      if (col < nums - row + 1) {
        text = text + (nums - row + 1) + " ";
      } else {
        text = text + col + " ";
      }
    }
    console.log(text);
  }
}
//pattern3(3);

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


//4
function pattern4(rows){
  let value = (rows**2)
  let i = 1
  let text = ""
  while(i<=rows){
    let num = i.toString()
    let numpad = num.padStart(3, "0") 
    //text = text + numpad + " "
    i++
    if(i>=rows){
      text = text + numpad + " "
    }
    else{text = text + (numpad) + " "}
    console.log(text)
  }
}
pattern4(3)

//result
// 001 002 003
// 008 009 004
// 007 006 005

//result
// 001  002  003  004  005  006  007  008  009  010
// 036  037  038  039  040  041  042  043  044  011
// 035  064  065  066  067  068  069  070  045  012
// 034  063  084  085  086  087  088  071  046  013
// 033  062  083  096  097  098  089  072  047  014
// 032  061  082  095  100  099  090  073  048  015
// 031  060  081  094  093  092  091  074  049  016
// 030  059  080  079  078  077  076  075  050  017
// 029  058  057  056  055  054  053  052  051  018
// 028  027  026  025  024  023  022  021  020  019
