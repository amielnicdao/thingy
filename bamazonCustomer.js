var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"

});

connection.connect(function (err) {
    if (err) throw (err);
    console.log("Connected as id: " + connection.threadId);
    // connection.end();
    allItems();
    //idAndUnit();
});

function allItems() {
     connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw (err);
         console.log(res);
       inquirer
             .prompt([
    
                {
                    name: "purchase",
                    type: "list",
                    message: "Would you like to purchase now?",
                    choices: ["Yes", "No"]
                }
            ]).then(function(answer) {
                switch(answer.purchase) {
                    case 'Yes':
                        // console.log("it works")
                        checkQuantity();
                        
                    break;
        
                    case 'No':
                        connection.end();
                    break;
                }
            })
            })
        }

function checkQuantity() {    
            inquirer
            .prompt([
                        {
                    name: "id",
                    type: "input",
                    message: "What is the ID number of the product you would like to purchase?",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return "Please enter a number."; //how to reset
                      }
                },
                {
                    name: "unit",
                    type: "input",
                    message: "How many units would you like to purchase?",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                }
            ]).then(function(answer) {

            // var itemId = answer.id;
            // var itemUnit = answer.unit;

                connection.query("SELECT * FROM products WHERE ?", answer.id, function(err, res) {
                    if (err) throw err;
                        // console.log(res)
                // for (var i = 0; i < res.length; i++) {
                    if(answer.unit <= res[0].stock_quantity) {
                        // console.log("it works")
                        console.log("Item: " + res[0].product_name);
                        console.log("Department: " + res[0].department_name);
                        console.log("Price: " + res[0].price);
                        console.log("Quantity: " + answer.unit);
                        console.log("Total: " + res[0].price * answer.unit);
                    }
                    else {
                        if(answer.unit > res[0].stock_quantity) {
                            console.log("Sorry! We do not have enough in stock. Please try again.")
                        }
                    }
                // }

            }
            
                )}
                   )   }
        
        // }
        // })
     
        

    






