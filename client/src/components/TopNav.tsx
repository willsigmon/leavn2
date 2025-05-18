import { Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TopNav() {
  return (
    <nav className="h-14 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 sticky top-0 z-50">
      <div className="h-full flex items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4 flex items-center">
            <h1 className="font-medium text-lg mr-2">Leavn</h1>
            <span className="text-stone-400 dark:text-stone-500">|</span>
            <span className="ml-2 text-stone-600 dark:text-stone-400">Bible Reader</span>
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-500 dark:text-stone-400" />
            <Input
              type="search"
              placeholder="Search verses, topics..."
              className="w-full pl-9 bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 h-9 text-sm"
            />
          </div>
          <Button variant="ghost" size="icon" aria-label="User profile">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}