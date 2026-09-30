const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

// تخزين مؤقت للمستخدمين والأكواد في الذاكرة (In-Memory Database)
const users = []; 
const otpStore = {}; // { "email@example.com": { code: "123456", expiresAt: Date } }

// 1. مسار تسجيل الحساب وإرسال الـ OTP
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "يرجى تعبئة جميع الحقول المطلوبة" });
  }

  // توليد كود تحقق عشوائي من 6 أرقام
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // حفظ الكود مع وقت انتهاء (5 دقائق)
  otpStore[email] = {
    code: otpCode,
    expiresAt: Date.now() + 5 * 60 * 1000,
    userData: { username, email, password }
  };

  // إرسال الإيميل
  const emailSent = await sendEmail(
    email,
    "كود التحقق الخاص بك - Online Store",
    `مرحباً ${username}، كود التحقق الخاص بك هو: ${otpCode}`
  );

  if (emailSent) {
    res.json({ status: "Success", message: "تم إرسال كود التحقق إلى بريدك الإلكتروني" });
  } else {
    res.status(500).json({ message: "فشل إرسال كود التحقق، تحقق من إعدادات البريد" });
  }
});

// 2. مسار التحقق من كود الـ OTP وإنشاء الحساب
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: "لم يتم طلب كود لهذا البريد أو انتهت صلاحيته" });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "انتهت صلاحية كود التحقق" });
  }

  if (record.code !== otp) {
    return res.status(400).json({ message: "كود التحقق غير صحيح" });
  }

  // حفظ المستخدم نهائياً وتصفير الكود
  users.push(record.userData);
  delete otpStore[email];

  res.json({ status: "Success", message: "تم التحقق بنجاح وإنشاء الحساب!" });
});

module.exports = router;