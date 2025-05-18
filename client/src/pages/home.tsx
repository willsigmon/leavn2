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
      <section className="py-20 px-4 md:px-0 bg-gradient-to-b from-[#f0f4ed] to-[#e8efe8] dark:from-[#1a3328] dark:to-[#1f3c37] relative overflow-hidden">
        {/* Decorative elements with animations */}
        <div className="absolute top-12 left-12 w-24 h-24 bg-[#c5d5bc] dark:bg-[#2c4c3b] rounded-lg opacity-20 rotate-12 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#d8e5d2] dark:bg-[#345841] rounded-full opacity-30 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/4 right-10 w-16 h-16 bg-[#e8efe5] dark:bg-[#3b5045] rounded-lg opacity-20 -rotate-12 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-[#e8efe5] dark:bg-[#2c4c3b] rounded-full opacity-30 animate-pulse animation-delay-3000"></div>
        
        {/* Additional circles with different sizes, shapes and animations */}
        <div className="absolute top-40 left-1/4 w-14 h-14 bg-[#e8efe5] dark:bg-[#2c4c3b] rounded-full opacity-15 animate-float animation-delay-2500"></div>
        <div className="absolute bottom-16 left-1/3 w-10 h-10 bg-[#a5c2a5] dark:bg-[#345841] rounded-full opacity-20 animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#d8e5d2] dark:bg-[#3b5045] rounded-full opacity-25 animate-float animation-delay-3500"></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-[#e8efe5] dark:bg-[#2c4c3b] rounded-full opacity-20 animate-pulse animation-delay-1500"></div>
        <div className="absolute top-16 right-1/2 w-8 h-8 bg-[#d8e5d2] dark:bg-[#345841] rounded-full opacity-15 animate-float animation-delay-4000"></div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center">
            <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
              <div className="inline-block px-4 py-1 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 text-[#2c4c3b] dark:text-[#a5c2a5] text-sm font-semibold mb-2 md:mb-4">
                Spiritually Intelligent Bible Study
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-stone-800 dark:text-stone-100">
                Bible Study made <span className="bg-gradient-to-r from-[#2c4c3b] to-[#3a6349] dark:from-[#3a6349] dark:to-[#4d7a5e] bg-clip-text text-transparent">simple.</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300">
                Engage with Scripture through multiple theological lenses, immersive narratives, 
                and AI-powered spiritual insights – all in one place.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 pt-4 md:pt-6">
                {isAuthenticated ? (
                  <Button size="lg" onClick={() => navigate('/reader')} className="w-full sm:w-auto bg-[#2c4c3b] hover:bg-[#223c2e] dark:bg-[#2c4c3b] dark:hover:bg-[#223c2e] text-white border-0 rounded-lg">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Open Bible Reader
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => login()} className="w-full sm:w-auto bg-[#2c4c3b] hover:bg-[#223c2e] dark:bg-[#2c4c3b] dark:hover:bg-[#223c2e] text-white border-0 rounded-lg">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={() => navigate('/reading-plans')} className="w-full sm:w-auto border-[#a5c2a5] dark:border-[#3a6349] text-[#2c4c3b] dark:text-[#a5c2a5] hover:bg-[#f0f4ed] dark:hover:bg-[#2c4c3b]/30 rounded-lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  View Reading Plans
                </Button>
              </div>
              
              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 md:gap-4 pt-6 justify-center sm:justify-start">
                <div className="flex items-center text-sm text-stone-600 dark:text-stone-300">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 flex items-center justify-center mr-2">
                    <span className="text-[#2c4c3b] dark:text-[#a5c2a5] text-xs">✓</span>
                  </div>
                  <span className="whitespace-nowrap">Free to use</span>
                </div>
                <div className="flex items-center text-sm text-stone-600 dark:text-stone-300">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 flex items-center justify-center mr-2">
                    <span className="text-[#2c4c3b] dark:text-[#a5c2a5] text-xs">✓</span>
                  </div>
                  <span className="whitespace-nowrap">Multiple translations</span>
                </div>
                <div className="flex items-center text-sm text-stone-600 dark:text-stone-300">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 flex items-center justify-center mr-2">
                    <span className="text-[#2c4c3b] dark:text-[#a5c2a5] text-xs">✓</span>
                  </div>
                  <span className="whitespace-nowrap">AI-powered insights</span>
                </div>
              </div>
            </div>
            <div className="w-full mt-8 lg:mt-0 lg:w-1/2 relative">
              <div className="hidden md:block absolute inset-0 -left-6 -top-6 bg-[#f0f4ed] dark:bg-[#2c4c3b]/30 rounded-xl"></div>
              <div className="hidden md:block absolute inset-0 -right-6 -bottom-6 bg-[#e8efe5] dark:bg-[#345841]/30 rounded-xl"></div>
              
              {/* Bible Reader Preview Card */}
              <div className="relative rounded-xl overflow-hidden shadow-xl border-2 md:border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-900 h-80 lg:h-96">
                {/* Reader Header */}
                <div className="bg-[#e8efe5] dark:bg-[#284233]/50 p-3 border-b border-[#d8e5d2] dark:border-[#2c4c3b]/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-[#2c4c3b] dark:text-[#a5c2a5]" />
                    <span className="font-medium text-[#2c4c3b] dark:text-[#a5c2a5]">Genesis 1</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-full bg-[#d8e5d2] dark:bg-[#345841] animate-pulse"></div>
                    <div className="h-5 w-5 rounded-full bg-[#c5d5bc] dark:bg-[#3b5045]"></div>
                  </div>
                </div>
                
                {/* Reader Content with Scrolling Animation */}
                <div className="p-5 h-full overflow-hidden relative">
                  {/* Biblical Text */}
                  <div className="animate-subtle-scroll">
                    <p className="font-serif text-lg text-stone-800 dark:text-stone-200 mb-3">
                      <span className="text-[#2c4c3b] dark:text-[#a5c2a5] font-semibold">1</span> In the beginning God created the heavens and the earth.
                    </p>
                    <p className="font-serif text-lg text-stone-800 dark:text-stone-200 mb-3">
                      <span className="text-[#2c4c3b] dark:text-[#a5c2a5] font-semibold">2</span> Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
                    </p>
                    
                    {/* Highlighted Verse with Commentary Animation */}
                    <div className="my-2 p-3 bg-[#f0f4ed] dark:bg-[#2c4c3b]/30 rounded-lg border-l-4 border-[#3a6349] dark:border-[#3a6349] animate-pulse-slow">
                      <p className="font-serif text-lg text-stone-800 dark:text-stone-200">
                        <span className="text-[#2c4c3b] dark:text-[#a5c2a5] font-semibold">3</span> And God said, "<span className="relative inline-block">Let there be light<span className="absolute bottom-0 left-0 right-0 border-b border-dotted border-[#3a6349] dark:border-[#3a6349]"></span></span>," and there was light.
                      </p>
                      
                      {/* Commentary Popup - Animated */}
                      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded shadow-md border border-[#d8e5d2] dark:border-[#2c4c3b] animate-fade-in">
                        <div className="flex items-center mb-2">
                          <div className="h-4 w-4 rounded-full bg-[#3a6349] dark:bg-[#3a6349] mr-2"></div>
                          <span className="text-sm font-medium text-[#2c4c3b] dark:text-[#a5c2a5]">Evangelical Perspective</span>
                        </div>
                        <p className="text-sm text-stone-600 dark:text-stone-300">
                          This powerful declaration demonstrates God's creative power through His spoken word, establishing His authority over creation.
                        </p>
                      </div>
                    </div>
                    
                    <p className="font-serif text-lg text-stone-800 dark:text-stone-200 mb-3">
                      <span className="text-[#2c4c3b] dark:text-[#a5c2a5] font-semibold">4</span> God saw that the light was good, and he separated the light from the darkness.
                    </p>
                    <p className="font-serif text-lg text-stone-800 dark:text-stone-200">
                      <span className="text-[#2c4c3b] dark:text-[#a5c2a5] font-semibold">5</span> God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.
                    </p>
                  </div>
                  
                  {/* Subtle Lens Switcher Animation */}
                  <div className="absolute bottom-4 right-4 flex bg-white dark:bg-gray-800 rounded-full p-1 shadow-md animate-bounce-subtle">
                    <div className="h-7 w-7 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] text-xs flex items-center justify-center text-[#2c4c3b] dark:text-[#a5c2a5] font-medium">E</div>
                    <div className="h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-xs flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium ml-1">C</div>
                    <div className="h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-xs flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium ml-1">J</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 px-4 md:px-0 bg-white dark:bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 text-[#2c4c3b] dark:text-[#a5c2a5] text-sm font-semibold mb-4">
              Powerful Features
            </div>
            <h2 className="text-3xl font-bold mb-4 text-stone-800 dark:text-stone-100">Bible Study designed for <span className="text-[#2c4c3b] dark:text-[#a5c2a5]">deeper understanding</span></h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              Everything you need to explore Scripture more deeply and meaningfully with features that enhance your understanding
              and bring the text to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Multiple Theological Lenses</h3>
                <p className="text-muted-foreground mb-4">
                  Study passages through Evangelical, Catholic, Jewish, and other perspectives.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground/80">
                    Each theological tradition brings unique insights to deepen your understanding.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mb-4">
                  <PenLine className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Narrative Mode</h3>
                <p className="text-muted-foreground mb-4">
                  Transform Bible chapters into immersive, flowing narratives.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground/80">
                    Experience Scripture as a continuous story for better context and understanding.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center mb-4">
                  <LightbulbIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">"Did You Know" Facts</h3>
                <p className="text-muted-foreground mb-4">
                  Discover fascinating historical and cultural contexts.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground/80">
                    Uncover interesting facts about the time period and historical background.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Contextual Questions</h3>
                <p className="text-muted-foreground mb-4">
                  Ask questions about passages and receive detailed explanations.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground/80">
                    Get thoughtful answers that consider the historical and literary context.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-4">
                  <Compass className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Reading Plans</h3>
                <p className="text-muted-foreground mb-4">
                  Follow curated daily reading schedules for structured study.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground/80">
                    Stay consistent with guided plans focused on specific themes and topics.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-sky-100 dark:bg-sky-950 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Semantic Search</h3>
                <p className="text-muted-foreground mb-4">
                  Find verses based on concepts, not just keywords.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground/80">
                    Discover related passages you might otherwise miss with concept-based search.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-0 bg-[#f2f6ef] dark:bg-[#2c4c3b]/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/50 text-[#2c4c3b] dark:text-[#a5c2a5] text-sm font-semibold mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold mb-4 text-stone-800 dark:text-stone-100">What Users Are Saying</h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              Hear from people who have experienced deeper understanding through Leavn's approach to Bible study.
            </p>
          </div>

          <Tabs defaultValue="pastors" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#e8efe5]/50 dark:bg-[#2c4c3b]/30">
                <TabsTrigger value="pastors" className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-[#a5c2a5]">Pastors</TabsTrigger>
                <TabsTrigger value="students" className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-[#a5c2a5]">Students</TabsTrigger>
                <TabsTrigger value="families" className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-[#a5c2a5]">Families</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="pastors">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-card rounded-lg p-6 shadow-md border border-border">
                  <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] mb-4 flex items-center justify-center">
                    <span className="text-[#2c4c3b] dark:text-[#a5c2a5]">❝</span>
                  </div>
                  <p className="italic mb-4 text-foreground">
                    "Leavn has transformed my sermon preparation process. The multiple theological lenses help me consider viewpoints I might have overlooked, and the contextual information is incredibly valuable."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] flex items-center justify-center text-[#2c4c3b] dark:text-[#a5c2a5] font-bold">
                      JM
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-foreground">Pastor James Miller</p>
                      <p className="text-sm text-muted-foreground">Community Church</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg p-6 shadow-md border border-border">
                  <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] mb-4 flex items-center justify-center">
                    <span className="text-[#2c4c3b] dark:text-[#a5c2a5]">❝</span>
                  </div>
                  <p className="italic mb-4 text-foreground">
                    "The ability to instantly access different commentaries and perspectives saves me hours of research time, and the narrative mode helps bring passages to life for my congregation."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] flex items-center justify-center text-[#2c4c3b] dark:text-[#a5c2a5] font-bold">
                      SR
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-foreground">Rev. Sarah Rodriguez</p>
                      <p className="text-sm text-muted-foreground">Hillside Fellowship</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="students">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-card rounded-lg p-6 shadow-md border border-border">
                  <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] mb-4 flex items-center justify-center">
                    <span className="text-[#2c4c3b] dark:text-[#a5c2a5]">❝</span>
                  </div>
                  <p className="italic mb-4 text-foreground">
                    "As a theology student, the multiple perspectives feature is invaluable. I can quickly compare different theological traditions' interpretations of the same passage."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] flex items-center justify-center text-[#2c4c3b] dark:text-[#a5c2a5] font-bold">
                      DJ
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-foreground">David Johnson</p>
                      <p className="text-sm text-muted-foreground">Seminary Student</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg p-6 shadow-md border border-border">
                  <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] mb-4 flex items-center justify-center">
                    <span className="text-[#2c4c3b] dark:text-[#a5c2a5]">❝</span>
                  </div>
                  <p className="italic mb-4 text-foreground">
                    "The 'Did You Know' facts and contextual questions help me understand cultural nuances I would have missed. It's like having a professor available 24/7."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] flex items-center justify-center text-[#2c4c3b] dark:text-[#a5c2a5] font-bold">
                      AT
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-foreground">Amanda Torres</p>
                      <p className="text-sm text-muted-foreground">Religious Studies Major</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="families">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-card rounded-lg p-6 shadow-md border border-border">
                  <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] mb-4 flex items-center justify-center">
                    <span className="text-[#2c4c3b] dark:text-[#a5c2a5]">❝</span>
                  </div>
                  <p className="italic mb-4 text-foreground">
                    "The kids' translation makes family devotions so much more engaging. Our children actually look forward to Bible time now!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] flex items-center justify-center text-[#2c4c3b] dark:text-[#a5c2a5] font-bold">
                      WF
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-foreground">Wilson Family</p>
                      <p className="text-sm text-muted-foreground">Parents of three</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg p-6 shadow-md border border-border">
                  <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] mb-4 flex items-center justify-center">
                    <span className="text-[#2c4c3b] dark:text-[#a5c2a5]">❝</span>
                  </div>
                  <p className="italic mb-4 text-foreground">
                    "We use the reading plans to keep our family consistent with Bible study. The narrative mode helps our teenagers connect with stories in a fresh way."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b] flex items-center justify-center text-[#2c4c3b] dark:text-[#a5c2a5] font-bold">
                      LP
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-foreground">Liu-Parker Family</p>
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
      <section className="py-20 px-4 md:px-0 bg-gradient-to-b from-[#2c4c3b] to-[#1a3328] dark:from-[#2c4c3b] dark:to-[#1a3328] text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-lg rotate-12"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#a5c2a5]/10 rounded-full"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm font-semibold mb-6">
            Ready to get started?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Begin Your Journey of Deeper Understanding
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of others discovering new dimensions of Scripture through Leavn's
            innovative study tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate('/reader')} className="bg-white text-[#2c4c3b] hover:bg-gray-100 border-0 rounded-lg shadow-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Open Bible Reader
              </Button>
            ) : (
              <Button size="lg" onClick={() => login()} className="bg-white text-[#2c4c3b] hover:bg-gray-100 border-0 rounded-lg shadow-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            )}
            
            <Button size="lg" onClick={() => navigate('/reading-plans')} className="bg-white/25 border-2 border-white text-white font-bold hover:bg-white/40 rounded-lg shadow-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Explore Reading Plans
            </Button>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center text-sm text-emerald-100">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </div>
              Free for unlimited users
            </div>
            <div className="flex items-center text-sm text-emerald-100">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </div>
              No account required to explore
            </div>
            <div className="flex items-center text-sm text-emerald-100">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </div>
              Premium features with free account
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}