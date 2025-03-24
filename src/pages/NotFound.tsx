
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-8">الصفحة غير موجودة</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها أو حذفها.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
};

export default NotFound;
