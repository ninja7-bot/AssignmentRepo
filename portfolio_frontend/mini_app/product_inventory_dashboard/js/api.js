/* DUMMY API Script File created to simulate the interaction between 
        db.json <--> api.js <--> script.js <--> index.html
    This file handles three major functions:
        1. Get Products 
        2. Add Products
        3. Delete Products
    Each function is self explanatory. 

    The script works on GET AND POST. GET to fetch data and POST to push data.
*/

// GET - Fetch all products
async function API_getProducts() {
    var stored = localStorage.getItem("products");

    if (stored) {
        return JSON.parse(stored);
    }

    // If localStorage is empty, fetch from db.json
    var response = await fetch("../db/db.json");

    if (response) {
        console.log("Fetched")
    }

    var data = await response.json();
    localStorage.setItem("products", JSON.stringify(data));
    return data;
}

// POST - Add a new product
async function API_addProduct(product) {
    var stored = localStorage.getItem("products");
    var products = stored ? JSON.parse(stored) : [];
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    return products;
}

// DELETE - Remove a product by id
async function API_deleteProduct(id) {
    var stored = localStorage.getItem("products");
    var products = stored ? JSON.parse(stored) : [];
    products = products.filter(function (product) {
        return product.id !== id;
    });
    localStorage.setItem("products", JSON.stringify(products));
    return products;
}