import { Link } from "wouter";
import { FaCalendarDay, FaBookOpen, FaSeedling, FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";
import useMobile from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentBook?: string;
}

export default function Sidebar({ isOpen, onClose, currentBook }: SidebarProps) {
  const isMobile = useMobile();
  
  const oldTestamentBooks = [
    "genesis", "exodus", "psalms", "proverbs"
  ];
  
  const newTestamentBooks = [
    "matthew", "mark", "luke", "john"
  ];

  return (
    <aside 
      className={cn(
        "bg-white border-r border-gray-200 overflow-y-auto",
        isMobile ? "fixed inset-y-0 left-0 z-40 w-64 transition-transform transform duration-300 ease-in-out" : "hidden md:block w-64",
        isMobile && !isOpen && "-translate-x-full",
        isMobile && isOpen && "translate-x-0"
      )}
    >
      {isMobile && (
        <div className="p-4 flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-primary">
            <FaTimes className="text-xl" />
          </button>
        </div>
      )}
      
      <div className="px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-3">Reading Plans</h2>
          <ul className="space-y-1">
            <li>
              <Link href="/reading-plans" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-gray-100">
                <FaCalendarDay className="w-5 text-primary mr-2" />
                <span>All Reading Plans</span>
              </Link>
            </li>
            <li>
              <Link href="/reading-plan/plan1" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-gray-100">
                <FaBookOpen className="w-5 text-primary mr-2" />
                <span>Daily Devotional</span>
              </Link>
            </li>
            <li>
              <Link href="/reading-plan/plan2" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-gray-100">
                <FaSeedling className="w-5 text-primary mr-2" />
                <span>New Testament in 90 Days</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-3">Old Testament</h2>
          <ul className="space-y-1">
            {oldTestamentBooks.map((book) => {
              const bookTitle = book.charAt(0).toUpperCase() + book.slice(1);
              const isActive = currentBook === book;
              
              return (
                <li key={book}>
                  <Link 
                    href={`/bible/${book}/1`}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm rounded-lg",
                      isActive 
                        ? "font-semibold text-primary bg-secondary-light" 
                        : "hover:bg-gray-100"
                    )}
                  >
                    <span>{bookTitle}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-3">New Testament</h2>
          <ul className="space-y-1">
            {newTestamentBooks.map((book) => {
              const bookTitle = book.charAt(0).toUpperCase() + book.slice(1);
              const isActive = currentBook === book;
              
              return (
                <li key={book}>
                  <Link 
                    href={`/bible/${book}/1`}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm rounded-lg",
                      isActive 
                        ? "font-semibold text-primary bg-secondary-light" 
                        : "hover:bg-gray-100"
                    )}
                  >
                    <span>{bookTitle}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
