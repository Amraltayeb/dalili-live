export default function ArabicHomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          مرحباً بك في دليلي لايف
        </h1>
        <p className="text-xl mb-8">
          دليلك التجاري في الوقت الحقيقي لمنطقة الشرق الأوسط وشمال أفريقيا
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">ابحث عن الشركات</h2>
            <p>اكتشف أفضل الشركات في منطقة الشرق الأوسط وشمال أفريقيا</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">اقرأ التقييمات</h2>
            <p>تعرف على آراء الآخرين حول الشركات المحلية</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">اكتب تقييمات</h2>
            <p>شارك تجاربك مع المجتمع</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">أصحاب الأعمال</h2>
            <p>احصل على إدارة قائمة عملك</p>
          </div>
        </div>

        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
          ابدأ الآن
        </button>
      </div>
    </div>
  );
} 