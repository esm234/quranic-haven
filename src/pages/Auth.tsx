
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // التحقق مما إذا كان المستخدم مسجلاً دخوله بالفعل
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkUser();
  }, [navigate]);
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        // إنشاء حساب جديد
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: 'تم إنشاء الحساب بنجاح!',
          description: 'يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك.',
        });
      } else {
        // تسجيل الدخول
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'خطأ!',
        description: error.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md p-8 glass rounded-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-md border border-border bg-background"
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">كلمة المرور</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-md border border-border bg-background"
              placeholder="أدخل كلمة المرور"
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary/20 hover:bg-primary/30 rounded-md transition-colors font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="h-5 w-5 border-2 border-t-foreground/80 rounded-full animate-spin mr-2"></span>
                جاري التحميل...
              </span>
            ) : (
              isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm hover:underline text-muted-foreground"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
