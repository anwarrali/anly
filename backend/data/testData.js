/**
 * data/testData.js
 * Sample data to populate your MongoDB cluster for testing.
 */

import bcrypt from "bcryptjs";

export const users = [
  {
    name: "Admin User",
    email: "admin@anly.io",
    password: "password123", // Will be hashed in seeder
    role: "admin",
    isActive: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "client",
    isActive: true,
  },
];

export const templates = [
  {
    title: "Modern Business Pro",
    category: "business",
    price: 349,
    previewImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    ],
    demoUrl: "https://demo.anly.io/business-pro",
    description:
      "A sleek, high-conversion template designed specifically for modern corporate and business websites. Includes 10+ custom pages, pricing tables, and contact forms.",
    tags: ["corporate", "modern", "clean", "agency"],
    techStack: ["React", "Next.js", "Tailwind", "Framer Motion"],
    features: ["Responsive", "SEO Optimized", "Dark Mode"],
    isPublished: true,
    isFeatured: true,
    rating: 5,
  },
  {
    title: "Creative Portfolio",
    category: "portfolio",
    price: 199,
    previewImages: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000",
    ],
    demoUrl: "https://demo.anly.io/creative-folio",
    description:
      "Showcase your work with stunning animations and a unique asymmetrical grid layout. Perfect for designers, developers, and photographers.",
    tags: ["portfolio", "creative", "minimalist", "dark"],
    techStack: ["React", "Vite", "CSS Modules"],
    features: ["Smooth Scrolling", "Lazy Loading Image Grid", "Contact Form"],
    isPublished: true,
    isFeatured: true,
    rating: 4.8,
  },
  {
    title: "E-commerce Supreme",
    category: "ecommerce",
    price: 499,
    previewImages: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000",
    ],
    demoUrl: "https://demo.anly.io/ecom-supreme",
    description:
      "A complete online store template with cart, checkout, filtering, and product variations. Beautifully integrated with Lemon Squeezy.",
    tags: ["store", "shop", "ecommerce", "retail"],
    techStack: ["React", "Redux", "Lemon Squeezy", "Node.js"],
    features: ["Cart", "Checkout Flow", "User Accounts", "Order Tracking"],
    isPublished: true,
    isFeatured: false,
    rating: 4.9,
  },
];
