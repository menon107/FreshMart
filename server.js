const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const SECRET_KEY = 'your-secret-key'; // In a real app, use an environment variable

// Predefined user
const user = {
  id: 1,
  username: 'johndoe',
  password: 'password123', // In a real app, this should be hashed
  name: 'John Doe',
  email: 'john@example.com',
  profilePicture: 'https://i.pravatar.cc/150?img=68'
};

// Grocery items
const groceries = [
  { id: 1, name: 'Apple', category: 'Fruits', price: 1.99, stock: 50, image: 'https://source.unsplash.com/100x100/?apple' },
  { id: 2, name: 'Banana', category: 'Fruits', price: 0.99, stock: 100, image: 'https://source.unsplash.com/100x100/?banana' },
  { id: 3, name: 'Milk', category: 'Dairy', price: 2.49, stock: 30, image: 'https://source.unsplash.com/100x100/?milk' },
  { id: 4, name: 'Bread', category: 'Bakery', price: 2.29, stock: 25, image: 'https://source.unsplash.com/100x100/?bread' },
  { id: 5, name: 'Chicken', category: 'Meat', price: 5.99, stock: 20, image: 'https://source.unsplash.com/100x100/?chicken' },
  { id: 6, name: 'Carrot', category: 'Vegetables', price: 0.99, stock: 75, image: 'https://source.unsplash.com/100x100/?carrot' },
  { id: 7, name: 'Cheese', category: 'Dairy', price: 3.99, stock: 40, image: 'https://source.unsplash.com/100x100/?cheese' },
  { id: 8, name: 'Tomato', category: 'Vegetables', price: 1.49, stock: 60, image: 'https://source.unsplash.com/100x100/?tomato' },
];

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { ...user, password: undefined } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/user', authenticateToken, (req, res) => {
  res.json({ ...user, password: undefined });
});

app.get('/api/groceries', authenticateToken, (req, res) => {
  res.json(groceries);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});