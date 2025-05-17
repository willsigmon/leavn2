import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaBars, FaSearch, FaUser } from "react-icons/fa";
import useMobile from "@/hooks/use-mobile";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const isMobile = useMobile();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
              className="md:hidden text-primary" 
              aria-label="Toggle sidebar"
            >
              <FaBars className="text-xl" />
            </button>
            <Link href="/">
              <a className="flex items-center">
                <span className="text-primary-dark font-serif font-bold text-2xl">Leavn</span>
              </a>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search verses, topics..."
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <FaSearch />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden text-primary" 
              aria-label="Search"
            >
              <FaSearch className="text-xl" />
            </button>
            <Button className="bg-primary-dark hover:bg-primary text-white">
              Sign In
            </Button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-primary">
                <FaUser />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
