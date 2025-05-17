import { useState } from 'react';
import { useLocation } from 'wouter';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, signInWithProvider } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FcGoogle } from 'react-icons/fc';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters.")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email.")
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const { toast } = useToast();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Reset form
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: ""
    }
  });

  // Handle SSO sign in with any provider
  const handleSSOSignIn = async (provider: string) => {
    try {
      setIsLoading(true);
      console.log(`Attempting to sign in with ${provider}...`);
      const user = await signInWithProvider(provider);
      console.log("Sign in successful:", user?.displayName);
      
      toast({
        title: "Sign in successful",
        description: `Welcome${user?.displayName ? ` ${user.displayName}` : ""} to Leavn Bible Study`,
      });
      setLocation('/');
    } catch (error: any) {
      console.error(`Login error with ${provider}:`, error);
      
      // Provide better error messages to the user
      let errorMessage = `There was a problem signing in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`;
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Google sign in (for backward compatibility)
  const handleGoogleSignIn = async () => {
    await handleSSOSignIn('google');
  };

  // Handle email login
  const handleEmailLogin = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign in with email...");
      const user = await signInWithEmail(values.email, values.password);
      console.log("Email sign in successful:", user?.displayName);
      
      toast({
        title: "Sign in successful",
        description: `Welcome${user?.displayName ? ` ${user.displayName}` : ""} to Leavn Bible Study`,
      });
      setLocation('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide more specific error messages
      let errorMessage = "Invalid email or password.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account exists with this email. Please check your email or register.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled. Please contact support.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      console.log("Attempting to register with email...");
      const user = await signUpWithEmail(values.email, values.password, values.name);
      console.log("Registration successful:", user?.displayName);
      
      toast({
        title: "Registration successful",
        description: `Your account has been created. Welcome${user?.displayName ? ` ${user.displayName}` : ""} to Leavn!`,
      });
      setLocation('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Provide more specific error messages
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Try logging in instead.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (values: ResetFormValues) => {
    try {
      setIsLoading(true);
      console.log("Attempting to send password reset email...");
      await resetPassword(values.email);
      console.log("Password reset email sent successfully");
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password.",
      });
      setShowResetForm(false);
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Provide more specific error messages
      let errorMessage = "There was a problem sending the reset email.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account exists with this email address.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Leavn</CardTitle>
          <CardDescription>
            Sign in to access all features including personalized notes, highlights, and theological lenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showResetForm ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Reset Password</h3>
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setShowResetForm(false)}
                      disabled={isLoading}
                    >
                      Back to login
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Reset Password
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleEmailLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="link" 
                      className="p-0 h-auto font-normal text-sm"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot password?
                    </Button>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign in with Email
                    </Button>
                  </form>
                </Form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => handleSSOSignIn('google')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FcGoogle className="h-5 w-5" />
                    )}
                    Google
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => handleSSOSignIn('github')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                        <path
                          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    GitHub
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => handleSSOSignIn('apple')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                        <path
                          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    Apple
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => handleSSOSignIn('microsoft')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                        <path
                          d="M0 0h11.5v11.5H0V0zm12.5 0H24v11.5H12.5V0zM0 12.5h11.5V24H0V12.5zm12.5 0H24V24H12.5V12.5z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    Microsoft
                  </Button>
                </div>
              </TabsContent>
              
              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </Form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or register with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => handleSSOSignIn('google')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FcGoogle className="h-5 w-5" />
                    )}
                    Google
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => handleSSOSignIn('github')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                        <path
                          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    GitHub
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => handleSSOSignIn('apple')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                        <path
                          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    Apple
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => handleSSOSignIn('microsoft')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                        <path
                          d="M0 0h11.5v11.5H0V0zm12.5 0H24v11.5H12.5V0zM0 12.5h11.5V24H0V12.5zm12.5 0H24V24H12.5V12.5z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    Microsoft
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground flex justify-center">
          <p>Leavn: a small influence that causes a widespread transformation.</p>
        </CardFooter>
      </Card>
    </div>
  );
}