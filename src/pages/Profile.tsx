
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthProvider';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    font_size: 'medium',
    reciter: 'ar.alafasy',
    translation_source: 'ar'
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPreferences();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) setUsername(data.username || '');
    } catch (error: any) {
      console.error('خطأ في جلب الملف الشخصي:', error.message);
    }
  };

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setPreferences({
          theme: data.theme,
          font_size: data.font_size,
          reciter: data.reciter,
          translation_source: data.translation_source
        });
      }
    } catch (error: any) {
      console.error('خطأ في جلب التفضيلات:', error.message);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user?.id);

      if (error) throw error;
      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم تحديث الملف الشخصي بنجاح',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء تحديث الملف الشخصي',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: any) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(newPreferences)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setPreferences({
        ...preferences,
        ...newPreferences
      });
      
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ التفضيلات بنجاح',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء حفظ التفضيلات',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center">
          <User className="ml-3" size={24} />
          <h1 className="text-2xl font-semibold">الملف الشخصي</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">معلومات الحساب</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-muted-foreground mb-1">البريد الإلكتروني</label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full p-2 rounded bg-secondary/50 border border-border"
                />
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm text-muted-foreground mb-1">اسم المستخدم</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded bg-background border border-border"
                  placeholder="أدخل اسم المستخدم"
                />
              </div>
              
              <button
                onClick={updateProfile}
                disabled={loading}
                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded transition-colors"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
          
          <div className="glass p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">التفضيلات</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="theme" className="block text-sm text-muted-foreground mb-1">المظهر</label>
                <select
                  id="theme"
                  value={preferences.theme}
                  onChange={(e) => updatePreferences({ theme: e.target.value })}
                  className="w-full p-2 rounded bg-background border border-border"
                >
                  <option value="light">فاتح</option>
                  <option value="dark">داكن</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="font_size" className="block text-sm text-muted-foreground mb-1">حجم الخط</label>
                <select
                  id="font_size"
                  value={preferences.font_size}
                  onChange={(e) => updatePreferences({ font_size: e.target.value })}
                  className="w-full p-2 rounded bg-background border border-border"
                >
                  <option value="small">صغير</option>
                  <option value="medium">متوسط</option>
                  <option value="large">كبير</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="reciter" className="block text-sm text-muted-foreground mb-1">القارئ</label>
                <select
                  id="reciter"
                  value={preferences.reciter}
                  onChange={(e) => updatePreferences({ reciter: e.target.value })}
                  className="w-full p-2 rounded bg-background border border-border"
                >
                  <option value="ar.alafasy">مشاري العفاسي</option>
                  <option value="ar.abdurrahmaansudais">عبد الرحمن السديس</option>
                  <option value="ar.abdulbasitmurattal">عبد الباسط عبد الصمد</option>
                  <option value="ar.minshawi">محمد صديق المنشاوي</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="translation" className="block text-sm text-muted-foreground mb-1">لغة الترجمة</label>
                <select
                  id="translation"
                  value={preferences.translation_source}
                  onChange={(e) => updatePreferences({ translation_source: e.target.value })}
                  className="w-full p-2 rounded bg-background border border-border"
                >
                  <option value="ar">العربية</option>
                  <option value="en">الإنجليزية</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
