/* API fills the Products data variable. */
var products = [];

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

// Delete the product by its id using API
async function deleteProduct(id) {
    var updatedProducts = await API_deleteProduct(id);
    products = updatedProducts;
    renderProducts();
    updateAnalytics();
}

// Handle add product form submission through API
async function handleAddProduct(event) {
    event.preventDefault();

    var name = document.getElementById("product-name").value.trim();
    var price = parseFloat(document.getElementById("product-price").value);
    var stock = parseInt(document.getElementById("product-stock").value);
    var category = document.getElementById("product-category").value;

    // Validate inputs
    if (name === "") {
        alert("Please enter a product name.");
        return;
    }
    if (isNaN(price) || price <= 0) {
        alert("Please enter a valid price greater than 0.");
        return;
    }
    if (isNaN(stock) || stock < 0) {
        alert("Please enter a valid stock quantity.");
        return;
    }
    if (category === "") {
        alert("Please select a category.");
        return;
    }

    // Create new product with unique id using timestamp
    var newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        stock: stock,
        category: category
    };

    // Add to products array and save
    var updatedProducts = await API_addProduct(newProduct);
    products = updatedProducts;
    renderProducts();
    updateAnalytics();

    // Clear the form
    document.getElementById("add-product-form").reset();
}

// Handle delete button clicks using event delegation on the grid
document.getElementById("product-grid").addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        var id = Number(event.target.getAttribute("data-id"));
        deleteProduct(id);
    }
});

// Add event listener for form submission
document.getElementById("add-product-form").addEventListener("submit", handleAddProduct);

// Show the loading message and hide everything else
function showLoading() {
    document.getElementById("loading-message").style.display = "block";
    document.getElementById("controls").style.display = "none";
    document.getElementById("analytics").style.display = "none";
    document.getElementById("product-grid").style.display = "none";
    document.getElementById("add-product-section").style.display = "none";
}

// Hide the loading message and show everything
function hideLoading() {
    document.getElementById("loading-message").style.display = "none";
    document.getElementById("controls").style.display = "flex";
    document.getElementById("analytics").style.display = "flex";
    document.getElementById("product-grid").style.display = "grid";
    document.getElementById("add-product-section").style.display = "block";
}

// Load products from the API when page starts
async function loadProducts() {
    showLoading();
    var data = await API_getProducts();
    products = data;
    hideLoading();
    renderProducts();
    updateAnalytics();
}

// Start the service.
loadProducts();