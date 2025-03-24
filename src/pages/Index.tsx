
import React from 'react';
import { SurahList } from '../components/SurahList';
import { BookOpen, Headphones, BookmarkIcon, SearchIcon } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "القرآن الكريم والترجمة",
      description: "اقرأ القرآن الكريم الكامل مع ترجمة الآيات"
    },
    {
      icon: Headphones,
      title: "الاستماع للتلاوة",
      description: "استمع إلى تلاوات جميلة أثناء القراءة"
    },
    {
      icon: BookmarkIcon,
      title: "المفضلة",
      description: "احفظ الآيات لزيارتها لاحقاً"
    },
    {
      icon: SearchIcon,
      title: "البحث",
      description: "ابحث عن آيات بالكلمات أو العبارات"
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto mb-16">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-elements">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="font-arabic block text-5xl md:text-6xl mb-4">القرآن الكريم</span>
            قارئ القرآن الكريم
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            تطبيق جميل وحديث للقرآن الكريم مع ميزات قوية لتحسين تجربة القراءة الخاصة بك
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {features.map((feature, index) => (
              <div key={index} className="glass p-5 rounded-xl text-center">
                <div className="flex justify-center mb-4">
                  <feature.icon size={28} className="text-foreground/80" />
                </div>
                <h3 className="font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">فهرس السور</h2>
          <SurahList />
        </div>
      </div>
    </div>
  );
};

export default Index;
