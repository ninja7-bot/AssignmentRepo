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

// Get filtered and sorted products based on current controls
function getFilteredProducts() {
    var searchText = document.getElementById("search-input").value.toLowerCase();
    var categoryValue = document.getElementById("category-filter").value;
    var lowStockChecked = document.getElementById("low-stock-filter").checked;
    var sortValue = document.getElementById("sort-option").value;

    // Start with all products
    var filtered = products;

    // Filter by search text
    filtered = filtered.filter(function (product) {
        return product.name.toLowerCase().indexOf(searchText) !== -1;
    });

    // Filter by category
    if (categoryValue !== "all") {
        filtered = filtered.filter(function (product) {
            return product.category === categoryValue;
        });
    }

    // Filter by low stock
    if (lowStockChecked) {
        filtered = filtered.filter(function (product) {
            return product.stock < 5;
        });
    }
    // Sort products
    if (sortValue === "price-low") {
        filtered.sort(function (a, b) { return a.price - b.price; });
    } else if (sortValue === "price-high") {
        filtered.sort(function (a, b) { return b.price - a.price; });
    } else if (sortValue === "name-az") {
        filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });
    } else if (sortValue === "name-za") {
        filtered.sort(function (a, b) { return b.name.localeCompare(a.name); });
    }

    return filtered;
}

// Add event listeners for search and filters
document.getElementById("search-input").addEventListener("input", renderProducts);
document.getElementById("category-filter").addEventListener("change", renderProducts);
document.getElementById("low-stock-filter").addEventListener("change", renderProducts);
document.getElementById("sort-option").addEventListener("change", renderProducts);

// Update analytics section based on current inventory
function updateAnalytics() {
    // Count total products
    var totalProducts = products.length;

    // Calculate total inventory value (price * stock)
    var totalValue = 0;
    for (var i = 0; i < products.length; i++) {
        totalValue = totalValue + (products[i].price * products[i].stock);
    }

    // Count out of stock products
    var outOfStock = 0;
    for (var i = 0; i < products.length; i++) {
        if (products[i].stock === 0) {
            outOfStock = outOfStock + 1;
        }
    }

    // Display the values
    document.getElementById("total-products").textContent = totalProducts;
    document.getElementById("total-value").textContent = "₹" + totalValue;
    document.getElementById("out-of-stock").textContent = outOfStock;
}

// Call on page load
updateAnalytics();