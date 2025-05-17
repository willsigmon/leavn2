import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { FaBookOpen, FaBible, FaLightbulb, FaUserFriends, FaQuestionCircle, FaCommentAlt, FaChartBar, FaLock } from "react-icons/fa";
import { CheckCircle } from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto bg-background">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 md:py-28">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background to-accent/10 z-0"></div>
            {/* Decorative grid pattern */}
            <div className="absolute inset-0 opacity-5 z-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-px w-full bg-primary/20" style={{ top: `${i * 10}%` }}></div>
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="w-px h-full bg-primary/20" style={{ left: `${i * 10}%` }}></div>
              ))}
            </div>
            
            <div className="container mx-auto px-4 max-w-6xl relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 text-center md:text-left">
                  <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Bible study made</span>
                    <br />
                    <span className="text-foreground">simple.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl md:max-w-none mb-8">
                    Experience a richer Bible study with AI-powered multi-lens commentary, personal notes, 
                    and contextual information. <span className="font-medium text-primary">An account is required</span> to 
                    access all Bible study features.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Link href="/api/login">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <FaBookOpen className="mr-2" /> Sign In to Read
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="border-primary border text-primary hover:bg-primary/5">
                      View Demo
                    </Button>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 mt-8">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                      <span>Private account</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                      <span>Secure storage</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                      <span>Privacy focused</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                      <span>Instant insights</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-destructive/70"></div>
                        <div className="h-3 w-3 rounded-full bg-accent/70"></div>
                        <div className="h-3 w-3 rounded-full bg-primary/70"></div>
                        <div className="ml-2 text-sm font-medium text-primary">John 3:16</div>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-foreground mb-2">
                        "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."
                      </p>
                      <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-border">
                        <h4 className="text-sm font-semibold text-primary mb-1">Choose a Lens:</h4>
                        <div className="flex flex-wrap gap-2">
                          <div className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full">Catholic</div>
                          <div className="px-3 py-1 bg-background border border-border text-xs rounded-full">Evangelical</div>
                          <div className="px-3 py-1 bg-background border border-border text-xs rounded-full">Jewish</div>
                          <div className="px-3 py-1 bg-background border border-border text-xs rounded-full">Gen-Z</div>
                          <div className="px-3 py-1 bg-background border border-border text-xs rounded-full">Kids</div>
                        </div>
                      </div>
                      <Button className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-accent/5">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                  Bible study designed for <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">deeper insights</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to explore Scripture with understanding and depth
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-primary/15 p-3 w-12 h-12 flex items-center justify-center mb-5">
                      <FaLightbulb className="text-primary text-xl" />
                    </div>
                    <h3 className="font-medium text-xl text-primary mb-3">Multi-lens Commentary</h3>
                    <p className="text-muted-foreground mb-4">
                      View any passage through Catholic, Evangelical, Jewish, Gen-Z, or Kids perspectives.
                    </p>
                    <div className="mt-2 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-primary">
                          <span>All lenses included</span>
                          <CheckCircle className="h-4 w-4 ml-2 text-primary/80" />
                        </div>
                        <div className="flex items-center text-sm text-primary/80">
                          <FaLock className="h-3 w-3 mr-1" />
                          <span>Account required</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-primary/15 p-3 w-12 h-12 flex items-center justify-center mb-5">
                      <FaCommentAlt className="text-primary text-xl" />
                    </div>
                    <h3 className="font-medium text-xl text-primary mb-3">Narrative Mode</h3>
                    <p className="text-muted-foreground mb-4">
                      Transform any chapter into immersive prose for a fresh perspective and deeper appreciation.
                    </p>
                    <div className="mt-2 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-primary">
                          <span>All books supported</span>
                          <CheckCircle className="h-4 w-4 ml-2 text-primary/80" />
                        </div>
                        <div className="flex items-center text-sm text-primary/80">
                          <FaLock className="h-3 w-3 mr-1" />
                          <span>Account required</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-primary/15 p-3 w-12 h-12 flex items-center justify-center mb-5">
                      <FaQuestionCircle className="text-primary text-xl" />
                    </div>
                    <h3 className="font-medium text-xl text-primary mb-3">"Did You Know" Facts</h3>
                    <p className="text-muted-foreground mb-4">
                      Discover fascinating historical, cultural, and theological insights about each passage.
                    </p>
                    <div className="mt-2 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-primary">
                          <span>Updated regularly</span>
                          <CheckCircle className="h-4 w-4 ml-2 text-primary/80" />
                        </div>
                        <div className="flex items-center text-sm text-primary/80">
                          <FaLock className="h-3 w-3 mr-1" />
                          <span>Account required</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/15 p-3 w-12 h-12 flex items-center justify-center">
                        <FaUserFriends className="text-primary text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-xl text-primary mb-2">AI Artwork</h3>
                        <p className="text-muted-foreground">
                          Experience stunning AI-generated artwork for each chapter that captures the essence of the text.
                        </p>
                        <div className="mt-3 flex items-center text-sm text-primary/80">
                          <FaLock className="h-3 w-3 mr-1" />
                          <span>Account required</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/15 p-3 w-12 h-12 flex items-center justify-center">
                        <FaChartBar className="text-primary text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-xl text-primary mb-2">Smart Search</h3>
                        <p className="text-muted-foreground">
                          Find verses by theme, people, places, or semantic meaning with advanced AI search capabilities.
                        </p>
                        <div className="mt-3 flex items-center text-sm text-primary/80">
                          <FaLock className="h-3 w-3 mr-1" />
                          <span>Account required</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10">
            <div className="container mx-auto px-4 max-w-6xl text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">
                Ready to explore Scripture more deeply?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Create your free account to start your journey with Leavn and experience 
                the Bible in a whole new way. All features require an account.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/api/login">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <FaBookOpen className="mr-2" /> Create Your Account
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                  Learn More
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
                <div className="flex flex-col items-center md:items-start">
                  <div className="p-3 rounded-full bg-accent/20 text-primary mb-3">
                    <FaLock className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Secure Account</h3>
                  <p className="text-sm text-muted-foreground text-center md:text-left">
                    Your notes and preferences are securely stored in your personal account.
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="p-3 rounded-full bg-accent/20 text-primary mb-3">
                    <FaUserFriends className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Personalized Study</h3>
                  <p className="text-sm text-muted-foreground text-center md:text-left">
                    Track your progress and receive tailored insights based on your interests.
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="p-3 rounded-full bg-accent/20 text-primary mb-3">
                    <FaChartBar className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Advanced Features</h3>
                  <p className="text-sm text-muted-foreground text-center md:text-left">
                    Access premium tools like AI artwork and cross-reference capabilities.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Animated CTA Section */}
          <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
            {/* Animated dots background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '30px 30px' 
              }}></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -right-8 top-10 w-24 h-24 rounded-lg bg-accent opacity-40 animate-float"></div>
            <div className="absolute left-16 bottom-10 w-16 h-16 rounded-lg bg-primary-foreground opacity-30 animate-float-delayed"></div>
            <div className="absolute right-1/4 top-1/3 w-10 h-10 rounded-full bg-accent opacity-20 animate-float"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-primary-foreground">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
                    Ready to gather spiritual insights?
                  </h2>
                  <p className="text-lg text-primary-foreground/90 mb-8">
                    Start using Leavn Bible Study today and transform your Scripture experience.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="rounded-full bg-accent p-1 mr-3">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-primary-foreground/90">Free for personal Bible study</span>
                    </div>
                    <div className="flex items-center">
                      <div className="rounded-full bg-accent p-1 mr-3">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-primary-foreground/90">No account required to preview</span>
                    </div>
                    <div className="flex items-center">
                      <div className="rounded-full bg-accent p-1 mr-3">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-primary-foreground/90">Premium features for deeper study</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link href="/api/login">
                      <Button size="lg" className="bg-card text-primary hover:bg-card/90">
                        Create Account
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="border-card text-card hover:bg-primary-foreground/10">
                      View Example
                    </Button>
                  </div>
                </div>
                
                <div className="bg-primary-foreground/10 backdrop-blur-sm p-6 rounded-xl border border-primary-foreground/20">
                  <div className="bg-card p-4 rounded-lg shadow-lg">
                    <h3 className="font-medium text-foreground mb-3">Who uses Leavn Bible Study?</h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded mr-3 accent-primary" />
                        <span className="text-muted-foreground">Sunday School Teachers</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded mr-3 accent-primary" />
                        <span className="text-muted-foreground">Bible Study Groups</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded mr-3 accent-primary" />
                        <span className="text-muted-foreground">Personal Study</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded mr-3 accent-primary" />
                        <span className="text-muted-foreground">Pastors & Ministers</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-border">
                      <h4 className="text-sm font-medium text-foreground mb-2">I want to study:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="radio" name="studyType" defaultChecked className="w-4 h-4 mr-3 accent-primary" />
                          <span className="text-muted-foreground">New Testament</span>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" name="studyType" className="w-4 h-4 mr-3 accent-primary" />
                          <span className="text-muted-foreground">Old Testament</span>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" name="studyType" className="w-4 h-4 mr-3 accent-primary" />
                          <span className="text-muted-foreground">Both</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Footer */}
          <footer className="bg-card border-t border-border py-12">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-medium text-lg text-primary mb-4">Leavn Bible Study</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    An advanced Bible study platform designed to transform how you engage with Scripture.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-primary hover:text-primary/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-primary hover:text-primary/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-primary hover:text-primary/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary mb-4">Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Bible Translations</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Study Guides</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Commentary</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Audio Bible</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary mb-4">Community</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Online Groups</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Bible Q&A</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Study Partners</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Discussions</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Cookie Policy</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">Copyright</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                  © {new Date().getFullYear()} Leavn Bible Study. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary">Help</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary">Support</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
