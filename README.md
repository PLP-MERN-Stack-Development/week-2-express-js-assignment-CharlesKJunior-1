# 🛍️ Product API - Week 2 Assignment

This is a simple Express.js RESTful API that manages a product inventory system. It supports full CRUD operations, product filtering, searching, and statistics generation. It also demonstrates the use of middleware, validation, authentication using API keys, and error handling.

## 🚀 Features

- In-memory product data management (no database required)
- RESTful routes for full CRUD
- API key-based authentication
- Input validation
- Product filtering with pagination
- Search functionality
- Statistics endpoint
- Custom logging and error handling

## 📁 File Structure

project-root/
│
├── server.js # Main Express server
├── .env # Environment variables (API_KEY, PORT, etc.)
└── README.md # Documentation (this file)



## 🧪 Tech Stack

- Node.js
- Express.js
- Body-parser
- UUID
- dotenv

## 🔑 API Authentication

All API routes (except `/`) require an API key. Include it in the request header:


Set your API key in a `.env` file like this:

```env
API_KEY=your_api_key
PORT=3000
⚙️ Setup Instructions
Clone the repository

git clone https://github.com/CharlesKJunior/product-api.git
cd product-api
Install dependencies

npm install
Create .env file

API_KEY=123456
PORT=3000
Run the server

node server.js
📡 API Endpoints
Root
GET /
→ Welcome message

Products CRUD
GET /api/products
→ Get all products (supports ?category=electronics, ?page=1&limit=2)

GET /api/products/:id
→ Get a product by ID

POST /api/products
→ Add a new product
Required fields:

{
  "name": "Laptop",
  "description": "High performance",
  "price": 1000,
  "category": "electronics",
  "inStock": true
}
PUT /api/products/:id
→ Update a product by ID (same structure as POST)

DELETE /api/products/:id
→ Delete a product by ID

Advanced Features
GET /api/products/search?q=term
→ Search products by name

GET /api/products/stats
→ Get product statistics:

{
  "totalProducts": 3,
  "inStock": 2,
  "outOfStock": 1,
  "byCategory": {
    "electronics": 2,
    "kitchen": 1
  }
}
🛡️ Middleware
Logger Middleware
Logs every request with timestamp, method, and URL.

API Key Middleware
Validates the presence and correctness of x-api-key in headers.

Validation Middleware
Validates required fields for product creation and update.

❌ Error Handling
Centralized error handler responds with:

Error name

Message

Stack trace (only in development mode)

Custom error classes include:

NotFoundError

ValidationError

📓 Sample Request (using curl)

curl -X POST http://localhost:3000/api/products \
-H "Content-Type: application/json" \
-H "x-api-key: 123456" \
-d '{
  "name": "Headphones",
  "description": "Wireless with noise cancellation",
  "price": 150,
  "category": "electronics",
  "inStock": true
}'
🧑‍💻 Author
Mutebwa Charles
Student-Full-stack Developer | Week 2 Assignment — Power Learn Project

📃 License
This project is for educational purposes only. Feel free to modify and reuse as needed.