# BlinkBasket Ecommerce Application

BlinkBasket is a modular Ecommerce Web Application built using:

- HTML
- CSS
- JavaScript
- Firebase Authentication
- Firestore Database
- Axios

The application supports:

- User Authentication
- Role-Based Access
- Product Management
- Cart Management
- Checkout System
- Invoice Generation
- Inventory Management
- Reports Dashboard

---

# Features

## Customer Features

- User Registration & Login
- Browse Products
- Search Products
- Category Filtering
- Add To Cart
- Quantity Management
- Checkout
- UPI Payment
- Invoice Generation
- Order History

---

## Admin Features

- Admin Login
- Add Products
- Edit Products
- Delete Products
- Inventory Tracking
- Reports Dashboard
- Sales Analytics
- Customer Analytics
- Stock Monitoring

---

# Technologies Used

| Technology              | Purpose             |
| ----------------------- | ------------------- |
| HTML                    | Structure           |
| CSS                     | Styling             |
| JavaScript              | Application Logic   |
| Firebase Authentication | User Login/Register |
| Firestore Database      | Backend Database    |
| Axios                   | API Requests        |
| Live Server             | Local Development   |

---

# Project Structure

```plaintext
shopping-app/
│
├── index.html
├── css/
│   ├── main.css
│   ├── responsive.css
│   │
│   ├── base/
│   │   └── reset.css
│   │
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   └── forms.css
│   │
│   ├── layouts/
│   │   ├── grid.css
│   │   └── navbar.css
│   │
│   └── pages/
│       ├── admin.css
│       ├── auth.css
│       ├── cart.css
│       ├── checkout.css
│       ├── home.css
│       ├── invoice.css
│       ├── login.css
│       ├── orders.css
│       ├── products.css
│       └── reports.css
│
├── js/
│   ├── app.js
│   │
│   ├── auth/
│   │   ├── adminGuard.js
│   │   └── auth.js
│   │
│   ├── cart/
│   │   └── cart.js
│   │
│   ├── config/
│   │   └── firebase.js
│   │
│   ├── invoice/
│   │   └── invoice.js
│   │
│   ├── order/
│   │   ├── checkout.js
│   │   └── orders.js
│   │
│   ├── product/
│   │   ├── Product.js
│   │   └── userProducts.js
│   │
│   ├── reports/
│   │   └── reports.js
│
└── pages/
    ├── admin.html
    ├── cart.html
    ├── checkout.html
    ├── invoice.html
    ├── login.html
    ├── orders.html
    ├── products.html
    ├── register.html
    └── reports.html
```

---

# File Descriptions

## Root Files

| File           | Purpose                           |
| -------------- | --------------------------------- |
| index.html     | Homepage                          |
| main.css       | Main stylesheet importing all CSS |
| responsive.css | Responsive design rules           |

---

# CSS Structure

## base/

| File      | Purpose             |
| --------- | ------------------- |
| reset.css | Browser style reset |

---

## components/

| File        | Purpose             |
| ----------- | ------------------- |
| buttons.css | Button styles       |
| cards.css   | Product card styles |
| forms.css   | Form styles         |

---

## layouts/

| File       | Purpose        |
| ---------- | -------------- |
| grid.css   | Grid layouts   |
| navbar.css | Navbar styling |

---

## pages/

| File         | Purpose                  |
| ------------ | ------------------------ |
| admin.css    | Admin dashboard styles   |
| auth.css     | Login/Register styles    |
| cart.css     | Cart page styles         |
| checkout.css | Checkout page styles     |
| home.css     | Homepage styles          |
| invoice.css  | Invoice page styles      |
| login.css    | Login page styles        |
| orders.css   | Order history styles     |
| products.css | Product page styles      |
| reports.css  | Reports dashboard styles |

---

# JavaScript Structure

## config/

| File        | Purpose                |
| ----------- | ---------------------- |
| firebase.js | Firebase configuration |

---

## auth/

| File          | Purpose              |
| ------------- | -------------------- |
| auth.js       | Login/Register logic |
| adminGuard.js | Protect admin routes |

---

## product/

| File            | Purpose               |
| --------------- | --------------------- |
| Product.js      | Admin product CRUD    |
| userProducts.js | User product browsing |

---

## cart/

| File    | Purpose         |
| ------- | --------------- |
| cart.js | Cart management |

---

## order/

| File        | Purpose          |
| ----------- | ---------------- |
| checkout.js | Checkout process |
| orders.js   | Order history    |

---

## invoice/

| File       | Purpose           |
| ---------- | ----------------- |
| invoice.js | Invoice rendering |

---

## reports/

| File       | Purpose                   |
| ---------- | ------------------------- |
| reports.js | Admin reports & analytics |

---

# Firebase Backend Usage

Firebase is used as the backend service.

---

## Firebase Authentication

Used for:

- User Registration
- User Login
- Role-Based Authentication

Example:

```js
createUserWithEmailAndPassword();

signInWithEmailAndPassword();

onAuthStateChanged();
```

---

## Firestore Database

Used for storing:

- Users
- Products
- Categories
- Cart Items
- Orders
- Invoices
- Reports Data

---

# Firestore Collections

## users

```js
{
  (uid, email, role);
}
```

---

## products

```js
{
  (title, description, price, stock, categoryName, imageURL);
}
```

---

## cart

```js
{
  (userId, productId, quantity, totalPrice);
}
```

---

## orders

```js
{
  (userId, items, totalAmount, paymentMethod, orderStatus);
}
```

---

## invoices

```js
{
  (orderId, invoiceNumber, totalAmount);
}
```

---

# Admin Credentials

```plaintext
Email    : admintest@gmail.com
Password : admint
```

---

# Customer Credentials

```plaintext
Email    : test1@gmail.com
Password : test1
```

---

# How To Run The Project

## Step 1 — Install VS Code

Download:

```plaintext
https://code.visualstudio.com/
```

---

## Step 2 — Install Live Server Extension

Inside VS Code:

- Open Extensions
- Search:

```plaintext
Live Server
```

- Install Extension

---

## Step 3 — Open Project Folder

Open:

```plaintext
shopping-app
```

folder in VS Code.

---

## Step 4 — Start Live Server

Right click:

```plaintext
index.html
```

Click:

```plaintext
Open With Live Server
```

---

## Step 5 — Firebase Setup

Inside:

```plaintext
js/config/firebase.js
```

add your Firebase configuration:

```js
const firebaseConfig = {
  apiKey: "...",

  authDomain: "...",

  projectId: "...",

  storageBucket: "...",

  messagingSenderId: "...",

  appId: "...",
};
```

---

# Firestore Rules

Example development rules:

```js
rules_version = '2';

service cloud.firestore {

  match /databases/{database}/documents {

    match /{document=**} {

      allow read, write: if true;
    }
  }
}
```

---

# Reports Dashboard

Admin can view:

- Customer Reports
- Inventory Reports
- Sales Reports
- Top Selling Products
- Low Stock Products
- Category-wise Analytics

---

# UI Theme

Primary Color:

```plaintext
#106EBE
```

Accent Color:

```plaintext
#0FFCBE
```

---

# Future Improvements

- Stripe Payment Integration
- Email Notifications
- Product Reviews
- Wishlist
- Admin Charts
- Export Reports
- Dark Mode
- Real-time Inventory Updates

---

# Conclusion

BlinkBasket is a modular Firebase-powered ecommerce web application demonstrating:

- Frontend Development
- Firebase Integration
- Authentication
- CRUD Operations
- Inventory Management
- Ecommerce Workflow
- Admin Reporting System
- Role-Based Security
