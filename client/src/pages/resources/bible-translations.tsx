import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Globe, Download, History, ExternalLink } from 'lucide-react';

export default function BibleTranslations() {
  const translations = [
    {
      id: 'kjv',
      name: 'King James Version (KJV)',
      year: '1611',
      description: 'The classic English translation commissioned by King James I of England, known for its majestic style and literary influence.',
      style: 'Traditional, formal equivalence',
      copyright: 'Public Domain',
      languages: ['English'],
      languages_count: 1,
      available: true
    },
    {
      id: 'web',
      name: 'World English Bible (WEB)',
      year: '2000',
      description: 'A modern English update to the American Standard Version, designed to be readable while remaining faithful to the original texts.',
      style: 'Modern, formal equivalence',
      copyright: 'Public Domain',
      languages: ['English'],
      languages_count: 1,
      available: true
    },
    {
      id: 'niv',
      name: 'New International Version (NIV)',
      year: '1978 (revised 2011)',
      description: 'One of the most popular modern English translations, balancing accuracy with readability.',
      style: 'Modern, dynamic equivalence',
      copyright: 'Biblica',
      languages: ['English', 'Spanish', 'French', 'Portuguese', 'and 20+ more'],
      languages_count: 24,
      available: false
    },
    {
      id: 'esv',
      name: 'English Standard Version (ESV)',
      year: '2001',
      description: 'A literal translation that emphasizes word-for-word correspondence while maintaining readability.',
      style: 'Modern, essentially literal',
      copyright: 'Crossway',
      languages: ['English'],
      languages_count: 1,
      available: false
    },
    {
      id: 'nlt',
      name: 'New Living Translation (NLT)',
      year: '1996 (revised 2015)',
      description: 'A thought-for-thought translation designed for easy understanding while maintaining biblical accuracy.',
      style: 'Contemporary, dynamic equivalence',
      copyright: 'Tyndale House',
      languages: ['English', 'Spanish', 'Portuguese', 'German'],
      languages_count: 4,
      available: false
    }
  ];

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <PageHeader
        title="Bible Translations"
        description="Explore the different Bible translations available in Leavn"
        breadcrumbs={[
          { label: 'Resources', href: '/resources' },
          { label: 'Bible Translations' }
        ]}
      />

      <Tabs defaultValue="all" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Translations</TabsTrigger>
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="available">Available in Leavn</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {translations.map(translation => (
              <Card key={translation.id} className={`overflow-hidden transition-all ${!translation.available ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{translation.name}</CardTitle>
                    {translation.available ? (
                      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Available</Badge>
                    ) : (
                      <Badge variant="outline">Coming Soon</Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" /> 
                    <span>Published: {translation.year}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm mb-3">{translation.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Translation Style</p>
                        <p className="text-muted-foreground">{translation.style}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Available Languages</p>
                        <p className="text-muted-foreground">
                          {translation.languages_count > 3 
                            ? `${translation.languages_count} languages including ${translation.languages.slice(0, 3).join(', ')}`
                            : translation.languages.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <p className="text-xs text-muted-foreground">Copyright: {translation.copyright}</p>
                  {translation.available && (
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="h-4 w-4" />
                      View
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="english" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {translations.map(translation => (
              <Card key={translation.id} className={`overflow-hidden transition-all ${!translation.available ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{translation.name}</CardTitle>
                    {translation.available ? (
                      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Available</Badge>
                    ) : (
                      <Badge variant="outline">Coming Soon</Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" /> 
                    <span>Published: {translation.year}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm mb-3">{translation.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Translation Style</p>
                        <p className="text-muted-foreground">{translation.style}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <p className="text-xs text-muted-foreground">Copyright: {translation.copyright}</p>
                  {translation.available && (
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="h-4 w-4" />
                      View
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="available" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {translations.filter(t => t.available).map(translation => (
              <Card key={translation.id} className="overflow-hidden transition-all">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{translation.name}</CardTitle>
                    <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Available</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" /> 
                    <span>Published: {translation.year}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm mb-3">{translation.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Translation Style</p>
                        <p className="text-muted-foreground">{translation.style}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Available Languages</p>
                        <p className="text-muted-foreground">
                          {translation.languages.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <p className="text-xs text-muted-foreground">Copyright: {translation.copyright}</p>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="h-4 w-4" />
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="prose prose-emerald max-w-none">
        <h2>Understanding Bible Translations</h2>
        <p>
          Bible translations fall into three main categories based on their translation philosophy:
        </p>
        
        <ul>
          <li>
            <strong>Formal Equivalence</strong> (word-for-word): These translations attempt to maintain the exact words and phrases of the original text. Examples include the KJV, NASB, and ESV.
          </li>
          <li>
            <strong>Dynamic Equivalence</strong> (thought-for-thought): These translations focus on conveying the meaning of the original text in natural, contemporary language. Examples include NIV and NLT.
          </li>
          <li>
            <strong>Paraphrase</strong>: These translations take significant liberty with the text to make it highly readable and applicable. Examples include The Message and The Living Bible.
          </li>
        </ul>
        
        <h3>How to Choose a Translation</h3>
        <p>
          The best Bible translation depends on your specific needs:
        </p>
        
        <ul>
          <li>For deep study: Consider formal equivalence translations like KJV, ESV, or NASB</li>
          <li>For daily reading: Dynamic equivalence translations like NIV or NLT may be easier to understand</li>
          <li>For literary appreciation: The KJV remains unmatched for its poetic beauty and historical influence</li>
          <li>For new readers: Simplified translations like NLT or CEV are more accessible</li>
        </ul>
        
        <div className="bg-muted rounded-lg p-4 my-6">
          <h4 className="text-lg font-semibold mb-2">Translation Resources</h4>
          <ul className="space-y-1">
            <li className="flex items-center">
              <a href="https://www.biblegateway.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                Bible Gateway <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Compare over 200 translations</span>
            </li>
            <li className="flex items-center">
              <a href="https://biblehub.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                Bible Hub <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Parallel translations with study tools</span>
            </li>
            <li className="flex items-center">
              <a href="https://www.logos.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 flex items-center">
                Logos Bible Software <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="text-muted-foreground ml-2 text-sm">- Advanced study with multiple translations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}