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
│   └── index.html Launch here
├── css/             
│   └── style.css Syling
├── js/          
│   ├── api.js API Mock 
│   └── script.js Logical Integration
├── db/          
│   └── db.json Database
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

## Screenshots

[![image.png](https://i.postimg.cc/nL3msnSM/image.png)](https://postimg.cc/7CThdrky)
Product Inventory Dashboard with the Search, Sort and Categories Section.
Also, showcases the Product Grid.

[![image.png](https://i.postimg.cc/9zHw3001/image.png)](https://postimg.cc/9w1QZWGq)
Add Product Form

[![image.png](https://i.postimg.cc/JntT6rst/image.png)](https://postimg.cc/PpszNkzk)
The Data being stored in the localStorage.

[![image.png](https://i.postimg.cc/7Lj74wBJ/image.png)](https://postimg.cc/1gc4ch1y)
db.json structure.