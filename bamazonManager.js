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
    menu();
});

function menu() {
    inquirer
    .prompt([
        {
            name: "menuOptions",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (answer) {
        switch(answer.menuOptions) {
            case 'View Products for Sale':
                allItems();
                break;
            
            case 'View Low Inventory':
                viewLowInventory();
                break;

            case 'Add to Inventory':
                addToInventory();
                break;
            
            case 'Add New Product':
                addNewProduct();
                break;
        }
    })
}

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
        };
    });
};

function viewLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw (err);
        for (var i = 0; i < res.length; i++) {
            if(res[i].stock_quantity < 5) {
        console.log("\x1b[96m***************************************\x1b[39m");
        console.log("Item ID: " + res[i].item_id);
        console.log("Product Name: " + res[i].product_name);
        console.log("Department Name: " + res[i].department_name);
        console.log("Price: " + res[i].price);
        console.log("Stock: " + res[i].stock_quantity);
        };
    };
 });
};

