const express = require('express');
const router = express.Router();
const upload = require('./upload'); // استيراد إعداد multer

// upload.single('image') تعني استلام صورة واحدة من الحقل المدخل باسم 'image'
router.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // التأكد من وجود صورة
    if (!req.file) {
      return res.status(400).json({ message: 'يرجى اختيار صورة للمنتج' });
    }

    // المسار الذي سيتم تخزينه في قاعدة البيانات
    const imagePath = `/uploads/${req.file.filename}`;

    /* 
      مثال للحفظ في قاعدة البيانات (MySQL أو MongoDB):
      INSERT INTO products (name, price, description, image_url) 
      VALUES (name, price, description, imagePath);
    */

    res.status(201).json({
      message: 'تم إضافة المنتج بنجاح!',
      product: {
        name,
        price,
        image_url: imagePath
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء إضافة المنتج', error: error.message });
  }
});

module.exports = router;