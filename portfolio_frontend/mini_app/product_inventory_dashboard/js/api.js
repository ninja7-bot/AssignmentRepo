/* DUMMY API Script File created to simulate the interaction between 
        db.json <--> api.js <--> script.js <--> index.html
    This file handles four major functions:
        1. Get Products 
        2. Add Products
        3. Delete Products
        4. Update Product
    Each function is self explanatory. 

    The script works on GET AND POST. GET to fetch data and POST to push data.
*/

// GET - Fetch all products
async function getProducts() {

    var stored = localStorage.getItem("products");

    if (stored) {
        return JSON.parse(stored);
    }

    // If localStorage is empty, fetch from db.json
    var response = await fetch("db.json");
    var data = await response.json();
    localStorage.setItem("products", JSON.stringify(data));
    return data;
}

// POST - Add a new product
async function addProduct(product) {
    var stored = localStorage.getItem("products");
    var products = stored ? JSON.parse(stored) : [];
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    return products;
}

// DELETE - Remove a product by id
async function deleteProduct(id) {
    var stored = localStorage.getItem("products");
    var products = stored ? JSON.parse(stored) : [];
    products = products.filter(function (product) {
        return product.id !== id;
    });
    localStorage.setItem("products", JSON.stringify(products));
    return products;
}

// PUT - Update a product by id
async function updateProduct(id, updatedFields) {
    var stored = localStorage.getItem("products");
    var products = stored ? JSON.parse(stored) : [];
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            if (updatedFields.name !== undefined) products[i].name = updatedFields.name;
            if (updatedFields.price !== undefined) products[i].price = updatedFields.price;
            if (updatedFields.stock !== undefined) products[i].stock = updatedFields.stock;
            if (updatedFields.category !== undefined) products[i].category = updatedFields.category;
            break;
        }
    }
    localStorage.setItem("products", JSON.stringify(products));
    return products;
}