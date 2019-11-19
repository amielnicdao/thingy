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
        for (var i = 0; i < res.length; i++) {
        console.log("\x1b[96m***************************************\x1b[39m");
        console.log("Item ID: " + res[i].item_id);
        console.log("Product Name: " + res[i].product_name);
        console.log("Department Name: " + res[i].department_name);
        console.log("Price: " + res[i].price);
        console.log("Stock: " + res[i].stock_quantity);
        }
        inquirer
            .prompt([
                {
                    name: "purchase",
                    type: "list",
                    message: "\x1b[92mWould you like to purchase now?\x1b[39m",
                    choices: ["Yes", "No"]
                }
            ]).then(function (answer) {
                switch (answer.purchase) {
                    case 'Yes':
                        idAndUnit();
                        break;

                    case 'No':
                        console.log("\x1b[93mThank you for using Bamazon! See you soon!\x1b[39m")
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
                message: "\x1b[92mWhat is the ID number of the product you would like to purchase?\x1b[39m",
                validate: function (value) {
                    if (isNaN(value) === false) 
                    {
                        return true;
                    }
                    return "\x1b[92mPlease enter a number.\x1b[39m";  
                }
            },
            {
                name: "unit",
                type: "input",
                message: "\x1b[92mHow many units would you like to purchase?\x1b[39m",
                validate: function (value) {
                    if (isNaN(value) === false) 
                    {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            connection.query("SELECT * FROM products WHERE item_id=?", answer.id, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    if (answer.unit > res[i].stock_quantity) {
                        console.log("\x1b[93mSorry! We do not have enough in stock. Please try again.\x1b[39m");
                        console.log("\x1b[96m***************************************\x1b[39m");
                        console.log("Item: " + res[i].product_name);
                        console.log("Department: " + res[i].department_name);
                        console.log("Price: " + res[i].price);
                        console.log("Stock: " + res[i].stock_quantity);
                        console.log("\x1b[96m***************************************\x1b[39m");
                        newOrder();
                    } else {
                        console.log("\x1b[96m***************************************\x1b[39m");
                        console.log("Item: " + res[i].product_name);
                        console.log("Department: " + res[i].department_name);
                        console.log("Price: " + res[i].price);
                        console.log("Quantity: " + answer.unit);
                        console.log("Total: " + res[i].price * answer.unit);
                        console.log("\x1b[96m***************************************\x1b[39m");

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
            console.log("\x1b[93mYour order has been placed. Thank you for your purchase.\x1b[39m");
            newOrder();
        }
    );
};

function newOrder() {
    inquirer
        .prompt({
            name: "newOrder",
            type: "list",
            message: "\x1b[92mWould you like to place another order?\x1b[39m",
            choices: ["Yes", "No"]
        })
        .then(function (answer) {
            if (answer.newOrder === "Yes") {
                console.log("\x1b[93mGreat!\x1b[39m")
                idAndUnit();
            } else {
                connection.end()
                console.log("\x1b[93mThank you for using Bamazon! See you soon!\x1b[39m")
            }
        });
}

//should i create new table




