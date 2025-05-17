import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { FaBookOpen, FaBible, FaLightbulb, FaUserFriends } from "react-icons/fa";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-10 max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-dark mb-4">Welcome to Leavn</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Study the Bible with AI-powered multi-lens commentary, notes, and contextual information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="overflow-hidden shadow-md border-gray-200 hover:shadow-lg transition-shadow">
                <div className="h-48 bg-[url('https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80')] bg-center bg-cover"></div>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold text-primary-dark mb-2">Start Reading</h2>
                  <p className="text-gray-600 mb-4">
                    Continue your Bible study journey or discover new passages with our easy-to-use interface.
                  </p>
                  <Link href="/bible/proverbs/3">
                    <Button className="bg-primary-dark hover:bg-primary text-white">
                      <FaBookOpen className="mr-2" /> Open Bible
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="overflow-hidden shadow-md border-gray-200 hover:shadow-lg transition-shadow">
                <div className="h-48 bg-[url('https://images.unsplash.com/photo-1507692812060-98338d07aca3?auto=format&fit=crop&q=80')] bg-center bg-cover"></div>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold text-primary-dark mb-2">Reading Plans</h2>
                  <p className="text-gray-600 mb-4">
                    Follow structured reading plans to help you stay consistent in your Bible study habit.
                  </p>
                  <Link href="/bible/proverbs/3">
                    <Button className="bg-primary-dark hover:bg-primary text-white">
                      <FaBible className="mr-2" /> View Plans
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
              <h2 className="font-serif text-2xl font-bold text-primary-dark mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-secondary-light p-3 rounded-lg">
                    <FaLightbulb className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-primary-dark mb-1">Multi-lens Commentary</h3>
                    <p className="text-gray-600">View passages through Catholic, Evangelical, Jewish, Gen-Z, or Kids perspectives</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-secondary-light p-3 rounded-lg">
                    <FaUserFriends className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-primary-dark mb-1">Context & Insights</h3>
                    <p className="text-gray-600">Discover author information, historical context, and "Did you know?" facts</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-secondary-light p-3 rounded-lg">
                    <i className="fas fa-highlighter text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-primary-dark mb-1">Notes & Highlights</h3>
                    <p className="text-gray-600">Create personal notes and highlight important verses for future reference</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-secondary-light p-3 rounded-lg">
                    <i className="fas fa-search text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-primary-dark mb-1">Smart Search</h3>
                    <p className="text-gray-600">Find verses by theme, people, places, or semantic meaning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
