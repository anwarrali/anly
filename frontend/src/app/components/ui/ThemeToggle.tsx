import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-2 w-10 h-10" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl text-foreground hover:bg-accent transition-all duration-200 border border-border"
      title="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-olive-500" />
      )}
    </button>
  );
}
