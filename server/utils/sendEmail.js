const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    // إعداد سيرفر الإرسال (Nodemailer Transporter)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // إيميلك المسجل في .env
        pass: process.env.EMAIL_PASS  // كلمة سر التطبيقات App Password
      }
    });

    const mailOptions = {
      from: `"Online Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 تم إرسال البريد بنجاح إلى: ${to}`);
    return true;
  } catch (error) {
    console.error('❌ خطأ في إرسال البريد:', error);
    return false;
  }
};

module.exports = sendEmail;