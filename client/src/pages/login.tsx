import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, LogIn, BookOpen, UserPlus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = () => {
    setIsLoading(true);
    try {
      window.location.href = '/api/login';
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "There was a problem with the authentication service. Please try again later.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Welcome to Leavn</CardTitle>
          <CardDescription className="text-base">
            Sign in to access all features including personalized notes, highlights, and theological lenses.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-md mb-6">
              Leavn helps you engage more deeply with Scripture through AI-powered insights, 
              multiple theological perspectives, and personalized study tools.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleSignIn}
              className="w-full py-6 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              Sign in with Replit
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  What you'll get
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="flex items-start space-x-3 bg-muted/40 p-3 rounded-lg">
                <BookOpen className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Multiple Theological Perspectives</h3>
                  <p className="text-sm text-muted-foreground">Study scripture through Evangelical, Catholic, Jewish, and other lenses</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 bg-muted/40 p-3 rounded-lg">
                <UserPlus className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Personal Study Tools</h3>
                  <p className="text-sm text-muted-foreground">Save notes, highlights, and create personalized reading plans</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-muted-foreground w-full">
            By signing in, you agree to our <a href="/legal/terms-of-service" className="underline hover:text-primary">Terms of Service</a> and <a href="/legal/privacy-policy" className="underline hover:text-primary">Privacy Policy</a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}