import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, CalendarDays, Users, Search, Download, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function StudyGuides() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const studyGuides = [
    {
      id: 'beginner-bible',
      title: 'Beginner\'s Guide to the Bible',
      description: 'An introductory study guide for those new to Bible study, covering the basics of scripture and interpretation.',
      duration: '4 weeks',
      level: 'Beginner',
      format: 'Daily readings with reflection questions',
      topics: ['Bible Basics', 'Key Stories', 'Main Characters', 'Core Concepts'],
      popular: true,
      image: 'beginner.jpg',
      category: 'overview'
    },
    {
      id: 'life-of-jesus',
      title: 'The Life and Ministry of Jesus',
      description: 'A comprehensive study of Jesus\'s life, teachings, miracles, and significance as recorded in the four Gospels.',
      duration: '8 weeks',
      level: 'Intermediate',
      format: 'Daily readings with commentary',
      topics: ['Birth & Early Life', 'Teachings & Parables', 'Miracles', 'Passion Week'],
      popular: true,
      image: 'jesus.jpg',
      category: 'new-testament'
    },
    {
      id: 'pauls-letters',
      title: 'Paul\'s Letters: Context and Content',
      description: 'An in-depth examination of Paul\'s epistles, exploring their historical context, theological themes, and practical applications.',
      duration: '10 weeks',
      level: 'Advanced',
      format: 'Weekly lessons with discussion questions',
      topics: ['Romans', 'Corinthians', 'Galatians', 'Prison Epistles', 'Pastoral Epistles'],
      popular: false,
      image: 'paul.jpg',
      category: 'new-testament'
    },
    {
      id: 'psalms-devotional',
      title: 'Psalms: A Devotional Journey',
      description: 'A devotional study through selected Psalms, exploring themes of praise, lament, thanksgiving, and wisdom.',
      duration: '6 weeks',
      level: 'All Levels',
      format: 'Daily devotionals with prayer prompts',
      topics: ['Psalms of Praise', 'Lament Psalms', 'Thanksgiving Psalms', 'Wisdom Psalms', 'Royal Psalms'],
      popular: true,
      image: 'psalms.jpg',
      category: 'old-testament'
    },
    {
      id: 'genesis-creation',
      title: 'Genesis: Creation and Covenant',
      description: 'An exploration of the book of Genesis, focusing on creation, fall, and the covenant promises to the patriarchs.',
      duration: '7 weeks',
      level: 'Intermediate',
      format: 'Weekly lessons with reflection questions',
      topics: ['Creation', 'The Fall', 'Noah', 'Abraham', 'Isaac', 'Jacob', 'Joseph'],
      popular: false,
      image: 'genesis.jpg',
      category: 'old-testament'
    },
    {
      id: 'sermon-mount',
      title: 'The Sermon on the Mount',
      description: 'A deep dive into Jesus\'s most famous sermon, examining its ethical teachings and practical implications for Christian living.',
      duration: '5 weeks',
      level: 'Intermediate',
      format: 'Daily readings with application exercises',
      topics: ['Beatitudes', 'Ethics', 'Prayer', 'Kingdom Principles', 'Discipleship'],
      popular: true,
      image: 'sermon.jpg',
      category: 'topical'
    },
    {
      id: 'spiritual-disciplines',
      title: 'Spiritual Disciplines in Scripture',
      description: 'A study of spiritual disciplines found throughout scripture, with practical guidance for incorporating them into daily life.',
      duration: '8 weeks',
      level: 'All Levels',
      format: 'Weekly practices with daily reflections',
      topics: ['Prayer', 'Fasting', 'Study', 'Meditation', 'Simplicity', 'Solitude', 'Service', 'Worship'],
      popular: false,
      image: 'disciplines.jpg',
      category: 'topical'
    },
    {
      id: 'revelation',
      title: 'Understanding Revelation',
      description: 'A balanced approach to the book of Revelation, focusing on its historical context, symbolism, and message of hope.',
      duration: '9 weeks',
      level: 'Advanced',
      format: 'Weekly in-depth study sessions',
      topics: ['Apocalyptic Literature', 'Letters to the Seven Churches', 'Heavenly Throne', 'Seals & Trumpets', 'Final Victory'],
      popular: false,
      image: 'revelation.jpg',
      category: 'new-testament'
    }
  ];

  const filteredGuides = studyGuides.filter(
    guide => guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             guide.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <PageHeader
        title="Bible Study Guides"
        description="Comprehensive resources to deepen your understanding of Scripture"
        breadcrumbs={[
          { label: 'Resources', href: '/resources' },
          { label: 'Study Guides' }
        ]}
      />

      <div className="flex flex-col gap-6 md:flex-row mb-10">
        <div className="md:w-2/3">
          <p className="text-lg">
            Our study guides provide structured pathways to explore Scripture, designed for 
            various experience levels and interests. Each guide includes readings, 
            commentary, questions for reflection, and practical application.
          </p>
          <p className="mt-4">
            Whether you're new to Bible study or looking for in-depth theological exploration, 
            our guides will help you engage more deeply with God's Word.
          </p>
        </div>
        <div className="md:w-1/3 bg-muted rounded-lg p-4 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Study Guide Features</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span>Structured daily or weekly format</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              <span>Individual or group study options</span>
            </li>
            <li className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span>Theological insights and context</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search study guides..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="book">Book Studies</SelectItem>
            <SelectItem value="topical">Topical Studies</SelectItem>
            <SelectItem value="devotional">Devotionals</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-levels">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-levels">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Guides</TabsTrigger>
          <TabsTrigger value="old-testament">Old Testament</TabsTrigger>
          <TabsTrigger value="new-testament">New Testament</TabsTrigger>
          <TabsTrigger value="topical">Topical</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.map(guide => (
              <Card key={guide.id} className="flex flex-col overflow-hidden h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {guide.level} • {guide.duration}
                      </CardDescription>
                    </div>
                    {guide.popular && (
                      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <p className="text-sm mb-4">{guide.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {guide.topics.slice(0, 3).map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="bg-muted/50">
                        {topic}
                      </Badge>
                    ))}
                    {guide.topics.length > 3 && (
                      <Badge variant="outline" className="bg-muted/50">
                        +{guide.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                    <CalendarDays className="h-4 w-4" />
                    <span>{guide.format}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 mt-auto">
                  <Button size="sm" className="w-full">
                    Start Study
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredGuides.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No study guides found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="old-testament">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuides
              .filter(guide => guide.category === 'old-testament')
              .map(guide => (
                <Card key={guide.id} className="flex flex-col overflow-hidden h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {guide.level} • {guide.duration}
                        </CardDescription>
                      </div>
                      {guide.popular && (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Popular</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 flex-1">
                    <p className="text-sm mb-4">{guide.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {guide.topics.slice(0, 3).map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="bg-muted/50">
                          {topic}
                        </Badge>
                      ))}
                      {guide.topics.length > 3 && (
                        <Badge variant="outline" className="bg-muted/50">
                          +{guide.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                      <CalendarDays className="h-4 w-4" />
                      <span>{guide.format}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 mt-auto">
                    <Button size="sm" className="w-full">
                      Start Study
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new-testament">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuides
              .filter(guide => guide.category === 'new-testament')
              .map(guide => (
                <Card key={guide.id} className="flex flex-col overflow-hidden h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {guide.level} • {guide.duration}
                        </CardDescription>
                      </div>
                      {guide.popular && (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Popular</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 flex-1">
                    <p className="text-sm mb-4">{guide.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {guide.topics.slice(0, 3).map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="bg-muted/50">
                          {topic}
                        </Badge>
                      ))}
                      {guide.topics.length > 3 && (
                        <Badge variant="outline" className="bg-muted/50">
                          +{guide.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                      <CalendarDays className="h-4 w-4" />
                      <span>{guide.format}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 mt-auto">
                    <Button size="sm" className="w-full">
                      Start Study
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="topical">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuides
              .filter(guide => guide.category === 'topical')
              .map(guide => (
                <Card key={guide.id} className="flex flex-col overflow-hidden h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {guide.level} • {guide.duration}
                        </CardDescription>
                      </div>
                      {guide.popular && (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Popular</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 flex-1">
                    <p className="text-sm mb-4">{guide.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {guide.topics.slice(0, 3).map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="bg-muted/50">
                          {topic}
                        </Badge>
                      ))}
                      {guide.topics.length > 3 && (
                        <Badge variant="outline" className="bg-muted/50">
                          +{guide.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                      <CalendarDays className="h-4 w-4" />
                      <span>{guide.format}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 mt-auto">
                    <Button size="sm" className="w-full">
                      Start Study
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="prose prose-emerald max-w-none">
        <h2>Creating an Effective Bible Study Plan</h2>
        <p>
          A structured approach to Bible study can help you gain deeper insights and maintain consistency.
          Here are some tips for creating your own study plan:
        </p>
        
        <ol>
          <li>
            <strong>Set Clear Goals</strong>: Define what you want to learn or understand (a book, theme, character, etc.)
          </li>
          <li>
            <strong>Establish a Regular Schedule</strong>: Consistency is key to deeper understanding
          </li>
          <li>
            <strong>Choose Appropriate Resources</strong>: Select commentaries, study guides, and reference materials
          </li>
          <li>
            <strong>Include Various Methods</strong>: Mix reading, reflection, prayer, and application
          </li>
          <li>
            <strong>Join or Form a Group</strong>: Community study enhances understanding through shared insights
          </li>
        </ol>
        
        <div className="bg-muted rounded-lg p-4 my-6">
          <h4 className="text-lg font-semibold mb-2">Additional Study Resources</h4>
          <ul className="space-y-1">
            <li className="flex items-center">
              <a href="https://www.biblicaltraining.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                Biblical Training <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Free seminary-level courses</span>
            </li>
            <li className="flex items-center">
              <a href="https://www.biblestudytools.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                Bible Study Tools <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Various study aids and resources</span>
            </li>
            <li className="flex items-center">
              <a href="https://www.stepbible.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                STEP Bible <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Free Scripture tools for every person</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}