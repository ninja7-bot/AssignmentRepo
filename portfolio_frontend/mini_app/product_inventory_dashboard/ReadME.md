# Product Inventory Dashboard | API Testing Branch

A simple Frontend project built using HTML, CSS and JS (Vanilla) based Product Inventory Dashboard. 

The Dashboard uses pure CSS and JS without external libraries or frameworks.

The dashboard allows users to view, search, filter, sort, and manage products. All data is stored in the browser using localStorage so it persists across page reloads.

* Use db.json and api.js to coordinate between data calls.
```
        db.json <--> api.js <--> script.js <--> html
```

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
- Data storage to a db.json mock storage.

## Repo Structure

```
product_inventory_dashboard/       (Testing Branch Repository Folder)
│
├── html/                
│   └── index.html
├── css/             
│   └── style.css
├── js/          
│   ├── api.js
│   └── script.js
├── db/          
│   └── db.json
│           
└── ReadME.md
```

## Branch Structure

```
product_inventory_dashboard/       (Root Repository Folder)
│
├── frontend/mini_app The main production branch.
│
└── test/_api_mock The mock API and DB Integration branch. <-- Current Branch
```