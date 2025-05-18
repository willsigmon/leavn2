import { useAuth } from '../lib/auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpenText, Settings, LogOut, User as UserIcon, Search, Moon, Sun } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function NavBar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { logout } = useAuth();
  
  const handleLogout = () => {
    try {
      logout();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was a problem signing out.",
      });
    }
  };

  const userInitials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="container mx-auto">
        {/* Top navigation bar with logo, links and auth */}
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            {/* Logo */}
            <div 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 cursor-pointer relative"
            >
              <BookOpenText className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-primary mr-1">Leavn</span>
              <div className="flex items-center">
                <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold ml-1">
                  BETA
                </span>
              </div>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <div 
                onClick={() => navigate('/enhanced-reader')}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm font-medium"
              >
                Bible Reader
              </div>
              <div 
                onClick={() => navigate('/reading-plans')}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm font-medium"
              >
                Reading Plans
              </div>
            </nav>
          </div>
          
          {/* Search bar (integrated in the main navigation) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-2">
            <div className="w-full max-w-md relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search verses, topics..."
                className="w-full pl-9 bg-background"
              />
            </div>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Mobile search button */}
            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            
            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary text-primary-foreground"
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile search bar (only visible on mobile) */}
        <div className="md:hidden py-2 px-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search verses, topics..."
              className="w-full pl-9 bg-background"
            />
          </div>
        </div>
      </div>
    </header>
  );
}