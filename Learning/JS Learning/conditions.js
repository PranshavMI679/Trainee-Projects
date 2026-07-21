//w3school examples

// let hour = 14;
// if (hour < 15) {
//   greeting = "Good day";
//   console.log(greeting);
// }

// let age = 16;
// let text = "You can Not drive";

// if (age >= 18) {
//   text = "You can drive";
// }
// console.log(text);


// let age = 16;
// let country = "USA";
// let text = "You can Not drive!";

// if (country == "USA" && age >= 16) {
//     text = "You can drive!";
//   }

// console.log(text);

// let hour = 20;

// if (hour < 18) {
//   greeting = "Good day";
// } else {
//   greeting = "Good evening";
// }

// if (hour < 18) {
//   greeting = "Good day";
// } else {
//   greeting = "Good evening";
// }


// let time = 22;
// let greetings;

// if (time < 10) {
//   greetings = "Good morning";
// } else if (time < 20) {
//   greetings = "Good day";
// } else {
//   greetings = "Good evening";
// }
// console.log(greetings);



// let text;
// if (Math.random() < 0.5) {
//   text = "<a href='https://w3schools.com'>Visit W3Schools</a>";
// } else {
//   text = "<a href='https://wwf.org'>Visit WWF</a>";
// }
// console.log(text);

// let age = 16;
// let text = (age < 18) ? "Minor" : "Adult";
// console.log(text);

// let isMember = false;
// let discount = isMember ? 0.2 : 0;
// console.log(discount);


// let d = 6;
// switch (d) {
//   case 6:
//     text = "Today is Saturday";
//     break;
//   case 0:
//     text = "Today is Sunday";
//     break;
//   default:
//     text = "Looking forward to the Weekend";
// }
// console.log(text);


// switch (new Date().getDay()) {
//   case 4:
//   case 5:
//     text = "Soon it is Weekend";
//     break;
//   case 0:
//   case 6:
//     text = "It is Weekend";
//     break;
//   default:
//     text = "Looking forward to the Weekend";
// }

// console.log(text);


// let x = 0 ;
// console.log(Boolean(x)); 


// let x = 6;
// let y = 3;
// let z = (x < 10 && y > 1)

// console.log(z);



// let x = 6;
// let y = -3;
// let z = (x > 0 || y > 0)
// console.log(z)


// let name = null;
// let text;
// let result = name ?? text
// console.log(result)




// Excepton Handling

// function withdrawFunds(accountBalance, amount) {
//     let transactionCompleted = false;

//     try {
//         console.log("1. Starting transaction...");

//         if (amount < 0) {
//             // JavaScript thinks this is fine, but our business logic does not!
//             throw new Error("Cannot withdraw a zero or negative amount."); 
//         }
//         if (amount > accountBalance) {
//             throw new Error("Insufficient funds available.");
//         }

//         accountBalance -= amount;
//         transactionCompleted = true;
//         console.log("Transaction successful!");

//     } catch (error) {
//         // This catches ANY error thrown in the try block
//         console.warn("2. Transaction Failed:", error.message);

//     } finally {
//         // This runs whether the transaction succeeded OR failed
//         console.log("3. System: Session logged out securely.");
//     }
// }

// // Test Case: Throws an error
// withdrawFunds(100, 100); 





// Error Objects

// A list of functions, each designed to trigger a specific type of error object
let testScenarios = [
    {
        name: "1. ReferenceError",
        action: () => {
            // Happens when you use a variable that has not been declared
            return nonexistentVariable + 10;
        }
    },
    {
        name: "2. TypeError",
        action: () => {
            // Happens when a value is not of the expected data type
            let num = 42;
            num.toUpperCase(); // Numbers do not have a toUpperCase method
        }
    },
    {
        name: "3. RangeError",
        action: () => {
            // Happens when a value is outside its allowed numeric range
            let arr = new Array(-5); // Array size cannot be negative
        }
    },
    {
        name: "4. SyntaxError",
        action: () => {
            // Happens when parsing code that breaks language rules 
            // (Must use eval() here because bad syntax directly in code stops compilation entirely)
            eval("if (true) { console.log('missing closing brace'"); 
        }
    },
    {
        name: "5. URIError",
        action: () => {
            // Happens when global URI handling functions are used incorrectly
            decodeURIComponent("%illegalPercentSign"); 
        }
    },
    {
        name: "6. InternalError (or RangeError depending on V8 context)",
        action: () => {
            // Happens when the JS engine encounters internal limits, like too much recursion
            function recurse() { recurse(); }
            recurse();
        }
    },
    {
        name: "7. Custom Generic Error (via throw)",
        action: () => {
            // Generated manually by you when business logic fails
            throw new Error("This is a custom business logic failure!");
        }
    }
];

// Executing all scenarios using try, catch, throw, and finally
testScenarios.forEach((scenario) => {
    console.log(`--- Running: ${scenario.name} ---`);
    
    try {
        // Execute the error-prone code
        scenario.action(); 
    } 
    catch (error) {
        // Catch block receives the specific error object type
        console.log(`❌ Caught Constructor Name: ${error.name}`);
        console.log(`💬 Error Message Details:  ${error.message}`);
    } 
    finally {
        // Finally block always executes clean up after each attempt
        console.log(`🧹 Finally block: Cleanup for ${scenario.name} done.\n`);
    }
});

