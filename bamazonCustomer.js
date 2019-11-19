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
    allItems();
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
            ]).then(function (answer) {
                switch (answer.purchase) {
                    case 'Yes':
                        idAndUnit();
                        break;

                    case 'No':
                        console.log("Thank you for using Bamazon! See you soon!")
                        connection.end();
                        break;
                }
            })
    }
    )
}

function idAndUnit() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID number of the product you would like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) 
                    {
                        return true;
                    }
                    return "Please enter a number.";  
                }
            },
            {
                name: "unit",
                type: "input",
                message: "How many units would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) 
                    {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            connection.query("SELECT * FROM products WHERE item_id=?", answer.id, function (res) {
                for (var i = 0; i < res.length; i++) {
                    if (answer.unit > res[i].stock_quantity) {
                        console.log("Sorry! We do not have enough in stock. Please try again.");
                        console.log("Item: " + res[i].product_name);
                        console.log("Department: " + res[i].department_name);
                        console.log("Price: " + res[i].price);
                        console.log("Stock: " + res[i].stock_quantity);
                        newOrder();
                    } else {
                        console.log("Item: " + res[i].product_name);
                        console.log("Department: " + res[i].department_name);
                        console.log("Price: " + res[i].price);
                        console.log("Quantity: " + answer.unit);
                        console.log("Total: " + res[i].price * answer.unit);

                        var updateStock = res[i].stock_quantity - answer.unit;
                        var itemId = answer.id;
                        updateDB(updateStock, itemId);
                    }
                }
            });
        });
};

function updateDB(updateStock, itemId) {
    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: updateStock }, { item_id: itemId }],
        function (err) {
            if (err) throw err;
            console.log("Your order has been placed. Thank you for your purchase.");
            newOrder();
        }
    );
};

function newOrder() {
    inquirer
        .prompt({
            name: "newOrder",
            type: "list",
            message: "Would you like to place another order?",
            choices: ["Yes", "No"]
        })
        .then(function (answer) {
            if (answer.newOrder === "Yes") {
                console.log("Great! Here are the items.")
                idAndUnit();
            } else {
                connection.end()
                console.log("Thank you for using Bamazon! See you soon!")
            }
        });
}

//should i create new table




