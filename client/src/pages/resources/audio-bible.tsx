import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  PlayCircle, 
  Music, 
  Headphones, 
  User, 
  Clock, 
  Download, 
  PauseCircle,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Search,
  ExternalLink
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function AudioBible() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const togglePlay = () => {
    setPlaying(!playing);
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  const audioBooks = [
    { id: 'genesis', name: 'Genesis', chapters: 50, duration: '3h 23m', available: true, testament: 'old' },
    { id: 'exodus', name: 'Exodus', chapters: 40, duration: '2h 51m', available: true, testament: 'old' },
    { id: 'psalms', name: 'Psalms', chapters: 150, duration: '4h 32m', available: true, testament: 'old' },
    { id: 'proverbs', name: 'Proverbs', chapters: 31, duration: '1h 45m', available: true, testament: 'old' },
    { id: 'isaiah', name: 'Isaiah', chapters: 66, duration: '3h 17m', available: false, testament: 'old' },
    { id: 'matthew', name: 'Matthew', chapters: 28, duration: '2h 12m', available: true, testament: 'new' },
    { id: 'mark', name: 'Mark', chapters: 16, duration: '1h 23m', available: true, testament: 'new' },
    { id: 'luke', name: 'Luke', chapters: 24, duration: '2h 27m', available: true, testament: 'new' },
    { id: 'john', name: 'John', chapters: 21, duration: '1h 54m', available: true, testament: 'new' },
    { id: 'romans', name: 'Romans', chapters: 16, duration: '1h 10m', available: true, testament: 'new' },
    { id: 'revelation', name: 'Revelation', chapters: 22, duration: '1h 28m', available: false, testament: 'new' }
  ];

  const narrators = [
    { id: 'james-earl-jones', name: 'James Earl Jones', version: 'KJV', known_for: 'Rich, resonant voice with gravitas' },
    { id: 'max-mclean', name: 'Max McLean', version: 'ESV', known_for: 'Clear, dramatic interpretation' },
    { id: 'david-suchet', name: 'David Suchet', version: 'NIV', known_for: 'Precise, articulate British accent' },
    { id: 'johnny-cash', name: 'Johnny Cash', version: 'KJV', known_for: 'Warm, authentic American voice' },
  ];
  
  const featuredPassages = [
    { reference: 'Psalm 23', duration: '1:13', testament: 'old', available: true },
    { reference: 'John 3:1-21', duration: '2:47', testament: 'new', available: true },
    { reference: 'Genesis 1:1-31', duration: '3:32', testament: 'old', available: true },
    { reference: 'Romans 8:18-39', duration: '2:56', testament: 'new', available: true },
    { reference: '1 Corinthians 13', duration: '1:34', testament: 'new', available: true },
    { reference: 'Isaiah 40:1-31', duration: '3:20', testament: 'old', available: false }
  ];
  
  const filteredBooks = audioBooks.filter(
    book => book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <PageHeader
        title="Audio Bible"
        description="Listen to Scripture professionally narrated"
        breadcrumbs={[
          { label: 'Resources', href: '/resources' },
          { label: 'Audio Bible' }
        ]}
      />

      <div className="flex flex-col gap-6 md:flex-row mb-10">
        <div className="md:w-2/3">
          <p className="text-lg">
            Our Audio Bible provides professionally narrated Scripture readings to enhance your
            study and meditation. Listen while commuting, exercising, or during quiet reflection.
          </p>
          <p className="mt-4">
            Available in King James Version (KJV) and World English Bible (WEB), our audio 
            recordings offer clear, engaging narration with adjustable playback speeds and bookmarking.
          </p>
        </div>
        <div className="md:w-1/3 bg-muted rounded-lg p-4 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Audio Features</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-emerald-600" />
              <span>Professional narration</span>
            </li>
            <li className="flex items-center gap-2">
              <Music className="h-4 w-4 text-emerald-600" />
              <span>Optional background music</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span>Variable playback speed</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Featured Audio Player */}
      <Card className="mb-10 overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/20">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 pb-3">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Now Playing</CardTitle>
              <CardDescription className="text-base">Psalm 23 • King James Version</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="kjv">
                <SelectTrigger className="w-[110px] h-8">
                  <SelectValue placeholder="Version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kjv">KJV</SelectItem>
                  <SelectItem value="web">WEB</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="default">
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Narrator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="james-earl-jones">James Earl Jones</SelectItem>
                  <SelectItem value="max-mclean">Max McLean</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3 pt-5">
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Slider 
                defaultValue={[20]} 
                max={100}
                step={1}
                value={[currentTime]}
                onValueChange={(value) => setCurrentTime(value[0])}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0:24</span>
                <span>1:13</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  {muted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </Button>
                <Slider 
                  defaultValue={[80]} 
                  max={100} 
                  step={1}
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  className="w-24 cursor-pointer" 
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={togglePlay}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  {playing ? (
                    <PauseCircle className="h-12 w-12 text-emerald-600" />
                  ) : (
                    <PlayCircle className="h-12 w-12 text-emerald-600" />
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Select defaultValue="1x">
                  <SelectTrigger className="w-[75px] h-8">
                    <SelectValue placeholder="Speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.75x">0.75x</SelectItem>
                    <SelectItem value="1x">1x</SelectItem>
                    <SelectItem value="1.25x">1.25x</SelectItem>
                    <SelectItem value="1.5x">1.5x</SelectItem>
                    <SelectItem value="2x">2x</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <TabsList>
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="old-testament">Old Testament</TabsTrigger>
            <TabsTrigger value="new-testament">New Testament</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map(book => (
              <Card key={book.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{book.name}</CardTitle>
                    {book.available ? (
                      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Available</Badge>
                    ) : (
                      <Badge variant="outline">Coming Soon</Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1.5">
                    <span>Chapters: {book.chapters}</span>
                    <span>•</span>
                    <span>Duration: {book.duration}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>Default Narrator</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full gap-1" 
                    disabled={!book.available}
                  >
                    <PlayCircle className="h-4 w-4" />
                    {book.available ? "Listen Now" : "Coming Soon"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="old-testament">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks
              .filter(book => book.testament === 'old')
              .map(book => (
                <Card key={book.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{book.name}</CardTitle>
                      {book.available ? (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Available</Badge>
                      ) : (
                        <Badge variant="outline">Coming Soon</Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1.5">
                      <span>Chapters: {book.chapters}</span>
                      <span>•</span>
                      <span>Duration: {book.duration}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2">
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>Default Narrator</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full gap-1" 
                      disabled={!book.available}
                    >
                      <PlayCircle className="h-4 w-4" />
                      {book.available ? "Listen Now" : "Coming Soon"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new-testament">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks
              .filter(book => book.testament === 'new')
              .map(book => (
                <Card key={book.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{book.name}</CardTitle>
                      {book.available ? (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Available</Badge>
                      ) : (
                        <Badge variant="outline">Coming Soon</Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1.5">
                      <span>Chapters: {book.chapters}</span>
                      <span>•</span>
                      <span>Duration: {book.duration}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2">
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>Default Narrator</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full gap-1" 
                      disabled={!book.available}
                    >
                      <PlayCircle className="h-4 w-4" />
                      {book.available ? "Listen Now" : "Coming Soon"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredPassages.map((passage, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{passage.reference}</CardTitle>
                    {passage.available ? (
                      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Available</Badge>
                    ) : (
                      <Badge variant="outline">Coming Soon</Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1.5">
                    <span>Duration: {passage.duration}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>James Earl Jones</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full gap-1" 
                    disabled={!passage.available}
                  >
                    <PlayCircle className="h-4 w-4" />
                    {passage.available ? "Listen Now" : "Coming Soon"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Narrators</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {narrators.map(narrator => (
            <Card key={narrator.id} className="flex overflow-hidden">
              <div className="bg-emerald-100 dark:bg-emerald-900/20 p-4 flex items-center justify-center">
                <User className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{narrator.name}</CardTitle>
                  <CardDescription>{narrator.version} Bible</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm">{narrator.known_for}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Browse Narrations
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="prose prose-emerald max-w-none">
        <h2>Benefits of Audio Bible Study</h2>
        <p>
          Listening to Scripture provides unique benefits that complement traditional reading:
        </p>
        
        <ul>
          <li>
            <strong>Accessibility</strong>: Makes Scripture available to those with visual impairments or reading difficulties
          </li>
          <li>
            <strong>Multitasking</strong>: Engage with Scripture while commuting, exercising, or doing household tasks
          </li>
          <li>
            <strong>Auditory Learning</strong>: Benefits those who learn better through listening than reading
          </li>
          <li>
            <strong>Emotional Resonance</strong>: Professional narration captures nuances that might be missed when reading
          </li>
          <li>
            <strong>Ancient Tradition</strong>: Connects with the oral tradition through which Scripture was originally shared
          </li>
        </ul>
        
        <div className="bg-muted rounded-lg p-4 my-6">
          <h4 className="text-lg font-semibold mb-2">Additional Audio Resources</h4>
          <ul className="space-y-1">
            <li className="flex items-center">
              <a href="https://www.biblegateway.com/resources/audio/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                Bible Gateway Audio Bibles <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Multiple translations and narrators</span>
            </li>
            <li className="flex items-center">
              <a href="https://www.faithcomesbyhearing.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                Faith Comes By Hearing <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Audio Bibles in over 1,500 languages</span>
            </li>
            <li className="flex items-center">
              <a href="https://www.youtube.com/c/TheBibleProject" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                The Bible Project <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Animated explainers with narration</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}