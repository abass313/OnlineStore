const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ربط مسارات المصادقة
app.use('/api/auth', authRoutes);
app.use(express.urlencoded({ extended: true }));
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes)
app.get('/api/health', (req, res) => {
  res.json({ status: "Success", message: "السيرفر يعمل بنجاح ومستعد للتطوير!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});