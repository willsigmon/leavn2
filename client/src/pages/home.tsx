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
      <section className="py-20 px-4 md:px-0 bg-gradient-to-b from-amber-50 to-emerald-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-12 left-12 w-24 h-24 bg-amber-200 rounded-lg opacity-20 rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-emerald-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/4 right-10 w-16 h-16 bg-stone-200 rounded-lg opacity-20 -rotate-12"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-lime-200 rounded-full opacity-30"></div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center">
            <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
              <div className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-2 md:mb-4">
                Spiritually Intelligent Bible Study
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Bible Study made <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">simple.</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-600">
                Engage with Scripture through multiple theological lenses, immersive narratives, 
                and AI-powered spiritual insights – all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6">
                {isAuthenticated ? (
                  <Button size="lg" onClick={() => navigate('/reader')} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-lg">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Open Bible Reader
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => login()} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-lg">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={() => navigate('/reading-plans')} className="w-full sm:w-auto border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  View Reading Plans
                </Button>
              </div>
              
              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 md:gap-4 pt-6 justify-center sm:justify-start">
                <div className="flex items-center text-sm text-stone-600">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                    <span className="text-emerald-700 text-xs">✓</span>
                  </div>
                  <span className="whitespace-nowrap">Free to use</span>
                </div>
                <div className="flex items-center text-sm text-stone-600">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                    <span className="text-emerald-700 text-xs">✓</span>
                  </div>
                  <span className="whitespace-nowrap">Multiple translations</span>
                </div>
                <div className="flex items-center text-sm text-stone-600">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                    <span className="text-emerald-700 text-xs">✓</span>
                  </div>
                  <span className="whitespace-nowrap">AI-powered insights</span>
                </div>
              </div>
            </div>
            <div className="w-full mt-8 lg:mt-0 lg:w-1/2 relative">
              <div className="hidden md:block absolute inset-0 -left-6 -top-6 bg-amber-100 rounded-xl"></div>
              <div className="hidden md:block absolute inset-0 -right-6 -bottom-6 bg-emerald-100 rounded-xl"></div>
              <div className="relative rounded-xl overflow-hidden shadow-xl border-2 md:border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
                  alt="Bible study" 
                  className="w-full h-64 md:h-80 lg:h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 px-4 md:px-0 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
              Powerful Features
            </div>
            <h2 className="text-3xl font-bold mb-4">Bible Study designed for <span className="text-emerald-600">deeper understanding</span></h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Everything you need to explore Scripture more deeply and meaningfully with features that enhance your understanding
              and bring the text to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multiple Theological Lenses</h3>
                <p className="text-slate-600 mb-4">
                  Study passages through Evangelical, Catholic, Jewish, and other perspectives.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-slate-500">
                    Each theological tradition brings unique insights to deepen your understanding.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                  <PenLine className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Narrative Mode</h3>
                <p className="text-slate-600 mb-4">
                  Transform Bible chapters into immersive, flowing narratives.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-slate-500">
                    Experience Scripture as a continuous story for better context and understanding.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <LightbulbIcon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">"Did You Know" Facts</h3>
                <p className="text-slate-600 mb-4">
                  Discover fascinating historical and cultural contexts.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-slate-500">
                    Uncover interesting facts about the time period and historical background.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Contextual Questions</h3>
                <p className="text-slate-600 mb-4">
                  Ask questions about passages and receive detailed explanations.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-slate-500">
                    Get thoughtful answers that consider the historical and literary context.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                  <Compass className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Reading Plans</h3>
                <p className="text-slate-600 mb-4">
                  Follow curated daily reading schedules for structured study.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-slate-500">
                    Stay consistent with guided plans focused on specific themes and topics.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="h-12 w-12 rounded-lg bg-sky-100 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Semantic Search</h3>
                <p className="text-slate-600 mb-4">
                  Find verses based on concepts, not just keywords.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-slate-500">
                    Discover related passages you might otherwise miss with concept-based search.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-0 bg-amber-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold mb-4">What Users Are Saying</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Hear from people who have experienced deeper understanding through Leavn's approach to Bible study.
            </p>
          </div>

          <Tabs defaultValue="pastors" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-amber-100/50">
                <TabsTrigger value="pastors" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">Pastors</TabsTrigger>
                <TabsTrigger value="students" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">Students</TabsTrigger>
                <TabsTrigger value="families" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">Families</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="pastors">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md border border-amber-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 mb-4 flex items-center justify-center">
                    <span className="text-amber-600">❝</span>
                  </div>
                  <p className="italic mb-4 text-stone-700">
                    "Leavn has transformed my sermon preparation process. The multiple theological lenses help me consider viewpoints I might have overlooked, and the contextual information is incredibly valuable."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      JM
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-slate-800">Pastor James Miller</p>
                      <p className="text-sm text-stone-500">Community Church</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md border border-amber-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 mb-4 flex items-center justify-center">
                    <span className="text-amber-600">❝</span>
                  </div>
                  <p className="italic mb-4 text-stone-700">
                    "The ability to instantly access different commentaries and perspectives saves me hours of research time, and the narrative mode helps bring passages to life for my congregation."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      SR
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-slate-800">Rev. Sarah Rodriguez</p>
                      <p className="text-sm text-stone-500">Hillside Fellowship</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="students">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md border border-amber-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 mb-4 flex items-center justify-center">
                    <span className="text-amber-600">❝</span>
                  </div>
                  <p className="italic mb-4 text-stone-700">
                    "As a theology student, the multiple perspectives feature is invaluable. I can quickly compare different theological traditions' interpretations of the same passage."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      DJ
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-slate-800">David Johnson</p>
                      <p className="text-sm text-stone-500">Seminary Student</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md border border-amber-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 mb-4 flex items-center justify-center">
                    <span className="text-amber-600">❝</span>
                  </div>
                  <p className="italic mb-4 text-stone-700">
                    "The 'Did You Know' facts and contextual questions help me understand cultural nuances I would have missed. It's like having a professor available 24/7."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      AT
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-slate-800">Amanda Torres</p>
                      <p className="text-sm text-stone-500">Religious Studies Major</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="families">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md border border-amber-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 mb-4 flex items-center justify-center">
                    <span className="text-amber-600">❝</span>
                  </div>
                  <p className="italic mb-4 text-stone-700">
                    "The kids' translation makes family devotions so much more engaging. Our children actually look forward to Bible time now!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      WF
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-slate-800">Wilson Family</p>
                      <p className="text-sm text-stone-500">Parents of three</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md border border-amber-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 mb-4 flex items-center justify-center">
                    <span className="text-amber-600">❝</span>
                  </div>
                  <p className="italic mb-4 text-stone-700">
                    "We use the reading plans to keep our family consistent with Bible study. The narrative mode helps our teenagers connect with stories in a fresh way."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      LP
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-slate-800">Liu-Parker Family</p>
                      <p className="text-sm text-stone-500">Home church group</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 px-4 md:px-0 bg-gradient-to-b from-emerald-600 to-green-700 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-lg rotate-12"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-amber-300/10 rounded-full"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm font-semibold mb-6">
            Ready to get started?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Begin Your Journey of Deeper Understanding
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of others discovering new dimensions of Scripture through Leavn's
            innovative study tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate('/reader')} className="bg-white text-emerald-700 hover:bg-emerald-50 border-0 rounded-lg shadow-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Open Bible Reader
              </Button>
            ) : (
              <Button size="lg" onClick={() => login()} className="bg-white text-emerald-700 hover:bg-emerald-50 border-0 rounded-lg shadow-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            )}
            
            <Button size="lg" variant="outline" onClick={() => navigate('/reading-plans')} className="border-white/50 text-white hover:bg-white/10 rounded-lg">
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