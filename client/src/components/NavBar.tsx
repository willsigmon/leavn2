import { useAuth } from '../hooks/useAuth';
import { Link } from 'wouter';
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
import { BookOpenText, Settings, LogOut, User as UserIcon } from 'lucide-react';

export function NavBar() {
  const { user } = useAuth();
  const { toast } = useToast();

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
    <nav className="bg-background border-b flex items-center justify-between p-4">
      <div className="flex items-center">
        <Link href="/">
          <a className="text-xl font-semibold flex items-center">
            <BookOpenText className="w-6 h-6 mr-2 text-primary" />
            <span>Leavn</span>
          </a>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link href="/bible-reader">
              <a className="text-muted-foreground hover:text-foreground transition-colors">
                Bible Study
              </a>
            </Link>
            
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
                <Link href="/profile">
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/login">
            <Button className="bg-primary text-primary-foreground">Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}