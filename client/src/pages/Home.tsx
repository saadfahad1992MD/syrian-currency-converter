/**
 * Syrian Currency Converter - Home Page
 * Design: Elegant Modern with emerald green and gold accents
 * Features: Convert old Syrian pounds to new (100:1 ratio)
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  ArrowDownUp, 
  Info, 
  Calculator, 
  Banknote,
  Clock,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

// Conversion rate: 100 old = 1 new
const CONVERSION_RATE = 100;

// Currency denominations
const OLD_DENOMINATIONS = [1000, 2000, 5000, 10000, 50000];
const NEW_DENOMINATIONS = [5, 10, 25, 50, 100, 500];

export default function Home() {
  const [oldAmount, setOldAmount] = useState<string>("");
  const [newAmount, setNewAmount] = useState<string>("");
  const [direction, setDirection] = useState<"old-to-new" | "new-to-old">("old-to-new");
  const [isConverting, setIsConverting] = useState(false);

  // Convert old to new
  const convertOldToNew = useCallback((value: string) => {
    if (!value || isNaN(Number(value))) {
      setNewAmount("");
      return;
    }
    const result = Number(value) / CONVERSION_RATE;
    setNewAmount(result.toLocaleString("ar-SY", { maximumFractionDigits: 2 }));
  }, []);

  // Convert new to old
  const convertNewToOld = useCallback((value: string) => {
    if (!value || isNaN(Number(value))) {
      setOldAmount("");
      return;
    }
    const result = Number(value) * CONVERSION_RATE;
    setOldAmount(result.toLocaleString("ar-SY", { maximumFractionDigits: 0 }));
  }, []);

  // Handle input change
  const handleOldAmountChange = (value: string) => {
    // Remove non-numeric characters except decimal
    const cleanValue = value.replace(/[^\d.]/g, "");
    setOldAmount(cleanValue);
    if (direction === "old-to-new") {
      setIsConverting(true);
      setTimeout(() => {
        convertOldToNew(cleanValue);
        setIsConverting(false);
      }, 150);
    }
  };

  const handleNewAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, "");
    setNewAmount(cleanValue);
    if (direction === "new-to-old") {
      setIsConverting(true);
      setTimeout(() => {
        convertNewToOld(cleanValue);
        setIsConverting(false);
      }, 150);
    }
  };

  // Toggle direction
  const toggleDirection = () => {
    setDirection(prev => prev === "old-to-new" ? "new-to-old" : "old-to-new");
    setOldAmount("");
    setNewAmount("");
  };

  // Quick amount buttons
  const handleQuickAmount = (amount: number) => {
    if (direction === "old-to-new") {
      setOldAmount(amount.toString());
      convertOldToNew(amount.toString());
    } else {
      setNewAmount(amount.toString());
      convertNewToOld(amount.toString());
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background */}
      <section 
        className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background" />
        
        {/* Content */}
        <motion.div 
          className="relative z-10 text-center px-4 py-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4"
          >
            <img 
              src="/images/conversion-icon.png" 
              alt="تحويل العملة" 
              className="w-20 h-20 md:w-24 md:h-24 mx-auto drop-shadow-2xl"
            />
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg font-heading">
            محول العملة السورية
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
            حوّل بين الليرة السورية القديمة والجديدة بسهولة
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>١٠٠ ليرة قديمة = ١ ليرة جديدة</span>
          </div>
        </motion.div>
      </section>

      {/* Main Converter Section */}
      <main className="flex-1 -mt-16 relative z-20 pb-12">
        <div className="container max-w-4xl">
          {/* Converter Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="glass shadow-2xl border-0 overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Direction Indicator */}
                <div className="text-center mb-6">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-full px-4 py-2">
                    <Calculator className="w-4 h-4" />
                    {direction === "old-to-new" 
                      ? "تحويل من القديمة إلى الجديدة" 
                      : "تحويل من الجديدة إلى القديمة"}
                  </span>
                </div>

                {/* Converter Grid */}
                <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                  {/* Old Currency Input */}
                  <motion.div 
                    className={`space-y-3 ${direction === "new-to-old" ? "md:order-3" : ""}`}
                    layout
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center overflow-hidden">
                        <img 
                          src="/images/old-currency.png" 
                          alt="العملة القديمة" 
                          className="w-10 h-10 object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">الليرة القديمة</h3>
                        <p className="text-xs text-muted-foreground">قبل ١ يناير ٢٠٢٦</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="أدخل المبلغ"
                        value={oldAmount}
                        onChange={(e) => handleOldAmountChange(e.target.value)}
                        disabled={direction === "new-to-old"}
                        className="text-2xl md:text-3xl h-16 text-center font-bold bg-white border-2 border-amber-200 focus:border-amber-400 transition-colors disabled:opacity-50"
                        dir="ltr"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 font-medium">
                        ل.س
                      </span>
                    </div>

                    {/* Quick amounts for old currency */}
                    {direction === "old-to-new" && (
                      <div className="flex flex-wrap gap-2">
                        {OLD_DENOMINATIONS.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAmount(amount)}
                            className="text-xs border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                          >
                            {amount.toLocaleString("ar-SY")}
                          </Button>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Swap Button */}
                  <div className="flex justify-center md:order-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleDirection}
                      className="w-14 h-14 rounded-full border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 group"
                    >
                      <ArrowDownUp className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-500" />
                    </Button>
                  </div>

                  {/* New Currency Input */}
                  <motion.div 
                    className={`space-y-3 ${direction === "new-to-old" ? "md:order-1" : ""}`}
                    layout
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center overflow-hidden">
                        <img 
                          src="/images/new-currency.png" 
                          alt="العملة الجديدة" 
                          className="w-10 h-10 object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">الليرة الجديدة</h3>
                        <p className="text-xs text-muted-foreground">بعد ١ يناير ٢٠٢٦</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="أدخل المبلغ"
                        value={newAmount}
                        onChange={(e) => handleNewAmountChange(e.target.value)}
                        disabled={direction === "old-to-new"}
                        className="text-2xl md:text-3xl h-16 text-center font-bold bg-white border-2 border-emerald-200 focus:border-emerald-400 transition-colors disabled:opacity-50"
                        dir="ltr"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-medium">
                        ل.س
                      </span>
                    </div>

                    {/* Quick amounts for new currency */}
                    {direction === "new-to-old" && (
                      <div className="flex flex-wrap gap-2">
                        {NEW_DENOMINATIONS.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAmount(amount)}
                            className="text-xs border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                          >
                            {amount.toLocaleString("ar-SY")}
                          </Button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Result Display */}
                <AnimatePresence mode="wait">
                  {(oldAmount || newAmount) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl border border-emerald-100"
                    >
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">نتيجة التحويل</p>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                          <div className="text-center">
                            <p className="text-2xl md:text-3xl font-bold text-amber-600">
                              {oldAmount ? Number(oldAmount.replace(/,/g, "")).toLocaleString("ar-SY") : "٠"} 
                              <span className="text-lg mr-1">ل.س قديمة</span>
                            </p>
                          </div>
                          <span className="text-2xl text-muted-foreground">=</span>
                          <div className="text-center">
                            <p className="text-2xl md:text-3xl font-bold text-emerald-600">
                              {newAmount || "٠"} 
                              <span className="text-lg mr-1">ل.س جديدة</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-4 mt-8"
          >
            {/* Conversion Rate Card */}
            <Card className="p-5 bg-white/80 backdrop-blur border-emerald-100 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">معدل التحويل</h3>
                  <p className="text-sm text-muted-foreground">
                    كل ١٠٠ ليرة قديمة تساوي ١ ليرة جديدة (حذف صفرين)
                  </p>
                </div>
              </div>
            </Card>

            {/* Timeline Card */}
            <Card className="p-5 bg-white/80 backdrop-blur border-amber-100 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">فترة الاستبدال</h3>
                  <p className="text-sm text-muted-foreground">
                    ٩٠ يوماً من ١ يناير ٢٠٢٦ قابلة للتمديد
                  </p>
                </div>
              </div>
            </Card>

            {/* Free Exchange Card */}
            <Card className="p-5 bg-white/80 backdrop-blur border-primary/20 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">استبدال مجاني</h3>
                  <p className="text-sm text-muted-foreground">
                    بدون عمولات أو رسوم أو ضرائب
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* New Denominations Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8"
          >
            <Card className="p-6 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <Banknote className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-foreground">فئات العملة الجديدة</h2>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {NEW_DENOMINATIONS.map((denom, index) => (
                  <motion.div
                    key={denom}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200"
                  >
                    <p className="text-2xl font-bold text-emerald-700">{denom}</p>
                    <p className="text-xs text-emerald-600">ليرة</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                * فئة ١٠٠٠ ليرة ستُطرح في المرحلة الثانية
              </p>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8"
          >
            <Card className="p-6 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">أسئلة شائعة</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">هل يتغير سعر السلع؟</h3>
                  <p className="text-sm text-muted-foreground">
                    لا، القيمة الحقيقية لا تتغير. إذا كان سعر منتج ١٠٠٠٠ ليرة قديمة، سيصبح ١٠٠ ليرة جديدة.
                  </p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">أين يمكنني استبدال العملة؟</h3>
                  <p className="text-sm text-muted-foreground">
                    في جميع البنوك ومكاتب الصرافة المرخصة في سوريا، بدون أي رسوم.
                  </p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">هل يمكنني استخدام العملة القديمة؟</h3>
                  <p className="text-sm text-muted-foreground">
                    نعم، العملتان القديمة والجديدة ستتداولان معاً خلال فترة الانتقال (٩٠ يوماً).
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/50 bg-white/50 backdrop-blur">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            هذا الموقع للأغراض التعليمية والتوعوية فقط
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            المصدر: مصرف سوريا المركزي - يناير ٢٠٢٦
          </p>
        </div>
      </footer>
    </div>
  );
}
