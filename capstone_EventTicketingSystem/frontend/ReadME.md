# Event Ticket Booking System - Frontend

This is the frontend for the Event Ticket Booking System. It is built using plain HTML, CSS, and JavaScript, and connects to backend APIs to handle user actions like login and registration.

---

## Project Structure

```
frontend/
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   └── auth.css
│   ├── js/
│   │   ├── config.js
│   │   ├── utils.js
│   │   ├── api.js
│   │   └── auth.js
│   └── images/
├── pages/
│   └── auth/
│       ├── login.html
│       └── register.html
└── index.html
```

---

## HTML

The HTML files define the structure of each page.

* `index.html` acts as the entry point.
* `login.html` and `register.html` contain the forms for user authentication.

---

## CSS

Styles are split in accordance to the applicability.

* `main.css` contains general styles used across the application.
* `auth.css` contains styles specific to login and registration pages.

This separation helps avoid clutter and makes it easier to update styles without affecting unrelated pages.

---

## JavaScript

JavaScript is modularly organized so that each file has a clear purpose.

* `config.js`
  Holds all constant values like API URLs, endpoints, storage keys, and validation patterns. Kinda like an .env file.
  To avoid hardcoding values throughout the code and ensuring future changes to be easier.

* `api.js`
  Handles all communication with the backend.
  Instead of calling `fetch` everywhere, all requests go through this file. It also takes care of attaching the authentication token automatically.

* `utils.js`
  Utility helper functions like saving tokens, checking session expiry, and basic validations.
  These are reusable functions implemented to be available throughout on a call from a single file.

* `auth.js`
  Manages login and registration behavior.
  It reads form inputs, validates them, sends requests using `api.js`, and handles responses like storing tokens or showing errors.
