/* 2. Default Products data variable. */
var defaultProducts = [
    { id: 1, name: "Laptop", price: 55000, stock: 5, category: "electronics" },
    { id: 2, name: "Headphones", price: 1500, stock: 12, category: "electronics" },
    { id: 3, name: "Smartphone", price: 25000, stock: 0, category: "electronics" },
    { id: 4, name: "T-Shirt", price: 500, stock: 20, category: "clothing" },
    { id: 5, name: "Jeans", price: 1200, stock: 3, category: "clothing" },
    { id: 6, name: "Jacket", price: 2500, stock: 0, category: "clothing" },
    { id: 7, name: "JavaScript Book", price: 450, stock: 8, category: "books" },
    { id: 8, name: "HTML & CSS Guide", price: 350, stock: 2, category: "books" },
    { id: 9, name: "Wrist Watch", price: 3000, stock: 7, category: "accessories" },
    { id: 10, name: "Sunglasses", price: 800, stock: 4, category: "accessories" }
];

// Load products from localStorage or use defaults
var products = JSON.parse(localStorage.getItem("products")) || defaultProducts;

// Save products to localStorage
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

// Render product cards to the grid
function renderProducts() {
    var grid = document.getElementById("product-grid");
    grid.innerHTML = "";

    var filtered = getFilteredProducts();

    // Show message if no products found
    if (filtered.length === 0) {
        var msg = document.createElement("p");
        msg.id = "no-products-msg";
        msg.textContent = "No products found.";
        grid.appendChild(msg);
        return;
    }

    // Create a card for each product
    for (var i = 0; i < filtered.length; i++) {
        var product = filtered[i];
        var card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML =
            "<h3>" + product.name + "</h3>" +
            "<p>Category: " + product.category + "</p>" +
            "<p>Price: ₹" + product.price + "</p>" +
            "<p>Stock: " + product.stock + "</p>" +
            "<button class='delete-btn' data-id='" + product.id + "'>Delete</button>";

        grid.appendChild(card);
    }
}

// Initial render when page loads
renderProducts();