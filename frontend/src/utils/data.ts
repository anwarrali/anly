export interface Template {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  descriptionAr: string;
  tags: string[];
  rating: number;
  reviews: number;
  featured?: boolean;
  new?: boolean;
  features: string[];
  includes: string[];
  demoUrl: string;
}

export const templates: Template[] = [
  {
    id: "ecom-pro",
    name: "ShopFlow Pro",
    nameAr: "ShopFlow Pro",
    category: "ecommerce",
    price: 79,
    originalPrice: 129,
    image: "https://images.unsplash.com/photo-1657812159075-7f0abd98f7b8?w=800&q=80",
    description: "A modern e-commerce template perfect for online stores, boutiques, and product-based businesses.",
    descriptionAr: "قالب تجارة إلكترونية حديث مثالي للمتاجر الإلكترونية والبوتيكات والأعمال القائمة على المنتجات.",
    tags: ["E-Commerce", "Shop", "Products"],
    rating: 4.9,
    reviews: 234,
    featured: true,
    features: [
      "Product catalog with filters",
      "Shopping cart & checkout",
      "Mobile responsive",
      "SEO optimized",
      "Fast loading",
      "Dark/Light mode",
    ],
    includes: ["Source code", "Documentation", "6 months updates", "Email support"],
    demoUrl: "#",
  },
  {
    id: "resto-elite",
    name: "Saveur Restaurant",
    nameAr: "Saveur للمطاعم",
    category: "restaurant",
    price: 59,
    image: "https://images.unsplash.com/photo-1588560107833-167198a53677?w=800&q=80",
    description: "An elegant restaurant website template with menu display, reservations, and gallery sections.",
    descriptionAr: "قالب موقع مطعم أنيق مع عرض القائمة والحجوزات وأقسام المعرض.",
    tags: ["Restaurant", "Food", "Booking"],
    rating: 4.8,
    reviews: 189,
    new: true,
    features: [
      "Digital menu display",
      "Online reservation system",
      "Photo gallery",
      "Google Maps integration",
      "Social media links",
      "Event announcements",
    ],
    includes: ["Source code", "Documentation", "3 months updates", "Email support"],
    demoUrl: "#",
  },
  {
    id: "portfolio-creative",
    name: "Pixel Portfolio",
    nameAr: "Pixel Portfolio",
    category: "portfolio",
    price: 49,
    image: "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?w=800&q=80",
    description: "A stunning creative portfolio template for designers, photographers, and creative professionals.",
    descriptionAr: "قالب محفظة إبداعية مذهل للمصممين والمصورين والمحترفين المبدعين.",
    tags: ["Portfolio", "Creative", "Freelance"],
    rating: 4.7,
    reviews: 156,
    features: [
      "Masonry project grid",
      "Smooth animations",
      "Project detail pages",
      "Contact form",
      "Blog section",
      "Video background",
    ],
    includes: ["Source code", "Documentation", "3 months updates", "Email support"],
    demoUrl: "#",
  },
  {
    id: "realty-pro",
    name: "Realty Pro",
    nameAr: "Realty Pro",
    category: "realEstate",
    price: 99,
    originalPrice: 149,
    image: "https://images.unsplash.com/flagged/photo-1558954157-aa76c0d246c6?w=800&q=80",
    description: "A professional real estate template with property listings, search filters, and agent profiles.",
    descriptionAr: "قالب عقاري احترافي مع قوائم العقارات وفلاتر البحث وملفات الوكلاء.",
    tags: ["Real Estate", "Property", "Listings"],
    rating: 4.9,
    reviews: 98,
    featured: true,
    features: [
      "Property listing grid",
      "Advanced search & filters",
      "Agent profile pages",
      "Virtual tour support",
      "Mortgage calculator",
      "Map integration",
    ],
    includes: ["Source code", "Documentation", "6 months updates", "Priority support"],
    demoUrl: "#",
  },
  {
    id: "medica-health",
    name: "MedCare Clinic",
    nameAr: "MedCare للعيادات",
    category: "health",
    price: 69,
    image: "https://images.unsplash.com/photo-1631507623095-c710d184498f?w=800&q=80",
    description: "A clean medical clinic template with appointment booking, doctor profiles, and service listings.",
    descriptionAr: "قالب عيادة طبية نظيف مع حجز المواعيد وملفات الأطباء وقوائم الخدمات.",
    tags: ["Health", "Medical", "Clinic"],
    rating: 4.6,
    reviews: 72,
    new: true,
    features: [
      "Appointment booking",
      "Doctor profiles",
      "Service listings",
      "Patient testimonials",
      "Insurance info",
      "Emergency contact",
    ],
    includes: ["Source code", "Documentation", "3 months updates", "Email support"],
    demoUrl: "#",
  },
  {
    id: "saas-launch",
    name: "LaunchPad SaaS",
    nameAr: "LaunchPad SaaS",
    category: "saas",
    price: 89,
    originalPrice: 119,
    image: "https://images.unsplash.com/photo-1583932692875-a42450d50acf?w=800&q=80",
    description: "A high-converting SaaS landing page template with pricing, features, and testimonial sections.",
    descriptionAr: "قالب صفحة هبوط SaaS عالي التحويل مع أقسام الأسعار والميزات والشهادات.",
    tags: ["SaaS", "Startup", "Landing Page"],
    rating: 4.8,
    reviews: 143,
    featured: true,
    features: [
      "Hero section",
      "Feature showcase",
      "Pricing tables",
      "Testimonials",
      "FAQ accordion",
      "CTA sections",
    ],
    includes: ["Source code", "Documentation", "6 months updates", "Email support"],
    demoUrl: "#",
  },
];

export interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  image: string;
  linkedin: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Morgan",
    nameAr: "أليكس مورغان",
    role: "CEO & Co-founder",
    roleAr: "الرئيس التنفيذي والمؤسس المشارك",
    image: "https://images.unsplash.com/photo-1758876204244-930299843f07?w=400&q=80",
    linkedin: "#",
  },
  {
    id: "2",
    name: "Sara Kim",
    nameAr: "سارة كيم",
    role: "Head of Design",
    roleAr: "رئيسة التصميم",
    image: "https://images.unsplash.com/photo-1573497701119-52dbe8832c17?w=400&q=80",
    linkedin: "#",
  },
  {
    id: "3",
    name: "David Park",
    nameAr: "ديفيد بارك",
    role: "Lead Developer",
    roleAr: "المطور الرئيسي",
    image: "https://images.unsplash.com/photo-1710770563074-6d9cc0d3e338?w=400&q=80",
    linkedin: "#",
  },
];

export interface Order {
  id: string;
  service: string;
  serviceAr: string;
  status: "pending" | "inProgress" | "completed" | "cancelled";
  date: string;
  amount: number;
  template?: string;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    service: "Template + Setup",
    serviceAr: "القالب + الإعداد",
    status: "completed",
    date: "2025-01-15",
    amount: 199,
    template: "ShopFlow Pro",
  },
  {
    id: "ORD-002",
    service: "Template Purchase",
    serviceAr: "شراء قالب",
    status: "inProgress",
    date: "2025-02-20",
    amount: 79,
    template: "Saveur Restaurant",
  },
  {
    id: "ORD-003",
    service: "Custom Website",
    serviceAr: "موقع مخصص",
    status: "pending",
    date: "2025-03-01",
    amount: 1200,
  },
];

export const adminStats = {
  revenue: "$48,520",
  revenueChange: "+12.5%",
  orders: 342,
  ordersChange: "+8.3%",
  users: 1284,
  usersChange: "+15.2%",
  templates: 48,
  templatesChange: "+4",
};
