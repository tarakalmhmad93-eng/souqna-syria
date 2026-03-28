const express = require('express');
const app = express();

// إعدادات لقراءة البيانات المرسلة من لوحة التحكم
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let products = []; // مصفوفة لتخزين المنتجات مؤقتاً

const siteConfig = {
  name: "سوقنا | Souqna",
  currency: "ل.س"
};

// 1. الصفحة الرئيسية (واجهة الزبائن)
app.get('/', (req, res) => {
  let productCards = products.map(p => `
    <div style="border:1px solid #ccc; padding:15px; margin:10px; border-radius:10px; background:#f9f9f9; width:200px;">
      <img src="${p.image}" width="100%" style="border-radius:5px; height:150px; object-fit:cover;">
      <h3 style="color:#333;">${p.name}</h3>
      <p style="font-weight:bold; color:green;">السعر: ${p.price} ${siteConfig.currency}</p>
      <small>الفئة: ${p.category || 'عام'}</small>
    </div>
  `).join('');

  res.send(`
    <html>
      <head>
        <title>${siteConfig.name}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial; text-align: center; direction: rtl; background:#eee; margin:0;">
        <header style="background:#222; color:white; padding:20px;"><h1>${siteConfig.name}</h1></header>
        <div style="display:flex; flex-wrap:wrap; justify-content:center; padding:20px;">
          ${products.length > 0 ? productCards : '<h3>لا توجد منتجات حالياً، أضف أول منتج من لوحة التحكم</h3>'}
        </div>
        <footer style="margin-top:50px; padding:20px; background:#ddd;">
          <p>© 2026 ${siteConfig.name}</p>
          <a href="/admin" style="color: #777; text-decoration: none; font-size:12px;">دخول المشرف</a>
        </footer>
      </body>
    </html>
  `);
});

// 2. لوحة التحكم (لإضافة المنتجات)
app.get('/admin', (req, res) => {
  res.send(`
    <div style="direction: rtl; text-align: center; padding:20px; font-family:Arial;">
      <h2>لوحة تحكم سوقنا - إضافة منتج جديد</h2>
      <form action="/add-product" method="POST" style="display:inline-block; text-align:right; border:1px solid #ccc; padding:20px; border-radius:10px; background:white; width:90%; max-width:400px;">
        <label>اسم المنتج:</label><br><input name="name" required style="width:100%; padding:8px; margin:5px 0;"><br>
        <label>السعر:</label><br><input name="price" required style="width:100%; padding:8px; margin:5px 0;"><br>
        <label>الفئة:</label><br><input name="category" placeholder="مثلاً: ملابس" style="width:100%; padding:8px; margin:5px 0;"><br>
        <label>رابط الصورة:</label><br><input name="image" placeholder="https://..." required style="width:100%; padding:8px; margin:5px 0;"><br><br>
        <button type="submit" style="width:100%; background:green; color:white; border:none; padding:12px; cursor:pointer; border-radius:5px;">نشر المنتج في المتجر</button>
      </form>
      <br><br><a href="/">العودة للمتجر</a>
    </div>
  `);
});

// 3. معالجة البيانات وحفظها
app.post('/add-product', (req, res) => {
  products.push(req.body);
  res.redirect('/');
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('✅ المتجر جاهز على الرابط!');
});
