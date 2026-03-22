# Product Inventory Dashboard

A simple Frontend project built using HTML, CSS and JS (Vanilla) based Product Inventory Dashboard. 

The Dashboard uses pure CSS and JS without external libraries or frameworks.

The dashboard allows users to view, search, filter, sort, and manage products. All data is stored in the browser using localStorage so it persists across page reloads.

## Features

- View products in a grid layout
- Search products by name (real-time, case-insensitive)
- Filter by category (Electronics, Clothing, Books, Accessories)
- Filter low stock products (stock less than 5)
- Sort by price (Low to High / High to Low) and name (A-Z / Z-A)
- Add new products using a form with validation
- Delete products from the inventory
- Inventory analytics (total products, total value, out of stock count)
- Data persistence using localStorage

## Repo Structure

```
product_inventory_dashboard/       (Root Repository Folder)
│
├── html/                
│   └── index.html
├── css/             
│   └── style.css
├── js/          
│   └── script.js
│           
└── ReadME.md
```

## Branch Structure

```
product_inventory_dashboard/       (Root Repository Folder)
│
├── main Main Parent Branch.
│
├── frontend/mini_app The main production branch. <-- Current Branch
│
└── test/_api_mock The mock API and DB Integration branch.
```