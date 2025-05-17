import { useAuth } from '../lib/auth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Settings, MessageCircle, BookmarkCheck, Award } from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    navigate('/login');
    return null;
  }

  const userInitials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="bg-primary text-xl text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground mb-4">{user?.email}</p>
                
                <div className="flex space-x-2 mb-6">
                  <Button variant="outline" size="sm" onClick={() => navigate('/settings')} className="flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                </div>
                
                <div className="w-full space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reading Progress</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted rounded-lg p-2">
                      <div className="font-bold text-lg">42</div>
                      <div className="text-xs text-muted-foreground">Chapters Read</div>
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <div className="font-bold text-lg">16</div>
                      <div className="text-xs text-muted-foreground">Notes</div>
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <div className="font-bold text-lg">3</div>
                      <div className="text-xs text-muted-foreground">Plans</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Profile Content */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="activity">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
              <TabsTrigger value="highlights" className="flex-1">Highlights</TabsTrigger>
              <TabsTrigger value="badges" className="flex-1">Badges</TabsTrigger>
            </TabsList>
            
            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your Bible study journey over the past few weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Read John Chapter 3</p>
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Completed reading with Catholic commentary lens</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Added a note to Psalms 23:1</p>
                          <span className="text-xs text-muted-foreground">4 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">"This verse reminds me to trust in God's provision..."</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <BookmarkCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Started "30 Days in Proverbs" plan</p>
                          <span className="text-xs text-muted-foreground">1 week ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Day 3 of 30 completed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notes Tab */}
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Your Notes</CardTitle>
                  <CardDescription>Personal insights from your Bible study</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary p-4 bg-muted/30 rounded-r-lg">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Matthew 5:9</h3>
                        <span className="text-xs text-muted-foreground">May 12, 2025</span>
                      </div>
                      <p className="text-sm">Peacemakers are those who actively work to reconcile people to God and to one another. This connects to Ephesians where Paul talks about Christ breaking down the dividing wall of hostility.</p>
                    </div>
                    
                    <div className="border-l-4 border-primary p-4 bg-muted/30 rounded-r-lg">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Psalms 23:1</h3>
                        <span className="text-xs text-muted-foreground">May 8, 2025</span>
                      </div>
                      <p className="text-sm">This verse reminds me to trust in God's provision and care. Even when I feel lost, I am never without a shepherd.</p>
                    </div>
                    
                    <div className="border-l-4 border-primary p-4 bg-muted/30 rounded-r-lg">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Proverbs 3:5-6</h3>
                        <span className="text-xs text-muted-foreground">May 2, 2025</span>
                      </div>
                      <p className="text-sm">When making decisions, I need to remember to trust God rather than relying solely on my own understanding. His wisdom exceeds human reasoning.</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-6">View All Notes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Highlights Tab */}
            <TabsContent value="highlights">
              <Card>
                <CardHeader>
                  <CardTitle>Your Highlights</CardTitle>
                  <CardDescription>Verses you've highlighted during your study</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm italic mb-2">"For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."</p>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium">John 3:16</span>
                        <span className="text-xs text-muted-foreground">May 15, 2025</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm italic mb-2">"I can do all things through him who strengthens me."</p>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium">Philippians 4:13</span>
                        <span className="text-xs text-muted-foreground">May 10, 2025</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm italic mb-2">"The Lord is my shepherd; I shall not want."</p>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium">Psalms 23:1</span>
                        <span className="text-xs text-muted-foreground">May 5, 2025</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-6">View All Highlights</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Badges Tab */}
            <TabsContent value="badges">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Badges earned through your Bible study journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg">
                      <div className="bg-primary/10 p-3 rounded-full mb-3">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-medium">Scripture Explorer</h3>
                      <p className="text-xs text-muted-foreground mt-1">Read 10 different books of the Bible</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg">
                      <div className="bg-primary/10 p-3 rounded-full mb-3">
                        <BookmarkCheck className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-medium">Faithful Student</h3>
                      <p className="text-xs text-muted-foreground mt-1">Complete a reading plan</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-4 border-2 border-dashed border-muted rounded-lg opacity-50">
                      <div className="bg-muted p-3 rounded-full mb-3">
                        <MessageCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium">Deep Thinker</h3>
                      <p className="text-xs text-muted-foreground mt-1">Write 20 study notes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}