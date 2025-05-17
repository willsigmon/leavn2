import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  BookOpen, 
  Book, 
  Headphones, 
  BookText, 
  MessageSquare, 
  ChevronRight, 
  GraduationCap,
  Search,
  BarChart3
} from 'lucide-react';

export default function ResourcesIndex() {
  const resourceCategories = [
    {
      id: 'bible-translations',
      title: 'Bible Translations',
      description: 'Access multiple translations of the Bible, including KJV and WEB, with side-by-side comparison features.',
      icon: <BookOpen className="h-12 w-12 text-emerald-600" />,
      link: '/resources/bible-translations',
      popular: true
    },
    {
      id: 'study-guides',
      title: 'Study Guides',
      description: 'Structured guides for individual or group study, covering books of the Bible, theological topics, and more.',
      icon: <GraduationCap className="h-12 w-12 text-emerald-600" />,
      link: '/resources/study-guides',
      popular: true
    },
    {
      id: 'commentary',
      title: 'Commentary',
      description: 'Explore Scripture through multiple theological lenses, including Evangelical, Catholic, Jewish, and contemporary perspectives.',
      icon: <MessageSquare className="h-12 w-12 text-emerald-600" />,
      link: '/resources/commentary',
      popular: true
    },
    {
      id: 'audio-bible',
      title: 'Audio Bible',
      description: 'Listen to professionally narrated Scripture for an immersive audio experience.',
      icon: <Headphones className="h-12 w-12 text-emerald-600" />,
      link: '/resources/audio-bible',
      popular: false
    },
    {
      id: 'reading-plans',
      title: 'Reading Plans',
      description: 'Guided pathways through Scripture with themed readings for consistent Bible engagement.',
      icon: <Book className="h-12 w-12 text-emerald-600" />,
      link: '/resources/reading-plans',
      popular: false
    },
    {
      id: 'dictionaries',
      title: 'Biblical Dictionaries',
      description: 'Comprehensive references for biblical terms, places, people, and concepts.',
      icon: <BookText className="h-12 w-12 text-emerald-600" />,
      link: '/resources/dictionaries',
      popular: false
    },
    {
      id: 'search-tools',
      title: 'Advanced Search',
      description: 'Powerful search capabilities including semantic search, cross-reference lookup, and thematic exploration.',
      icon: <Search className="h-12 w-12 text-emerald-600" />,
      link: '/resources/search-tools',
      popular: false
    },
    {
      id: 'visualizations',
      title: 'Biblical Visualizations',
      description: 'Maps, timelines, and visual aids to enhance understanding of biblical geography, history, and narratives.',
      icon: <BarChart3 className="h-12 w-12 text-emerald-600" />,
      link: '/resources/visualizations',
      popular: false
    }
  ];

  const featuredResources = resourceCategories.filter(resource => resource.popular);
  const additionalResources = resourceCategories.filter(resource => !resource.popular);

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <PageHeader
        title="Study Resources"
        description="Comprehensive tools and materials to deepen your understanding of Scripture"
      />

      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Resources</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {featuredResources.map(resource => (
            <Card key={resource.id} className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="mb-4">{resource.icon}</div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <CardDescription className="text-base">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-0">
                <Link href={resource.link}>
                  <Button className="w-full gap-1">
                    Explore {resource.title} <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Additional Resources</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {additionalResources.map(resource => (
            <Card key={resource.id} className="flex overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center px-4 bg-muted">
                {resource.icon}
              </div>
              <div className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle>{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm">{resource.description}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href={resource.link}>
                    <Button variant="outline" size="sm" className="gap-1">
                      Explore <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="prose prose-emerald max-w-none">
        <h2>How to Make the Most of Leavn Resources</h2>
        <p>
          Our comprehensive collection of Bible study resources is designed to provide depth and clarity as you explore Scripture. Here are some tips for making the most of these tools:
        </p>
        
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="bg-muted rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">For Beginners</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Start with the <strong>Bible Translations</strong> section to find a translation that resonates with you</li>
              <li>Use <strong>Study Guides</strong> for structured introductions to key books and concepts</li>
              <li>Try <strong>Audio Bible</strong> to listen to Scripture while on the go</li>
              <li>Explore the <strong>Commentary</strong> feature to gain multiple perspectives</li>
            </ol>
          </div>
          
          <div className="bg-muted rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">For Advanced Study</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Utilize <strong>Advanced Search</strong> to explore themes and connections across Scripture</li>
              <li>Combine <strong>Commentary</strong> perspectives to gain a more comprehensive understanding</li>
              <li>Reference <strong>Biblical Dictionaries</strong> for deeper insight into terms and cultural context</li>
              <li>Use <strong>Biblical Visualizations</strong> to understand historical and geographical context</li>
            </ol>
          </div>
        </div>
        
        <div className="my-8 p-6 border rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
          <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-4">Personalized Study Recommendations</h3>
          <p className="mb-4">
            Looking for customized resources based on your interests and study goals? Our AI-powered recommendation system can help you find the perfect materials.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="gap-2">
              Get Personalized Recommendations <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}