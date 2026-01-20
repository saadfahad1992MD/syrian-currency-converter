/**
 * Privacy Policy Page - Syrian Currency Converter
 * صفحة سياسة الخصوصية
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Shield, Eye, Cookie, Mail, RefreshCw } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-emerald-700 text-white py-6">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <ArrowRight className="w-5 h-5" />
                <span>العودة للرئيسية</span>
              </a>
            </Link>
            <h1 className="text-2xl font-bold">سياسة الخصوصية</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">مقدمة</h2>
                <p className="text-sm text-gray-500">آخر تحديث: يناير 2026</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              نحن في موقع "محول العملة السورية" نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. 
              توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات عند استخدامك لموقعنا.
            </p>
          </div>

          {/* Data Collection */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">المعلومات التي نجمعها</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                <strong className="text-gray-800">معلومات الاستخدام:</strong> نجمع معلومات تلقائية عن كيفية تفاعلك مع الموقع، 
                مثل الصفحات التي تزورها ووقت الزيارة ونوع المتصفح والجهاز المستخدم.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">لا نجمع بيانات شخصية:</strong> موقعنا لا يطلب منك تسجيل حساب أو إدخال 
                أي معلومات شخصية مثل الاسم أو البريد الإلكتروني أو رقم الهاتف لاستخدام خدمة التحويل.
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">ملفات تعريف الارتباط (Cookies)</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع. تشمل هذه:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li>ملفات تعريف الارتباط الضرورية لتشغيل الموقع</li>
                <li>ملفات تعريف الارتباط التحليلية (Google Analytics) لفهم كيفية استخدام الموقع</li>
                <li>ملفات تعريف الارتباط الإعلانية (Google AdSense) لعرض إعلانات مناسبة</li>
              </ul>
              <p className="leading-relaxed">
                يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك.
              </p>
            </div>
          </div>

          {/* Third Party Services */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">خدمات الطرف الثالث</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                نستخدم خدمات من أطراف ثالثة لتحسين الموقع وتقديم خدمات أفضل:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li><strong>Google Analytics:</strong> لتحليل حركة المرور وفهم سلوك المستخدمين</li>
                <li><strong>Google AdSense:</strong> لعرض الإعلانات التي تساعد في دعم الموقع</li>
                <li><strong>Vercel Analytics:</strong> لمراقبة أداء الموقع</li>
              </ul>
              <p className="leading-relaxed">
                كل من هذه الخدمات لها سياسات خصوصية خاصة بها، وننصحك بمراجعتها.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">تواصل معنا</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك التواصل معنا عبر:
            </p>
            <a 
              href="mailto:dr.saad.fm1@gmail.com" 
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Mail className="w-5 h-5" />
              dr.saad.fm1@gmail.com
            </a>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link href="/">
              <a className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                <ArrowRight className="w-5 h-5" />
                العودة للصفحة الرئيسية
              </a>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 bg-white/50">
        <div className="container text-center">
          <p className="text-sm text-gray-500">
            © 2026 محول العملة السورية - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}
