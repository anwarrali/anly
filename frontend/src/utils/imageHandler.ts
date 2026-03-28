export const getValidImageUrl = (url?: string, category?: string): string => {
  if (!url) return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80";
  
  // If it's a valid http URL that doesn't include "your-storage-url", return it directly
  if (url.startsWith("http") && !url.includes("your-storage-url")) {
    return url;
  }

  // Fallback defaults based on category names
  const lowerCat = category ? category.toLowerCase() : "";
  if (lowerCat.includes("ecommerce") || url.includes("ecommerce")) {
    return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80";
  }
  if (lowerCat.includes("restaurant") || url.includes("restaurant")) {
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";
  }
  if (lowerCat.includes("portfolio")) {
    return "https://images.unsplash.com/photo-1507238692062-5a042e9ff19b?auto=format&fit=crop&w=800&q=80";
  }
  if (lowerCat.includes("blog")) {
    return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";
  }
  
  // Generic fallback (SaaS / UI Design)
  return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
};
