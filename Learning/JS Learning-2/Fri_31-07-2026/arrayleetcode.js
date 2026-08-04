//pranshav.patel@mindinventory.com
//Tester..679


//----------Two Sum
// var twoSum = function(nums, target) {
//     for(let i = 0; i < nums.length; i++){
//         for(let j = i + 1; j < nums.length; j++){
//             if(nums[i] + nums[j] == target){
//                 return [i, j]
//             }
//         }
//     }
// };

//--------Remove Duplicate
// var removeDuplicates = function(nums) {
//     let k = 1
//     for (let i=1; i<nums.length; i++){
//         if (nums[i] !== nums[i - 1]) {
//             nums[k] = nums[i];
//             k++;
//         }
//     }
//     return k
// };

//--------------Single Number
// var singleNumber = function(nums) {
//     let n = 0;
//     for(let i=0; i<nums.length; i++){
//        n = n ^ nums[i]
//     }
//     return n
// };

//---------------121 Best Time
// var maxProfit = function(prices) {
//     let minPrice = prices[0];
//     let maxProfit = 0;
//     for (let i = 0; i < prices.length; i++) {
//         minPrice = Math.min(minPrice, prices[i]);
//         maxProfit = Math.max(maxProfit, prices[i] - minPrice);
//     }
//     return maxProfit;
// };

//--------------Contains Duplicate
// var containsDuplicate = function(nums) {
//     let seen = new Set();
//     for (let i = 0; i < nums.length; i++) {
//         if (seen.has(nums[i])) {
//             return true;
//         }
//         seen.add(nums[i]);
//     }
//     return false;
// };