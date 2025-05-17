import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentTheme, setTheme as setAppTheme, toggleTheme as toggleAppTheme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(getCurrentTheme());
  const { toast } = useToast();

  // Update component state when theme changes externally
  useEffect(() => {
    const updateThemeState = () => {
      setTheme(getCurrentTheme());
    };

    // Listen for storage changes (in case theme is changed in another tab)
    window.addEventListener("storage", updateThemeState);
    
    // Create a mutation observer to watch for theme class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" && 
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          updateThemeState();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      window.removeEventListener("storage", updateThemeState);
      observer.disconnect();
    };
  }, []);

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = toggleAppTheme();
    setTheme(newTheme);

    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
      description: `The application is now in ${newTheme} mode.`,
      duration: 2000,
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}