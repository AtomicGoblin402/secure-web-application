require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

app.use(cors());
app.use(express.json());

// --- Middleware ---

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided.' });

  const bearer = token.split(' ');
  const tokenValue = bearer.length === 2 ? bearer[1] : token;

  jwt.verify(tokenValue, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// --- Routes ---

app.get('/', (req, res) => {
  res.send('Secure Backend is running!');
});

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Default role is 'user'. 
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    res.status(201).json({ message: 'User registered successfully.', userID: newUser.id });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login (Updated to return name)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Profile Update Endpoint
app.put('/api/user/profile', verifyToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(409).json({ message: 'Email already in use.' });
      user.email = email;
    }
    if (name) user.name = name;

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully.', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Profile Update Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Password Update Endpoint
app.put('/api/user/password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required.' });
  }

  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password Update Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Protected Route (Any authenticated user)
app.get('/api/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome to the dashboard, User ${req.userId} (${req.userRole})!` });
});

// Admin Route (RBAC)
app.get('/api/admin', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Welcome to the Admin Panel.' });
});

// Sync and Start
const startServer = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.sync({ alter: true }); // Enable alter to update schema
      console.log('Database synced successfully.');
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
      break;
    } catch (err) {
      console.error('Database sync failed:', err);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        process.exit(1);
      }
      // Wait for 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

startServer();