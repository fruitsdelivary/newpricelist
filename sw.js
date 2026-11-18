const CACHE_NAME = 'tawfeer-delivery-v2'; // قم بتغيير رقم الإصدار (v2, v3...) مع كل تحديث جديد ترفعه
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. التثبيت الجبري وتخطي الانتظار لتحديث الملفات فوراً
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // فرض تفعيل النسخة الجديدة فوراً
});

// 2. تفعيل النسخة الجديدة وحذف الكاش القديم تماماً والسيطرة الفورية
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // حذف الكاش القديم
          }
        })
      );
    })
  );
  self.clients.claim(); // السيطرة الفورية على جميع الصفحات المفتوحة
});

// 3. استراتيجية الجلب (الشبكة أولاً ثم الكاش لضمان جلب أحدث بيانات)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
