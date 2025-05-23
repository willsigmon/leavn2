import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaBars, FaSearch, FaUser } from "react-icons/fa";
import { Moon, Sun } from "lucide-react";
import useMobile from "@/hooks/use-mobile";
import { toggleTheme } from "@/lib/theme";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const isMobile = useMobile();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
              className="md:hidden text-primary/90" 
              aria-label="Toggle sidebar"
            >
              <FaBars className="text-xl" />
            </button>
            <Link href="/" className="flex items-center">
                <span className="text-primary font-serif font-bold text-2xl">Leavn</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center flex-1 px-4">
            <div className="relative w-full max-w-2xl">
              <Input
                type="text"
                placeholder="Search verses, topics..."
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-muted border-input focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="absolute left-3 top-2.5 text-muted-foreground">
                <FaSearch />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden text-primary/90" 
              aria-label="Search"
            >
              <FaSearch className="text-xl" />
            </button>
            
            {/* Theme toggle button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In
            </Button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary/90">
                <FaUser />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
