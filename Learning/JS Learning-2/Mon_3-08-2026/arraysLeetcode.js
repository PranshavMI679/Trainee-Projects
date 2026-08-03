//------------------merged Sorted Array

// var merge = function(nums1, m, nums2, n) {
//     nums1.splice(m, m+n, ...nums2)
//     nums1.sort(function(a, b){return a-b})
// };


//-----------majority element

// var majorityElement = function(nums) {
//     let n = nums.length
//     for(let val of nums){
//         let count = 0
//         for (let elem of nums) {
//             if (elem === val) {
//                 count++;
//             }
//         }
//         if (count > n/2){     
//             return val       
//         }
//     }
// };

//-----------Remove Element

// var removeElement = function(nums, val) {
//     let index = nums.indexOf(val);
//     while (index !== -1) {
//         nums.splice(index, 1);
//         index = nums.indexOf(val);
//     }
//     return nums.length;
// };

//---------------

// var searchInsert = function(nums, target) {
//     if(nums.includes(target) === true){
//         return nums.indexOf(target)
//     }
//     for (let i = 0; i < nums.length; i++) {
//         if (nums[i] > target) {
//             return i;
//         }
//     }
//     return nums.length;
// };

//---------------Plus One

// var plusOne = function(digits) {
//     let num = digits.join('')
//     let newNum = BigInt(num) + 1n; 

//     return Array.from(String(newNum), Number)
// };