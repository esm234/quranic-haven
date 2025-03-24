
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { Send, PhoneCall, AtSign, MapPin } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const Contact = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // هنا يمكن إضافة منطق إرسال البريد الإلكتروني أو حفظ الرسالة في قاعدة البيانات
      console.log('بيانات النموذج:', data);
      
      toast({
        title: 'تم إرسال الرسالة بنجاح',
        description: 'سنقوم بالرد عليك في أقرب وقت ممكن',
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: 'خطأ في الإرسال',
        description: 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-right">اتصل بنا</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-right">أرسل لنا رسالة</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-right">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم</FormLabel>
                      <FormControl>
                        <Input placeholder="الاسم الكامل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموضوع</FormLabel>
                      <FormControl>
                        <Input placeholder="موضوع الرسالة" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرسالة</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="اكتب رسالتك هنا..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  <Send className="ml-2 h-4 w-4" />
                  إرسال الرسالة
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="space-y-8">
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 text-right">معلومات التواصل</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-end gap-3">
                  <div className="text-right">
                    <p className="font-medium">البريد الإلكتروني</p>
                    <p className="text-muted-foreground">contact@quranapp.com</p>
                  </div>
                  <AtSign className="h-5 w-5 text-primary" />
                </div>
                
                <div className="flex items-center justify-end gap-3">
                  <div className="text-right">
                    <p className="font-medium">رقم الهاتف</p>
                    <p className="text-muted-foreground">+966 555 123 4567</p>
                  </div>
                  <PhoneCall className="h-5 w-5 text-primary" />
                </div>
                
                <div className="flex items-center justify-end gap-3">
                  <div className="text-right">
                    <p className="font-medium">العنوان</p>
                    <p className="text-muted-foreground">الرياض، المملكة العربية السعودية</p>
                  </div>
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 text-right">ساعات العمل</h2>
              <div className="space-y-2 text-right">
                <p><span className="font-medium">الأحد - الخميس:</span> <span className="text-muted-foreground">9:00 صباحًا - 5:00 مساءً</span></p>
                <p><span className="font-medium">الجمعة:</span> <span className="text-muted-foreground">مغلق</span></p>
                <p><span className="font-medium">السبت:</span> <span className="text-muted-foreground">10:00 صباحًا - 2:00 مساءً</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
