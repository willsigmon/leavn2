import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Search, BookMarked, Sparkles, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function Commentary() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const commentaryTypes = [
    {
      id: 'evangelical',
      name: 'Evangelical Commentary',
      description: 'Insights from the evangelical Christian perspective focusing on scripture as the inspired word of God.',
      features: [
        'Verse-by-verse exposition from an evangelical standpoint',
        'Focus on personal application and relevance',
        'Emphasis on the gospel message and salvation through Christ',
        'Historical and cultural context from evangelical scholars'
      ],
      icon: <BookMarked className="h-8 w-8 text-emerald-600" />,
      lens: 'Evangelical'
    },
    {
      id: 'catholic',
      name: 'Catholic Commentary',
      description: 'Interpretations based on Catholic theology and tradition including Church fathers and papal teachings.',
      features: [
        'Integration of Scripture with Sacred Tradition',
        'Insights from Church Fathers and Saints',
        'Connection to Catholic doctrine and practice',
        'Analysis from historical Catholic theological traditions'
      ],
      icon: <BookMarked className="h-8 w-8 text-emerald-600" />,
      lens: 'Catholic'
    },
    {
      id: 'jewish',
      name: 'Jewish Commentary',
      description: 'Traditional Jewish interpretations drawing on rabbinic writings, midrash, and the Talmud.',
      features: [
        'Insights from rabbinic commentaries like Rashi and Maimonides',
        'Talmudic and midrashic interpretations of passages',
        'Hebrew language insights and cultural context',
        'Connection to Jewish law, customs, and traditions'
      ],
      icon: <BookMarked className="h-8 w-8 text-emerald-600" />,
      lens: 'Jewish'
    },
    {
      id: 'scholarly',
      name: 'Scholarly Commentary',
      description: 'Academic analysis focused on historical context, linguistics, and archeology from a scholarly perspective.',
      features: [
        'In-depth textual and linguistic analysis',
        'Historical-critical methodology',
        'Archaeological and historical context',
        'Current academic research and perspectives'
      ],
      icon: <BookMarked className="h-8 w-8 text-emerald-600" />,
      lens: 'Scholarly'
    },
    {
      id: 'devotional',
      name: 'Devotional Commentary',
      description: 'Personal and devotional reflections aimed at spiritual growth and daily application.',
      features: [
        'Practical life applications for spiritual growth',
        'Personal reflection questions for meditation',
        'Devotional insights for daily life',
        'Prayer suggestions related to the passage'
      ],
      icon: <BookMarked className="h-8 w-8 text-emerald-600" />,
      lens: 'Devotional'
    },
    {
      id: 'genz',
      name: 'GenZ Commentary',
      description: 'Scripture explained in contemporary language that resonates with younger generations.',
      features: [
        'Scripture explained in contemporary language',
        'Real-world applications for today\'s young adults',
        'Cultural relevance to modern issues and challenges',
        'Social media and digital-friendly format'
      ],
      icon: <BookMarked className="h-8 w-8 text-emerald-600" />,
      lens: 'GenZ'
    },
    {
      id: 'kids',
      name: 'Kids Commentary',
      description: 'Simplified explanations tailored for children with age-appropriate language and concepts.',
      features: [
        'Age-appropriate explanations',
        'Story-based approach to Scripture',
        'Colorful visuals and interactive elements',
        'Character lessons and moral applications'
      ],
      icon: <BookMarked className="h-8 w-8 text-emerald-600" />,
      lens: 'Kids'
    }
  ];

  const filteredCommentaries = commentaryTypes.filter(
    commentary => commentary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 commentary.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPassages = [
    { 
      reference: 'John 3:16',
      text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      commentaries: ['evangelical', 'catholic', 'devotional', 'genz']
    },
    { 
      reference: 'Psalm 23:1',
      text: 'The LORD is my shepherd, I lack nothing.',
      commentaries: ['jewish', 'devotional', 'kids', 'scholarly']
    },
    { 
      reference: 'Romans 8:28',
      text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      commentaries: ['evangelical', 'scholarly', 'devotional', 'genz']
    },
    { 
      reference: 'Genesis 1:1',
      text: 'In the beginning God created the heavens and the earth.',
      commentaries: ['jewish', 'scholarly', 'catholic', 'kids']
    }
  ];

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <PageHeader
        title="Theological Commentary"
        description="Explore scripture through multiple theological lenses"
        breadcrumbs={[
          { label: 'Resources', href: '/resources' },
          { label: 'Commentary' }
        ]}
      />

      <div className="flex flex-col gap-6 md:flex-row mb-10">
        <div className="md:w-2/3">
          <p className="text-lg">
            Leavn provides theological commentary on Bible passages through multiple lenses, 
            offering diverse perspectives to enrich your understanding of scripture.
          </p>
          <p className="mt-4">
            Whether you're looking for evangelical insights, Catholic tradition, Jewish wisdom, 
            scholarly analysis, devotional reflections, or contemporary interpretations for 
            different age groups, our AI-powered commentary system has you covered.
          </p>
        </div>
        <div className="md:w-1/3 bg-muted rounded-lg p-4 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Commentary Features</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>AI-generated based on theological traditions</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              <span>Multiple perspectives on the same passage</span>
            </li>
            <li className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span>Available for every verse in scripture</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search commentary types..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by tradition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Traditions</SelectItem>
            <SelectItem value="christian">Christian</SelectItem>
            <SelectItem value="jewish">Jewish</SelectItem>
            <SelectItem value="audience">By Audience</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {filteredCommentaries.map(commentary => (
          <Card key={commentary.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{commentary.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {commentary.description}
                  </CardDescription>
                </div>
                <div className="ml-4">
                  {commentary.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {commentary.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <svg
                        className="h-2 w-2 fill-emerald-600"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View {commentary.lens} Commentary
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="featured" className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Example Passages</h2>
          <TabsList>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="old-testament">Old Testament</TabsTrigger>
            <TabsTrigger value="new-testament">New Testament</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="featured">
          <div className="space-y-6">
            {featuredPassages.map((passage, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{passage.reference}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <blockquote className="border-l-4 border-emerald-600 pl-4 italic mb-4">
                    "{passage.text}"
                  </blockquote>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {passage.commentaries.map(commentary => {
                      const foundCommentary = commentaryTypes.find(c => c.id === commentary);
                      return (
                        <Badge key={commentary} variant="outline" className="bg-muted">
                          {foundCommentary?.lens} Lens
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="link" className="ml-auto">
                    View all commentaries
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="old-testament">
          <div className="flex items-center justify-center h-64 border rounded-md border-dashed">
            <p className="text-muted-foreground">Old Testament examples coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="new-testament">
          <div className="flex items-center justify-center h-64 border rounded-md border-dashed">
            <p className="text-muted-foreground">New Testament examples coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="prose prose-emerald max-w-none">
        <h2>Understanding Multiple Perspectives</h2>
        <p>
          Studying scripture through different theological lenses can deepen your understanding and appreciation
          of the Bible. Each tradition brings unique insights based on its history, values, and interpretive methods.
        </p>
        
        <h3>Why Multiple Perspectives Matter</h3>
        <p>
          The Bible has been studied and interpreted for thousands of years across diverse cultures and traditions.
          Engaging with multiple perspectives:
        </p>
        
        <ul>
          <li>Reveals nuances you might otherwise miss</li>
          <li>Challenges assumptions and prevents narrow interpretations</li>
          <li>Builds appreciation for the richness of theological tradition</li>
          <li>Helps bridge understanding between different faith communities</li>
        </ul>
        
        <div className="bg-muted rounded-lg p-4 my-6">
          <h4 className="text-lg font-semibold mb-2">Recommended Commentary Resources</h4>
          <ul className="space-y-1">
            <li className="flex items-center">
              <a href="https://www.logos.com/product/195377/anchor-yale-bible" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                Anchor Yale Bible Commentary <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Scholarly perspective</span>
            </li>
            <li className="flex items-center">
              <a href="https://www.sefaria.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                Sefaria <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Jewish commentary and sources</span>
            </li>
            <li className="flex items-center">
              <a href="https://www.newadvent.org/fathers/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                Church Fathers <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Early Christian commentary</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}