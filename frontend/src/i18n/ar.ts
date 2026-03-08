import type { Translations } from "./en";

export const ar: Translations = {
  // Navigation
  nav: {
    home: "الرئيسية",
    templates: "القوالب",
    services: "الخدمات",
    about: "من نحن",
    contact: "تواصل معنا",
    dashboard: "لوحة التحكم",
    login: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
    admin: "الإدارة",
  },
  // Hero
  hero: {
    badge: "🚀 منصة القوالب الرقمية #1",
    title: "أطلق مشروعك",
    titleHighlight: "على الإنترنت اليوم",
    subtitle:
      "قوالب مواقع احترافية وحلول واجهة أمامية متخصصة في ملفات الأعمال للطلاب، المستقلين، والشركات بجميع أحجامها.",
    cta: "استعرض القوالب",
    ctaSecondary: "عرض الخدمات",
    stats: {
      templates: "15 قالب",
      clients: "2 عميل",
      satisfaction: "90% رضا",
    },
  },
  // Features
  features: {
    title: "كل ما تحتاجه لـ",
    titleHighlight: "النجاح على الإنترنت",
    subtitle:
      "نوفر جميع الأدوات والخدمات التي يحتاجها عملك لتأسيس حضور رقمي قوي.",
    list: [
      {
        title: "قوالب جاهزة",
        description: "اختر من بين 15 قالب مصمم باحترافية لكل الصناعات.",
      },
      {
        title: "تطوير مخصص",
        description:
          "فريقنا المتخصص يبني موقع أحلامك من الصفر، مصمم خصيصًا لعلامتك التجارية.",
      },
      {
        title: "نشر سريع",
        description:
          "انطلق على الهواء في أيام، ليس أشهر. نتولى الاستضافة والدومين والإطلاق.",
      },
      {
        title: "دعم مستمر",
        description:
          "دعم على مدار الساعة للحفاظ على موقعك يعمل بسلاسة في جميع الأوقات.",
      },
      {
        title: "محسّن لمحركات البحث",
        description: "جميع القوالب والمواقع المخصصة محسّنة لمحركات البحث.",
      },
      {
        title: "أولوية الجوال",
        description:
          "كل موقع يبدو رائعًا على جميع الأجهزة، من الهواتف إلى سطح المكتب.",
      },
    ],
  },
  // Templates
  templates: {
    title: "القوالب",
    titleHighlight: "الأكثر شيوعًا",
    subtitle: "استكشف أكثر قوالب المواقع شيوعًا المصممة للشركات الحديثة.",
    viewAll: "عرض جميع القوالب",
    preview: "معاينة",
    buyNow: "اشتري الآن",
    free: "مجاني",
    categories: {
      all: "الكل",
      business: "أعمال",
      portfolio: "معرض أعمال",
      ecommerce: "تجارة إلكترونية",
      blog: "مدونة",
      landing: "صفحة هبوط",
      restaurant: "مطعم",
      realEstate: "عقارات",
      health: "صحة وطب",
      saas: "SaaS",
    },
    badge: ""
  },
  // Services
  services: {
    title: "اختر",
    titleHighlight: "مسارك المثالي",
    subtitle:
      "اختر مسارك. اشتراكنا السنوي يغطي الإعداد الاحترافي، الاستضافة، وصلاحية التعديل. يرجى الملاحظة أن هذا السعر منفصل عن تكلفة القالب أو التصميم المخصص.",
    options: [
      {
        id: "template",
        name: "قالب جاهز",
        description:
          "الأفضل لأولئك الذين يريدون بناءه بأنفسهم باستخدام قوالبنا المميزة.",
        price: "دفع مقابل القالب",
        cta: "تصفح القوالب",
        features: [
          "شراء لمرة واحدة",
          "الكود المصدري الكامل",
          "التوثيق",
          "لا يشمل الإعداد",
        ],
      },
      {
        id: "setup",
        name: "قالب + إعداد",
        description:
          "نساعدك في اختيار قالب وإعداده بشكل مثالي لعلامتك التجارية.",
        price: "اشتراك سنوي",
        cta: "عرض خطط الإعداد",
        features: [
          "القالب متضمن",
          "إعداد احترافي",
          "استضافة متضمنة",
          "تعديلات محدودة/سنة",
        ],
      },
      {
        id: "custom",
        name: "قالب مخصص",
        description: "تصميم فريد بنسبة 100% مبني من الصفر خصيصًا لاحتياجاتك.",
        price: "اشتراك سنوي",
        cta: "عرض الخطط المخصصة",
        features: [
          "تصميم فريد",
          "استضافة متضمنة",
          "تعديلات محدودة/سنة",
        ],
      },
    ],
  },
  // Pricing
  pricing: {
    title: "أسعار",
    titleHighlight: "شفافة وبسيطة",
    subtitle:
      "خططنا السنوية تغطي الإعداد الاحترافي، الاستضافة السريعة، وصلاحية التعديل. هذه الرسوم منفصلة عن تكلفة القالب أو التصميم المخصص.",
    planNotice: "يغطي الإعداد، الاستضافة والتعديلات فقط",
    monthly: "شهري",
    yearly: "سنوي",
    save: "وفّر 20%",
    plans: [
      {
        id: "basic",
        name: "الخطة الأساسية",
        price: "$50",
        yearlyPrice: "$50",
        description: "إعداد ودعم أساسي.",
        features: [
          "5 تعديلات سنوياً",
          "دعم عبر البريد الإلكتروني",
        ],
        cta: "ابدأ الآن",
      },
      {
        id: "standard",
        name: "الخطة القياسية",
        price: "$80",
        yearlyPrice: "$80",
        description: "خيارنا الأكثر شعبية.",
        features: [
          "10 تعديلات سنوياً",
          "دعم ذو أولوية",
        ],
        cta: "ابدأ الآن",
        popular: true,
      },
      {
        id: "premium",
        name: "الخطة المميزة",
        price: "$120",
        yearlyPrice: "$120",
        description: "أقصى درجات المرونة والدعم.",
        features: [
          "تعديلات غير محدودة",
          "دعم ذو أولوية 24/7",
        ],
        cta: "ابدأ الآن",
      },
    ],
  },
  // Testimonials
  testimonials: {
    title: "ماذا يقول",
    titleHighlight: "عملاؤنا",
    subtitle: "عملاؤنا يثقون بنا لتشغيل حضورهم الرقمي.",
    list: [
      {
        name: "سارة جونسون",
        role: "صاحبة مطعم",
        text: "ANLY غيّر حضورنا الرقمي. شهدنا زيادة 40% في الحجوزات الإلكترونية خلال الشهر الأول!",
        rating: 5,
      },
      {
        name: "أحمد الراشد",
        role: "رائد أعمال في التجارة الإلكترونية",
        text: "جودة القوالب استثنائية. الإعداد كان سريعًا وفريق الدعم كان مفيدًا بشكل لا يصدق طوال العملية.",
        rating: 5,
      },
      {
        name: "مايكل توريس",
        role: "وكيل عقاري",
        text: "احترافي، سريع، وبأسعار معقولة. موقع عقاراتي يبدو أفضل من المنافسين الذين أنفقوا أضعاف ما أنفقت.",
        rating: 5,
      },
    ],
  },
  // CTA
  cta: {
    title: "هل أنت مستعد لبناء",
    titleHighlight: "موقعك المثالي؟",
    subtitle: "انضم إلى عملائنا الذين أطلقوا حضورهم الرقمي مع ANLY.",
    button: "ابدأ مجانًا",
    buttonSecondary: "تحدث مع خبير",
  },
  // Footer
  footer: {
    tagline: "قوالب ويب احترافية وخدمات تطوير لجميع أنواع الشركات والأفراد.",
    product: "المنتج",
    company: "الشركة",
    support: "الدعم",
    links: {
      templates: "القوالب",
      services: "الخدمات",
      pricing: "الأسعار",
      about: "من نحن",
      contact: "تواصل معنا",
    },
    copyright: "© 2025 ANLY. جميع الحقوق محفوظة.",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
  },
  // Order Form
  order: {
    title: "قدّم",
    titleHighlight: "طلبك",
    subtitle: "أكمل النموذج أدناه وسيتواصل فريقنا معك خلال 24 ساعة.",
    steps: {
      service: "نوع الخدمة",
      details: "تفاصيل المشروع",
      confirm: "التأكيد",
    },
    form: {
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      company: "اسم الشركة",
      website: "الموقع الحالي (إن وجد)",
      serviceType: "نوع الخدمة",
      template: "اختر قالبًا",
      budget: "نطاق الميزانية",
      timeline: "الجدول الزمني",
      description: "وصف المشروع",
      requirements: "متطلبات خاصة",
      submit: "تقديم الطلب",
      next: "الخطوة التالية",
      back: "رجوع",
    },
    success: {
      title: "تم تقديم الطلب!",
      message: "شكرًا لك! سنتواصل معك خلال 24 ساعة لمناقشة مشروعك.",
    },
  },
  // About
  about: {
    badge: "عن ANLY",
    title: "حلول واجهة أمامية",
    titleHighlight: "حديثة",
    subtitle:
      "نحن نبني تطبيقات ويب عالية الأداء متخصصة في ملفات الأعمال للطلاب، المستقلين، والشركات بجميع أحجامها. تركيزنا هو على التصميم الرائع وتجارب الواجهة الأمامية الحديثة.",
    stats: [
      { value: "15", label: "قالب" },
      { value: "2", label: "عميل سعيد" },
      { value: "90%", label: "معدل الرضا" },
    ],
    mission: {
      title: "مهمتنا",
      text: "تمكين الأفراد والشركات من خلال عروض رقمية وحلول واجهة أمامية عالمية المستوى تبرز في المشهد التنافسي اليوم.",
    },
    team: {
      title: "تعرف على",
      titleHighlight: "الفريق",
      subtitle: "فريق شغوف من المصممين والمطورين وخبراء الأعمال.",
    },
  },
  // Contact
  contact: {
    title: "تواصل",
    titleHighlight: "معنا",
    subtitle: "هل لديك سؤال أو تحتاج عرض سعر مخصص؟ يسعدنا سماعك.",
    form: {
      name: "اسمك",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "رسالتك",
      submit: "إرسال الرسالة",
    },
    info: {
      email: "grandtwoaar@gmail.com",
      phone: "0567133778",
      address: "",
      hours: "الإثنين - الجمعة: 9 صباحًا - 6 مساءً",
    },
  },
  // Dashboard
  dashboard: {
    title: "لوحة تحكم العميل",
    welcome: "مرحبًا بعودتك",
    nav: {
      overview: "نظرة عامة",
      orders: "طلباتي",
      settings: "الإعدادات",
    },
    stats: {
      totalOrders: "إجمالي الطلبات",
      activeProjects: "المشاريع النشطة",
      completedProjects: "المكتملة",
    },
    orders: {
      title: "طلباتك",
      id: "رقم الطلب",
      service: "الخدمة",
      status: "الحالة",
      date: "التاريخ",
      amount: "المبلغ",
      action: "إجراء",
      statuses: {
        pending: "قيد الانتظار",
        inProgress: "قيد التنفيذ",
        completed: "مكتمل",
        cancelled: "ملغي",
      },
      requestEdit: "طلب تعديل",
      edits: "التعديلات",
      upgradePrompt:
        "تم الوصول إلى حد التعديلات. هل ترغب في عرض خطط الأسعار للترقية؟",
      successMessage: "تم استلام طلب التعديل! سيتصل بك فريقنا قريبًا.",
    },
  },
  // Admin
  admin: {
    title: "لوحة الإدارة",
    nav: {
      overview: "نظرة عامة",
      templates: "القوالب",
      orders: "الطلبات",
      users: "المستخدمون",
      settings: "الإعدادات",
    },
    stats: {
      revenue: "إجمالي الإيرادات",
      orders: "إجمالي الطلبات",
      users: "إجمالي المستخدمين",
      templates: "القوالب",
    },
    actions: {
      addTemplate: "إضافة قالب",
      editTemplate: "تعديل",
      deleteTemplate: "حذف",
      viewOrder: "عرض",
      updateStatus: "تحديث الحالة",
    },
  },
  // Template Detail
  templateDetail: {
    liveDemo: "عرض مباشر",
    buyNow: "اشتري الآن — ",
    features: "مميزات القالب",
    includes: "ما يشمله",
    compatible: "متوافق مع",
    support: "الدعم",
    preview: "معاينة",
    relatedTemplates: "قوالب ذات صلة",
  },
};
