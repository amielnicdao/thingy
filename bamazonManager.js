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

function addNewProduct() {
    inquirer
    .prompt([
        {
            name: "productName",
            type: "input",
            message: "Enter the product name of the item you would like to add."
        },
        {
            name: "departmentName",
            type: "input",
            message: "Enter which department the product should go into.",
            choices: ["Electronics", "Kitchen", "Accessories", "Clothing", "Returns"]
        },
        {
            name: "price",
            type: "input",
            message: "Enter the price of the item.",
            validate: function (value) {
                if (isNaN(value) === false) 
                {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter the quantity.",
            validate: function (value) {
                if (isNaN(value) === false) 
                {
                    return true;
                }
                return false;
            }
        }
    ]).then (function (answer) {
        connection.query("INSERT INTO products SET ? ", {
            product_name: answer.productName,
            department_name: answer.departmentName,
            price: answer.price,
            stock_quantity: answer.quantity
        }, function (err, res) {
            if (err) throw err;
            console.log("\x1b[93mThe product has been added!\x1b[39m"),
            console.log("Item: " + answer.productName),
            console.log("Department: " + answer.departmentName),
            console.log("Price: " + answer.price),
            console.log("Quantity: " + answer.quantity)
        }
        )
    })
}