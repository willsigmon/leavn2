import { useState } from 'react';
import { useLocation } from 'wouter';
import { signInWithGoogle } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: "Sign in successful",
        description: "Welcome to Leavn Bible Study",
      });
      setLocation('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "There was a problem signing in with Google.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Leavn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-muted-foreground mb-4">Sign in to access all features including personalized notes, highlights, and theological lenses.</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 py-6"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FcGoogle className="h-5 w-5 mr-2" />
            )}
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground flex justify-center">
          <p>Leavn: a small influence that causes a widespread transformation.</p>
        </CardFooter>
      </Card>
    </div>
  );
}