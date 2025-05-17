import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, BookmarkIcon, HighlighterIcon } from 'lucide-react';

export default function Profile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setLocation('/login');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // This will briefly show before redirecting
  }

  const userInitials = user.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  // Mock study stats - in a real app these would come from the database
  const studyStats = {
    daysActive: 12,
    chaptersRead: 24,
    bookmarks: 8,
    highlights: 15,
    notes: 7,
    preferredTranslation: 'KJV',
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center sm:text-left">
              <CardTitle className="text-2xl">{user.displayName}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant="outline" className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>Member since {new Date().toLocaleDateString()}</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activity">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Study Activity</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Days Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{studyStats.daysActive}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Chapters Read</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{studyStats.chaptersRead}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Study Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{studyStats.notes}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                    <BookmarkIcon className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Bookmarked John 3:16</p>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                    <HighlighterIcon className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Highlighted Proverbs 3:5-6</p>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Preferred Bible Translation</h3>
                <p className="text-muted-foreground">Currently set to: <span className="font-medium text-foreground">{studyStats.preferredTranslation}</span></p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline">KJV</Button>
                  <Button variant="outline">WEB</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3">Default Theological Lens</h3>
                <p className="text-muted-foreground">Your preferred theological perspective for commentary.</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline">Standard</Button>
                  <Button variant="outline">Catholic</Button>
                  <Button variant="outline">Evangelical</Button>
                  <Button variant="outline">Jewish</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Account Information</h3>
                <p className="text-muted-foreground">Your account is linked to your Google profile.</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3 text-destructive">Danger Zone</h3>
                <p className="text-muted-foreground">These actions cannot be undone.</p>
                <div className="mt-4">
                  <Button variant="destructive">Delete Account Data</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}