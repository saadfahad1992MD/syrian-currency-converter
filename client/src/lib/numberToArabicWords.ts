/**
 * تحويل الأرقام إلى كلمات عربية
 * يدعم الأرقام من 0 إلى مليارات
 */

const ones = [
  '', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة',
  'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
  'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر',
  'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'
];

const tens = [
  '', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون',
  'ستون', 'سبعون', 'ثمانون', 'تسعون'
];

const hundreds = [
  '', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة',
  'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'
];

// تحويل رقم من 1-99
function convertTens(num: number): string {
  if (num < 20) {
    return ones[num];
  }
  const ten = Math.floor(num / 10);
  const one = num % 10;
  if (one === 0) {
    return tens[ten];
  }
  return `${ones[one]} و${tens[ten]}`;
}

// تحويل رقم من 1-999
function convertHundreds(num: number): string {
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  
  if (hundred === 0) {
    return convertTens(remainder);
  }
  
  if (remainder === 0) {
    return hundreds[hundred];
  }
  
  return `${hundreds[hundred]} و${convertTens(remainder)}`;
}

// تحويل رقم كامل إلى كلمات عربية
export function numberToArabicWords(num: number): string {
  if (num === 0) return 'صفر';
  if (num < 0) return `سالب ${numberToArabicWords(Math.abs(num))}`;
  
  // التعامل مع الكسور
  const intPart = Math.floor(num);
  const decimalPart = num - intPart;
  
  let result = '';
  
  if (intPart === 0) {
    result = 'صفر';
  } else {
    const billions = Math.floor(intPart / 1000000000);
    const millions = Math.floor((intPart % 1000000000) / 1000000);
    const thousands = Math.floor((intPart % 1000000) / 1000);
    const remainder = intPart % 1000;
    
    const parts: string[] = [];
    
    // المليارات
    if (billions > 0) {
      if (billions === 1) {
        parts.push('مليار');
      } else if (billions === 2) {
        parts.push('ملياران');
      } else if (billions >= 3 && billions <= 10) {
        parts.push(`${convertHundreds(billions)} مليارات`);
      } else {
        parts.push(`${convertHundreds(billions)} مليار`);
      }
    }
    
    // الملايين
    if (millions > 0) {
      if (millions === 1) {
        parts.push('مليون');
      } else if (millions === 2) {
        parts.push('مليونان');
      } else if (millions >= 3 && millions <= 10) {
        parts.push(`${convertHundreds(millions)} ملايين`);
      } else {
        parts.push(`${convertHundreds(millions)} مليون`);
      }
    }
    
    // الآلاف
    if (thousands > 0) {
      if (thousands === 1) {
        parts.push('ألف');
      } else if (thousands === 2) {
        parts.push('ألفان');
      } else if (thousands >= 3 && thousands <= 10) {
        parts.push(`${convertHundreds(thousands)} آلاف`);
      } else {
        parts.push(`${convertHundreds(thousands)} ألف`);
      }
    }
    
    // الباقي (1-999)
    if (remainder > 0) {
      parts.push(convertHundreds(remainder));
    }
    
    result = parts.join(' و');
  }
  
  // إضافة الكسور إذا وجدت
  if (decimalPart > 0) {
    const decimalStr = decimalPart.toFixed(2).split('.')[1];
    const decimalNum = parseInt(decimalStr, 10);
    if (decimalNum > 0) {
      result += ` فاصلة ${numberToArabicWords(decimalNum)}`;
    }
  }
  
  return result;
}

// تحويل مع إضافة وحدة العملة
export function numberToArabicWordsWithCurrency(num: number, isNew: boolean = true): string {
  const words = numberToArabicWords(num);
  const currency = isNew ? 'ليرة سورية جديدة' : 'ليرة سورية قديمة';
  
  // تحديد صيغة الليرة حسب العدد
  const intPart = Math.floor(num);
  
  if (intPart === 0) {
    return `صفر ${currency}`;
  } else if (intPart === 1) {
    return isNew ? 'ليرة سورية جديدة واحدة' : 'ليرة سورية قديمة واحدة';
  } else if (intPart === 2) {
    return isNew ? 'ليرتان سوريتان جديدتان' : 'ليرتان سوريتان قديمتان';
  } else if (intPart >= 3 && intPart <= 10) {
    return `${words} ليرات سورية ${isNew ? 'جديدة' : 'قديمة'}`;
  } else {
    return `${words} ${currency}`;
  }
}

// نسخة مبسطة للعرض
export function numberToSimpleArabicWords(num: number): string {
  if (num === 0) return 'صفر';
  
  const intPart = Math.floor(num);
  const decimalPart = num - intPart;
  
  let result = '';
  
  const millions = Math.floor(intPart / 1000000);
  const thousands = Math.floor((intPart % 1000000) / 1000);
  const remainder = intPart % 1000;
  
  const parts: string[] = [];
  
  if (millions > 0) {
    if (millions === 1) {
      parts.push('مليون');
    } else {
      parts.push(`${convertHundreds(millions)} مليون`);
    }
  }
  
  if (thousands > 0) {
    if (thousands === 1) {
      parts.push('ألف');
    } else if (thousands === 2) {
      parts.push('ألفين');
    } else if (thousands >= 3 && thousands <= 10) {
      parts.push(`${ones[thousands]} آلاف`);
    } else {
      parts.push(`${convertHundreds(thousands)} ألف`);
    }
  }
  
  if (remainder > 0) {
    parts.push(convertHundreds(remainder));
  }
  
  result = parts.join(' و');
  
  if (decimalPart > 0) {
    const decimalStr = decimalPart.toFixed(2).split('.')[1];
    const decimalNum = parseInt(decimalStr, 10);
    if (decimalNum > 0) {
      result += ` و${convertHundreds(decimalNum)} من مئة`;
    }
  }
  
  return result || 'صفر';
}
