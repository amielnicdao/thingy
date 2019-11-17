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
                    name: "id",
                    type: "input",
                    message: "What is the ID number of the product you would like to purchase?"
                },
                {
                    name: "unit",
                    type: "input",
                    message: "How many units would you like to purchase?"
            },
            {
                name: "purchase",
                type: "confirm",
                message: "Would you like to purchase now?"
            }
            ])
            //.then function if user === yes then do this...

    });
}





