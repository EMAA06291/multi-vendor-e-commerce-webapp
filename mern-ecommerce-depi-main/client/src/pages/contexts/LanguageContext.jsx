import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    const newDirection = newLang === 'ar' ? 'rtl' : 'ltr';
    setLanguage(newLang);
    setDirection(newDirection);
    document.documentElement.setAttribute('dir', newDirection);
    document.documentElement.setAttribute('lang', newLang);
  };

  const translations = {
    en: {
      // Header
      searchPlaceholder: "Search for a product or brand",
      allCategories: "All Categories",
      home: "Home",
      shop: "Shop",
      pages: "Pages",
      vendors: "Vendors",
      blog: "Blog",
      contactUs: "Contact Us",
      profile: "Profile",
      wishlist: "Wishlist",
      compare: "Compare",
      cart: "Cart",
      
      // Blog Page
      blogTitle: "Blog",
      breadcrumb: "Home > Blog",
      
      // Blog Posts
      gadget: "Gadget",
      postTitle: "Legal structure, can make profit business",
      postExcerpt: "Re-engagement — objectives. As developers, we rightfully obsess about the customer experience...",
      date: "July 12, 2025",
      comments: "0 Comments",
      
      // Sidebar
      searchHere: "Search Here",
      searching: "Searching...",
      recentPosts: "Recent Posts",
      categories: "Categories",
      gaming: "Gaming",
      smartGadget: "Smart Gadget",
      software: "Software",
      electronics: "Electronics",
      laptop: "Laptop",
      mobileAccessories: "Mobile & Accessories",
      appliance: "Appliance",
      
      // Features
      freeShipping: "Free Shipping",
      freeShippingDesc: "Free shipping all over the US",
      satisfaction: "100% Satisfaction",
      satisfactionDesc: "Free shipping all over the US",
      securePayments: "Secure Payments",
      securePaymentsDesc: "Free shipping all over the US",
      support: "24/7 Support",
      supportDesc: "Free shipping all over the US",
      
      // Footer
      marketpro: "MARKETPRO",
      marketproDesc: "Marketpro become the largest computer parts, gaming pc parts, and other IT related products.",
      aboutUs: "About us",
      customerSupport: "Customer Support",
      myAccount: "My Account",
      information: "Information",
      companyProfile: "Company Profile",
      allRetailStore: "All Retail Store",
      merchantCenter: "Merchant Center",
      affiliate: "Affiliate",
      feedback: "Feedback",
      huaweiGroup: "Huawei Group",
      rulesPolicy: "Rules & Policy",
      helpCenter: "Help Center",
      giftCard: "Gift Card",
      reportAbuse: "Report Abuse",
      submitDispute: "Submit and Dispute",
      policiesRules: "Policies & Rules",
      onlineShopping: "Online Shopping",
      redeemVoucher: "Redeem Voucher",
      orderHistory: "Order History",
      shoppingCart: "Shoping Cart",
      helpTicket: "Help Ticket",
      productSupport: "Product Support",
      becomeVendor: "Become a Vendor",
      affiliateProgram: "Affiliate Program",
      privacyPolicy: "Privacy Policy",
      ourSuppliers: "Our Suppliers",
      extendedPlan: "Extended Plan",
      community: "Community",
      copyright: "Marketpro eCommerce © 2024. All Rights Reserved",
      weAccepting: "We Are Accepting",
      
      // Pagination
      previous: "Previous",
      next: "Next",
    },
    ar: {
      // Header
      searchPlaceholder: "ابحث عن منتج أو علامة تجارية",
      allCategories: "جميع الفئات",
      home: "الرئيسية",
      shop: "المتجر",
      pages: "الصفحات",
      vendors: "البائعين",
      blog: "المدونة",
      contactUs: "اتصل بنا",
      profile: "الملف الشخصي",
      wishlist: "قائمة الأمنيات",
      compare: "مقارنة",
      cart: "السلة",
      
      // Blog Page
      blogTitle: "المدونة",
      breadcrumb: "الرئيسية > المدونة",
      
      // Blog Posts
      gadget: "أداة",
      postTitle: "الهيكل القانوني، يمكن أن يحقق ربحاً تجارياً",
      postExcerpt: "إعادة التفاعل — الأهداف. كمطورين، نحن مهووسون بحق بتجربة العميل...",
      date: "12 يوليو 2025",
      comments: "0 تعليق",
      
      // Sidebar
      searchHere: "ابحث هنا",
      searching: "جاري البحث...",
      recentPosts: "المشاركات الأخيرة",
      categories: "الفئات",
      gaming: "الألعاب",
      smartGadget: "الأدوات الذكية",
      software: "البرمجيات",
      electronics: "الإلكترونيات",
      laptop: "الكمبيوتر المحمول",
      mobileAccessories: "الهاتف المحمول والملحقات",
      appliance: "الأجهزة",
      
      // Features
      freeShipping: "شحن مجاني",
      freeShippingDesc: "شحن مجاني في جميع أنحاء الولايات المتحدة",
      satisfaction: "100% رضا",
      satisfactionDesc: "شحن مجاني في جميع أنحاء الولايات المتحدة",
      securePayments: "مدفوعات آمنة",
      securePaymentsDesc: "شحن مجاني في جميع أنحاء الولايات المتحدة",
      support: "دعم 24/7",
      supportDesc: "شحن مجاني في جميع أنحاء الولايات المتحدة",
      
      // Footer
      marketpro: "ماركيت برو",
      marketproDesc: "أصبحت ماركيت برو أكبر مورد لأجزاء الكمبيوتر وأجزاء أجهزة الألعاب والمنتجات المتعلقة بتكنولوجيا المعلومات.",
      aboutUs: "من نحن",
      customerSupport: "دعم العملاء",
      myAccount: "حسابي",
      information: "معلومات",
      companyProfile: "ملف الشركة",
      allRetailStore: "جميع متاجر التجزئة",
      merchantCenter: "مركز التجار",
      affiliate: "الشركاء",
      feedback: "التعليقات",
      huaweiGroup: "مجموعة هواوي",
      rulesPolicy: "القواعد والسياسة",
      helpCenter: "مركز المساعدة",
      giftCard: "بطاقة هدية",
      reportAbuse: "الإبلاغ عن إساءة",
      submitDispute: "تقديم نزاع",
      policiesRules: "السياسات والقواعد",
      onlineShopping: "التسوق عبر الإنترنت",
      redeemVoucher: "استرداد القسيمة",
      orderHistory: "تاريخ الطلبات",
      shoppingCart: "سلة التسوق",
      helpTicket: "تذكرة المساعدة",
      productSupport: "دعم المنتج",
      becomeVendor: "كن بائعاً",
      affiliateProgram: "برنامج الشراكة",
      privacyPolicy: "سياسة الخصوصية",
      ourSuppliers: "موردونا",
      extendedPlan: "الخطة الممتدة",
      community: "المجتمع",
      copyright: "ماركيت برو للتجارة الإلكترونية © 2024. جميع الحقوق محفوظة",
      weAccepting: "نحن نقبل",
      
      // Pagination
      previous: "السابق",
      next: "التالي",
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
