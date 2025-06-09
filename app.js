// server.js - Complete Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Custom logger middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Authentication middleware
const apiKeyMiddleware = (req, res, next) => {
  // Skip auth for root route
  if (req.path === '/') return next();
  
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Invalid or missing API key' });
  }
  
  next();
};

// Validation middleware
const validateProductMiddleware = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  
  if (!name || !description || !price || !category || typeof inStock !== 'boolean') {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: {
        ...(!name && { name: 'Name is required' }),
        ...(!description && { description: 'Description is required' }),
        ...(!price && { price: 'Price is required' }),
        ...(!category && { category: 'Category is required' }),
        ...(typeof inStock !== 'boolean' && { inStock: 'inStock must be a boolean' })
      }
    });
  }
  
  next();
};

// Apply middleware
app.use(loggerMiddleware);
app.use(apiKeyMiddleware);

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// Product Routes
app.get('/api/products', (req, res) => {
  let filteredProducts = [...products];
  
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = {
    total: filteredProducts.length,
    page,
    limit,
    totalPages: Math.ceil(filteredProducts.length / limit),
    data: filteredProducts.slice(startIndex, endIndex)
  };
  
  res.json(results);
});

app.get('/api/products/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new NotFoundError('Product not found'));
  }
  res.json(product);
});

app.post('/api/products', validateProductMiddleware, (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', validateProductMiddleware, (req, res, next) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return next(new NotFoundError('Product not found'));
  }

  const { name, description, price, category, inStock } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    name,
    description,
    price,
    category,
    inStock
  };

  res.json(products[productIndex]);
});

app.delete('/api/products/:id', (req, res, next) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return next(new NotFoundError('Product not found'));
  }

  products = products.filter(p => p.id !== req.params.id);
  res.status(204).end();
});

// Advanced Features
app.get('/api/products/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ message: 'Search query (q) is required' });
  }
  
  const searchResults = products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json(searchResults);
});

app.get('/api/products/stats', (req, res) => {
  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    byCategory: products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {})
  };
  
  res.json(stats);
});

// Custom error classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      name: err.name,
      message,
      ...(err.errors && { errors: err.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;