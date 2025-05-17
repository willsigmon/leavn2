import { useAuth } from '../lib/auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Calendar, 
  Search, 
  Sparkles, 
  MessageCircle, 
  LightbulbIcon, 
  Compass,
  PenLine
} from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, login } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="py-20 px-4 md:px-0 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Explore Scripture with <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Deeper Understanding</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Engage with the Bible through multiple theological perspectives, immersive narratives, 
                and AI-powered spiritual insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {isAuthenticated ? (
                  <Button size="lg" onClick={() => navigate('/bible-reader')} className="bg-primary hover:bg-primary/90">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Open Bible Reader
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => login()} className="bg-primary hover:bg-primary/90">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={() => navigate('/reading-plans')}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Browse Reading Plans
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
                alt="Bible study" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 px-4 md:px-0">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features Designed for Deeper Study</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover new dimensions of Scripture with features that enhance your understanding
              and bring the text to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Sparkles className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Multiple Theological Lenses</CardTitle>
                <CardDescription>
                  Study passages through Evangelical, Catholic, Jewish, and other perspectives.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Each theological tradition brings unique insights to Scripture. Explore these different viewpoints to deepen your understanding.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <PenLine className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Narrative Mode</CardTitle>
                <CardDescription>
                  Transform Bible chapters into immersive, flowing narratives.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Experience Scripture as a continuous story, making it easier to grasp context and meaning in a more engaging format.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <LightbulbIcon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>"Did You Know" Facts</CardTitle>
                <CardDescription>
                  Discover fascinating historical and cultural contexts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Uncover interesting facts about the time period, culture, and historical background of each passage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageCircle className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Contextual Questions</CardTitle>
                <CardDescription>
                  Ask questions about passages and receive detailed explanations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  When you have questions about a verse or passage, get thoughtful explanations tailored to the specific context.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Compass className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Reading Plans</CardTitle>
                <CardDescription>
                  Follow curated daily reading schedules for structured study.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stay consistent with your Bible reading through guided plans focused on specific themes, books, or topics.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Semantic Search</CardTitle>
                <CardDescription>
                  Find verses based on concepts, not just keywords.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Search for ideas and themes rather than exact words, helping you discover related passages you might otherwise miss.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-0 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Users Are Saying</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from people who have experienced deeper understanding through Leavn's approach to Bible study.
            </p>
          </div>

          <Tabs defaultValue="pastors" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="pastors">Pastors</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="families">Families</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="pastors">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-background rounded-lg p-6 shadow-sm">
                  <p className="italic mb-4">
                    "Leavn has transformed my sermon preparation process. The multiple theological lenses help me consider viewpoints I might have overlooked, and the contextual information is incredibly valuable."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      JM
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Pastor James Miller</p>
                      <p className="text-sm text-muted-foreground">Community Church</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-6 shadow-sm">
                  <p className="italic mb-4">
                    "The ability to instantly access different commentaries and perspectives saves me hours of research time, and the narrative mode helps bring passages to life for my congregation."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      SR
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Rev. Sarah Rodriguez</p>
                      <p className="text-sm text-muted-foreground">Hillside Fellowship</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="students">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-background rounded-lg p-6 shadow-sm">
                  <p className="italic mb-4">
                    "As a theology student, the multiple perspectives feature is invaluable. I can quickly compare different theological traditions' interpretations of the same passage."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      DJ
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">David Johnson</p>
                      <p className="text-sm text-muted-foreground">Seminary Student</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-6 shadow-sm">
                  <p className="italic mb-4">
                    "The 'Did You Know' facts and contextual questions help me understand cultural nuances I would have missed. It's like having a professor available 24/7."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      AT
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Amanda Torres</p>
                      <p className="text-sm text-muted-foreground">Religious Studies Major</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="families">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-background rounded-lg p-6 shadow-sm">
                  <p className="italic mb-4">
                    "The kids' translation makes family devotions so much more engaging. Our children actually look forward to Bible time now!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      WF
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Wilson Family</p>
                      <p className="text-sm text-muted-foreground">Parents of three</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-6 shadow-sm">
                  <p className="italic mb-4">
                    "We use the reading plans to keep our family consistent with Bible study. The narrative mode helps our teenagers connect with stories in a fresh way."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      LP
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Liu-Parker Family</p>
                      <p className="text-sm text-muted-foreground">Home church group</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 px-4 md:px-0 text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Begin Your Journey of Deeper Understanding
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of others discovering new dimensions of Scripture through Leavn's
            innovative study tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate('/bible-reader')} className="bg-primary hover:bg-primary/90">
                <BookOpen className="mr-2 h-5 w-5" />
                Open Bible Reader
              </Button>
            ) : (
              <Button size="lg" onClick={() => login()} className="bg-primary hover:bg-primary/90">
                <BookOpen className="mr-2 h-5 w-5" />
                Get Started Now
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={() => navigate('/reading-plans')}>
              Explore Reading Plans
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            No registration required to start. Personalized features available with free account.
          </p>
        </div>
      </section>
    </div>
  );
}