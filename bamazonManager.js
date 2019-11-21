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

function addToInventory() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "\x1b[92mWhat is the ID number of the product you would like to add to?\x1b[39m",
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
                message: "\x1b[92mHow many units would you like to add?\x1b[39m",
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
                        console.log("\x1b[93mThe inventory has been updated!\x1b[39m");
                        console.log("\x1b[96m***************************************\x1b[39m");
                        console.log("Item: " + res[i].product_name);
                        console.log("Department: " + res[i].department_name);
                        console.log("Price: " + res[i].price);
                        console.log("Quantity: " + answer.unit);
                        console.log("\x1b[96m***************************************\x1b[39m");

                        var updateStock = res[i].stock_quantity + answer.unit;
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
        }
    );
};

// function addToInventory() {
//     inquirer
//     .prompt([
//         {
//             name: "id",
//             type: "input",
//             message: "Please enter the ID number of the item you would like to add to.",
//             validate: function (value) {
//                 if (isNaN(value) === false) 
//                 {
//                     return true;
//                 }
//                 return "\x1b[92mPlease enter a number.\x1b[39m";  
//             }
//         },
//         {
//             name: "unit",
//             type: "input",
//             message: "How many units would you like to add?",
//             validate: function (value) {
//                 if (isNaN(value) === false) 
//                 {
//                     return true;
//                 }
//                 return "\x1b[92mPlease enter a number.\x1b[39m";
//             }
//           }
//         ]).then(function (answer) {
//             var itemId = answer.id;
//             connection.query("SELECT * FROM products WHERE ?", [{item_id: itemId}], function (err, res) {
//                 var updateStock = res[0].stock_quantity + answer.unit;
//                 updateDB(updateStock, itemId);
//                 if (err) throw (err);
//                 console.log("You added " + answer.unit + "to the inventory.") 
//             connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: updateStock }, { item_id: itemId }], function (err, res) {
//                 if (err) throw err;
//             })
//             })
            
//         }) 
// }

