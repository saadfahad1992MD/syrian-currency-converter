/**
 * Syrian Currency Converter - Home Page
 * Design: Elegant Modern with emerald green and gold accents
 * Features: Convert old Syrian pounds to new (100:1 ratio)
 * Now includes Arabic words display and tab-based direction switching
 */

import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Calculator, 
  Banknote,
  Clock,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  Smartphone,
  X,
  Share,
  MoreVertical
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { numberToSimpleArabicWords } from "@/lib/numberToArabicWords";

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
  const [useArabicNumerals, setUseArabicNumerals] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Detect device type and standalone mode
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent));
    setIsAndroid(/android/i.test(userAgent));
    
    // Check if already installed as PWA
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);
    
    // Check if banner was dismissed
    const bannerDismissed = localStorage.getItem('installBannerDismissed');
    
    // Show install banner after a short delay if not installed and not dismissed
    if (!isInStandaloneMode && !bannerDismissed) {
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // PWA Install prompt handler
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = useCallback(() => {
    console.log('handleInstallClick called');
    console.log('deferredPrompt:', deferredPrompt);
    
    // Try native PWA prompt first if available (for Android Chrome)
    if (deferredPrompt) {
      console.log('Using native prompt');
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        console.log('User choice:', choiceResult.outcome);
        if (choiceResult.outcome === 'accepted') {
          setShowInstallBanner(false);
        }
        setDeferredPrompt(null);
      });
    } else {
      // Show install instructions dialog for iOS and other browsers
      console.log('Showing install dialog');
      setShowInstallDialog(true);
    }
  }, [deferredPrompt]);

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    // Store in localStorage to not show again for this session
    localStorage.setItem('installBannerDismissed', 'true');
  };

  // Convert old to new
  const convertOldToNew = useCallback((value: string) => {
    if (!value || isNaN(Number(value))) {
      setNewAmount("");
      return;
    }
    const result = Number(value) / CONVERSION_RATE;
    setNewAmount(result.toLocaleString('en-US', { maximumFractionDigits: 2 }));
  }, []);

  // Convert new to old
  const convertNewToOld = useCallback((value: string) => {
    if (!value || isNaN(Number(value))) {
      setOldAmount("");
      return;
    }
    const result = Number(value) * CONVERSION_RATE;
    setOldAmount(result.toLocaleString('en-US', { maximumFractionDigits: 0 }));
  }, []);

  // Convert Arabic numerals to English
  const arabicToEnglish = (str: string): string => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let result = str;
    arabicNumerals.forEach((arabic, index) => {
      result = result.replace(new RegExp(arabic, 'g'), index.toString());
    });
    return result;
  };

  // Convert English numerals to Arabic
  const englishToArabic = (str: string): string => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let result = str;
    for (let i = 0; i <= 9; i++) {
      result = result.replace(new RegExp(i.toString(), 'g'), arabicNumerals[i]);
    }
    return result;
  };

  // Check if string contains Arabic numerals
  const hasArabicNumerals = (str: string): boolean => {
    const arabicNumerals = /[٠-٩]/;
    return arabicNumerals.test(str);
  };

  // Format number based on numeral preference
  const formatNumber = (num: number, useArabic: boolean, fractionDigits: number = 0): string => {
    const formatted = num.toLocaleString('en-US', { maximumFractionDigits: fractionDigits });
    if (useArabic) {
      return englishToArabic(formatted.replace(/,/g, '٬'));
    }
    return formatted;
  };

  // Handle input change for old amount
  const handleOldAmountChange = (value: string) => {
    // Convert Arabic numerals to English first
    const englishValue = arabicToEnglish(value);
    const cleanValue = englishValue.replace(/[^\d.]/g, "");
    setOldAmount(cleanValue);
    if (direction === "old-to-new") {
      setIsConverting(true);
      setTimeout(() => {
        convertOldToNew(cleanValue);
        setIsConverting(false);
      }, 150);
    }
  };

  // Handle input change for new amount
  const handleNewAmountChange = (value: string) => {
    // Convert Arabic numerals to English first
    const englishValue = arabicToEnglish(value);
    const cleanValue = englishValue.replace(/[^\d.]/g, "");
    setNewAmount(cleanValue);
    if (direction === "new-to-old") {
      setIsConverting(true);
      setTimeout(() => {
        convertNewToOld(cleanValue);
        setIsConverting(false);
      }, 150);
    }
  };

  // Set direction
  const setConversionDirection = (newDirection: "old-to-new" | "new-to-old") => {
    if (newDirection !== direction) {
      setDirection(newDirection);
      setOldAmount("");
      setNewAmount("");
    }
  };

  // Convert Arabic numerals to Western numerals
  const arabicToWestern = (str: string): string => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let result = str;
    arabicNumerals.forEach((arabic, index) => {
      result = result.replace(new RegExp(arabic, 'g'), index.toString());
    });
    return result;
  };

  // Get numeric values for Arabic words
  const getOldNumericValue = () => {
    if (!oldAmount) return 0;
    const cleaned = arabicToWestern(oldAmount.replace(/[,٬]/g, ""));
    return Number(cleaned) || 0;
  };

  const getNewNumericValue = () => {
    if (!newAmount) return 0;
    const cleaned = arabicToWestern(newAmount.replace(/[,٬]/g, ""));
    return Number(cleaned) || 0;
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
          <div className="mt-4 inline-flex items-center gap-2 bg-white/30 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 text-white border border-white/30 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span className="text-sm sm:text-base font-medium">١٠٠ ليرة قديمة = ١ ليرة جديدة</span>
          </div>
          
          {/* Install App Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleInstallClick();
            }}
            className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-white border border-emerald-500 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Download className="w-5 h-5 shrink-0" />
            <span className="text-sm sm:text-base font-semibold">تحميل التطبيق</span>
          </button>
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
                {/* Direction Tabs - Two Icons at Top */}
                <div className="flex flex-col items-center mb-6 md:mb-8">
                  <p className="text-sm text-muted-foreground mb-3">اختر نوع التحويل</p>
                  <div className="flex flex-row bg-secondary/30 rounded-2xl p-2 gap-2 w-full sm:w-auto justify-center">
                    {/* Old to New Tab */}
                    <button
                      onClick={() => setConversionDirection("old-to-new")}
                      className={`
                        relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 flex-1 sm:flex-none sm:w-auto
                        ${direction === "old-to-new" 
                          ? "bg-white shadow-lg text-foreground ring-2 ring-emerald-500 ring-offset-2" 
                          : "bg-white/50 text-muted-foreground hover:text-foreground hover:bg-white/80 border border-gray-200"
                        }
                      `}
                    >
                      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${direction === "old-to-new" ? "bg-amber-100" : "bg-amber-50"}`}>
                          <img 
                            src="/images/assad.jpg" 
                            alt="قديمة" 
                            className="w-4 h-4 sm:w-6 sm:h-6 object-cover rounded-full"
                          />
                        </div>
                        <ArrowLeft className={`w-3 h-3 sm:w-4 sm:h-4 shrink-0 ${direction === "old-to-new" ? "text-emerald-600" : "text-muted-foreground"}`} />
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${direction === "old-to-new" ? "bg-emerald-100" : "bg-emerald-50"}`}>
                          <img 
                            src="/images/sharaa.jpg" 
                            alt="جديدة" 
                            className="w-4 h-4 sm:w-6 sm:h-6 object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <span className={`text-[10px] sm:text-sm font-semibold whitespace-nowrap ${direction === "old-to-new" ? "text-emerald-700" : ""}`}>قديمة إلى جديدة</span>
                    </button>

                    {/* New to Old Tab */}
                    <button
                      onClick={() => setConversionDirection("new-to-old")}
                      className={`
                        relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 flex-1 sm:flex-none sm:w-auto
                        ${direction === "new-to-old" 
                          ? "bg-white shadow-lg text-foreground ring-2 ring-emerald-500 ring-offset-2" 
                          : "bg-white/50 text-muted-foreground hover:text-foreground hover:bg-white/80 border border-gray-200"
                        }
                      `}
                    >
                      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${direction === "new-to-old" ? "bg-emerald-100" : "bg-emerald-50"}`}>
                          <img 
                            src="/images/sharaa.jpg" 
                            alt="جديدة" 
                            className="w-4 h-4 sm:w-6 sm:h-6 object-cover rounded-full"
                          />
                        </div>
                        <ArrowLeft className={`w-3 h-3 sm:w-4 sm:h-4 shrink-0 ${direction === "new-to-old" ? "text-emerald-600" : "text-muted-foreground"}`} />
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${direction === "new-to-old" ? "bg-amber-100" : "bg-amber-50"}`}>
                          <img 
                            src="/images/assad.jpg" 
                            alt="قديمة" 
                            className="w-4 h-4 sm:w-6 sm:h-6 object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <span className={`text-[10px] sm:text-sm font-semibold whitespace-nowrap ${direction === "new-to-old" ? "text-emerald-700" : ""}`}>جديدة إلى قديمة</span>
                    </button>
                  </div>
                </div>

                {/* Converter Content */}
                <AnimatePresence mode="wait">
                  {direction === "old-to-new" ? (
                    <motion.div
                      key="old-to-new"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* From: Old Currency */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center overflow-hidden shrink-0">
                            <img 
                              src="/images/assad.jpg" 
                              alt="العملة القديمة" 
                              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm sm:text-base">من: الليرة القديمة</h3>
                            <p className="text-xs text-muted-foreground">قبل ١ يناير ٢٠٢٦</p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="text"
                            placeholder="أدخل المبلغ"
                            value={oldAmount}
                            onChange={(e) => handleOldAmountChange(e.target.value)}
                            className="text-xl sm:text-2xl md:text-3xl h-14 sm:h-16 text-center font-bold bg-white border-2 border-amber-200 focus:border-amber-400 transition-colors"
                            dir="rtl"
                          />
                          <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-amber-600 font-medium text-sm sm:text-base">
                            ل.س
                          </span>
                        </div>
                        {getOldNumericValue() > 0 && (
                          <p className="text-sm text-amber-600 text-center mt-1">
                            {numberToSimpleArabicWords(getOldNumericValue())}
                          </p>
                        )}
                      </div>

                      {/* Arrow Divider */}
                      <div className="flex justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-100 to-emerald-100 flex items-center justify-center">
                          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                      </div>

                      {/* To: New Currency */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                            <img 
                              src="/images/sharaa.jpg" 
                              alt="العملة الجديدة" 
                              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm sm:text-base">إلى: الليرة الجديدة</h3>
                            <p className="text-xs text-muted-foreground">بعد ١ يناير ٢٠٢٦</p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="النتيجة"
                            value={newAmount}
                            readOnly
                            className="text-xl sm:text-2xl md:text-3xl h-14 sm:h-16 text-center font-bold bg-emerald-50 border-2 border-emerald-200 text-emerald-700"
                            dir="ltr"
                          />
                          <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-medium text-sm sm:text-base">
                            ل.س
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="new-to-old"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* From: New Currency */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                            <img 
                              src="/images/sharaa.jpg" 
                              alt="العملة الجديدة" 
                              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm sm:text-base">من: الليرة الجديدة</h3>
                            <p className="text-xs text-muted-foreground">بعد ١ يناير ٢٠٢٦</p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="text"
                            placeholder="أدخل المبلغ"
                            value={newAmount}
                            onChange={(e) => handleNewAmountChange(e.target.value)}
                            className="text-xl sm:text-2xl md:text-3xl h-14 sm:h-16 text-center font-bold bg-white border-2 border-emerald-200 focus:border-emerald-400 transition-colors"
                            dir="rtl"
                          />
                          <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-medium text-sm sm:text-base">
                            ل.س
                          </span>
                        </div>
                        {getNewNumericValue() > 0 && (
                          <p className="text-sm text-emerald-600 text-center mt-1">
                            {numberToSimpleArabicWords(getNewNumericValue())}
                          </p>
                        )}
                      </div>

                      {/* Arrow Divider */}
                      <div className="flex justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center">
                          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                      </div>

                      {/* To: Old Currency */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center overflow-hidden shrink-0">
                            <img 
                              src="/images/assad.jpg" 
                              alt="العملة القديمة" 
                              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm sm:text-base">إلى: الليرة القديمة</h3>
                            <p className="text-xs text-muted-foreground">قبل ١ يناير ٢٠٢٦</p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="النتيجة"
                            value={oldAmount}
                            readOnly
                            className="text-xl sm:text-2xl md:text-3xl h-14 sm:h-16 text-center font-bold bg-amber-50 border-2 border-amber-200 text-amber-700"
                            dir="ltr"
                          />
                          <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-amber-600 font-medium text-sm sm:text-base">
                            ل.س
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Result Display with Arabic Words */}
                <AnimatePresence mode="wait">
                  {(oldAmount || newAmount) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl border border-emerald-100"
                    >
                      <div className="text-center space-y-3 md:space-y-4">
                        <p className="text-sm text-muted-foreground">نتيجة التحويل</p>
                        
                        {/* Numeric Result */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                          <div className="text-center">
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600">
                              {oldAmount ? Number(oldAmount.replace(/,/g, "")).toLocaleString("en-US") : "0"} 
                              <span className="text-sm sm:text-lg mr-1">ل.س قديمة</span>
                            </p>
                          </div>
                          <span className="text-xl sm:text-2xl text-muted-foreground">=</span>
                          <div className="text-center">
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600">
                              {newAmount || "0"} 
                              <span className="text-sm sm:text-lg mr-1">ل.س جديدة</span>
                            </p>
                          </div>
                        </div>

                        {/* Arabic Words Result */}
                        <div className="pt-3 md:pt-4 border-t border-emerald-200/50">
                          <p className="text-sm text-muted-foreground mb-2">بالكلمات</p>
                          <div className="space-y-2">
                            {getOldNumericValue() > 0 && (
                              <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-base sm:text-lg font-semibold text-amber-700 bg-amber-50 rounded-lg py-2 px-3 sm:px-4 inline-block max-w-full break-words"
                              >
                                {numberToSimpleArabicWords(getOldNumericValue())} ليرة قديمة
                              </motion.p>
                            )}
                            {getOldNumericValue() > 0 && getNewNumericValue() > 0 && (
                              <p className="text-muted-foreground">=</p>
                            )}
                            {getNewNumericValue() > 0 && (
                              <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-base sm:text-lg font-semibold text-emerald-700 bg-emerald-50 rounded-lg py-2 px-3 sm:px-4 inline-block max-w-full break-words"
                              >
                                {numberToSimpleArabicWords(getNewNumericValue())} ليرة جديدة
                              </motion.p>
                            )}
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
      <footer className="py-6 pb-24 border-t border-border/50 bg-white/50 backdrop-blur">
        <div className="container text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            هذا الموقع للأغراض التعليمية والتوعوية فقط
          </p>
          <p className="text-sm text-muted-foreground">
            للتواصل: <a href="mailto:dr.saad.fm1@gmail.com" className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">dr.saad.fm1@gmail.com</a>
          </p>
          <p className="text-sm">
            <Link href="/privacy">
              <a className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">سياسة الخصوصية</a>
            </Link>
          </p>
        </div>
      </footer>

      {/* Install Instructions Dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2 justify-end">
              <span>تحميل التطبيق</span>
              <Smartphone className="w-5 h-5 text-emerald-600" />
            </DialogTitle>
            <DialogDescription className="text-right">
              اتبع الخطوات التالية لتثبيت التطبيق على جهازك
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isIOS ? (
              <div className="space-y-4">
                {/* Header with Apple icon */}
                <div className="flex items-center gap-3 justify-center pb-2 border-b border-gray-200">
                  <svg className="w-8 h-8 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <h4 className="font-bold text-gray-800 text-lg">تثبيت على iPhone / iPad</h4>
                </div>
                
                {/* Step 1 */}
                <div className="bg-gradient-to-l from-blue-50 to-white rounded-2xl p-4 border border-blue-100 shadow-sm">
                  <div className="flex items-start gap-4 flex-row-reverse">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                      <Share className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="font-bold text-gray-800">اضغط على زر المشاركة</span>
                        <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">١</span>
                      </div>
                      <p className="text-sm text-gray-600">في شريط Safari السفلي، ابحث عن أيقونة المربع مع السهم للأعلى</p>
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="bg-gradient-to-l from-emerald-50 to-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
                  <div className="flex items-start gap-4 flex-row-reverse">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="font-bold text-gray-800">إضافة للشاشة الرئيسية</span>
                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">٢</span>
                      </div>
                      <p className="text-sm text-gray-600">مرر للأسفل واختر <span className="font-semibold text-emerald-700">"Add to Home Screen"</span></p>
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="bg-gradient-to-l from-amber-50 to-white rounded-2xl p-4 border border-amber-100 shadow-sm">
                  <div className="flex items-start gap-4 flex-row-reverse">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="font-bold text-gray-800">اضغط "Add" للتأكيد</span>
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">٣</span>
                      </div>
                      <p className="text-sm text-gray-600">في أعلى يمين الشاشة، اضغط على <span className="font-semibold text-amber-700">"Add"</span></p>
                    </div>
                  </div>
                </div>
                
                {/* Success message */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-4 text-center shadow-lg">
                  <p className="text-white font-bold text-base">🎉 تم! ستجد التطبيق على شاشتك الرئيسية</p>
                </div>
              </div>
            ) : isAndroid ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-700 text-right">لأجهزة Android:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 text-right" dir="rtl">
                  <li className="flex items-center gap-2 justify-end flex-row-reverse">
                    <span>اضغط على قائمة المتصفح</span>
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </li>
                  <li>اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"</li>
                  <li>اضغط "تثبيت" للتأكيد</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-700 text-right">للكمبيوتر:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 text-right" dir="rtl">
                  <li>ابحث عن أيقونة التثبيت في شريط العنوان</li>
                  <li>أو اضغط على قائمة المتصفح واختر "تثبيت"</li>
                </ol>
              </div>
            )}
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-700 text-center">
                بعد التثبيت، ستجد التطبيق على شاشتك الرئيسية للوصول السريع
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowInstallDialog(false)}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            فهمت
          </Button>
        </DialogContent>
      </Dialog>

      {/* Fixed Install Banner at Bottom */}
      <AnimatePresence>
        {showInstallBanner && !isStandalone && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900 border-t border-gray-700 shadow-2xl"
            dir="rtl"
          >
            <div className="container max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                {/* App Icon */}
                <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg">
                  <Download className="w-7 h-7 text-white" />
                </div>
                
                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-base sm:text-lg truncate">
                    تثبيت محول العملة
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">
                    أضفه للشاشة الرئيسية للوصول السريع
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleInstallClick();
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg"
                  >
                    تثبيت التطبيق
                  </Button>
                  <button
                    onClick={dismissInstallBanner}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="إغلاق"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
