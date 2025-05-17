import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { logOut } from '../lib/firebase';
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
import { BookOpenText, Settings, LogOut, User as UserIcon, Search } from 'lucide-react';

export function NavBar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
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

  const userInitials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center cursor-pointer"
            >
              <BookOpenText className="w-7 h-7 mr-2 text-primary" />
              <span className="text-xl font-semibold">Leavn</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <div 
              onClick={() => navigate('/bible-reader')}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Bible Study
            </div>
            <div 
              onClick={() => navigate('/reading-plans')}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Reading Plans
            </div>
          </nav>
          
          {/* User section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
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
                onClick={() => navigate('/login')}
                className="bg-primary text-primary-foreground"
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}