import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookOpen, Info, Globe, History } from 'lucide-react';
import { useLocation } from 'wouter';

interface TranslationInfo {
  id: string;
  name: string;
  shortName: string;
  year: string;
  type: string;
  description: string;
  readabilityLevel: string;
  features: string[];
}

const translations: TranslationInfo[] = [
  {
    id: 'kjv',
    name: 'King James Version',
    shortName: 'KJV',
    year: '1611',
    type: 'Formal Equivalence',
    description: 'The King James Version (KJV) is an English translation of the Christian Bible for the Church of England, commissioned in 1604 and published in 1611. The KJV is notable for its beautiful and majestic prose that has influenced literature and speech for over four centuries. Its language can be challenging for modern readers but is beloved for its poetic quality.',
    readabilityLevel: 'Challenging (12th grade+)',
    features: ['Public domain', 'Beautiful poetic language', 'Historical significance']
  },
  {
    id: 'web',
    name: 'World English Bible',
    shortName: 'WEB',
    year: '2000',
    type: 'Formal Equivalence',
    description: 'The World English Bible (WEB) is a free public domain translation of the Bible that is based on the 1901 American Standard Version but has been updated for readability while maintaining accuracy. It avoids theological bias and modern political correctness, aiming to be a reliable translation accessible to all English readers.',
    readabilityLevel: 'Moderate (7th-9th grade)',
    features: ['Public domain', 'Modern English', 'No copyright restrictions', 'Gender-accurate']
  },
  {
    id: 'niv',
    name: 'New International Version',
    shortName: 'NIV',
    year: '1978 (updated 2011)',
    type: 'Dynamic Equivalence',
    description: 'The New International Version (NIV) seeks a middle ground between word-for-word and thought-for-thought translation, aiming to balance faithful representation of the original texts with readability. It was created by a team of over 100 scholars and is one of the most widely read modern English translations.',
    readabilityLevel: 'Easy (7th-8th grade)',
    features: ['Contemporary language', 'Balance of readability and accuracy', 'Regular updates']
  },
  {
    id: 'esv',
    name: 'English Standard Version',
    shortName: 'ESV',
    year: '2001',
    type: 'Formal Equivalence',
    description: 'The English Standard Version (ESV) is an "essentially literal" translation that emphasizes word-for-word accuracy while maintaining readability in contemporary English. It was created by a team of over 100 leading evangelical scholars and teachers, and aims to be both faithful to the original texts and literary in style.',
    readabilityLevel: 'Moderate (8th-10th grade)',
    features: ['Word-for-word accuracy', 'Literary quality', 'Modern scholarly research']
  },
  {
    id: 'nlt',
    name: 'New Living Translation',
    shortName: 'NLT',
    year: '1996 (updated 2015)',
    type: 'Dynamic Equivalence',
    description: 'The New Living Translation (NLT) is a thought-for-thought translation designed to be easily readable and understandable for the modern reader while accurately communicating the meaning and content of the original biblical texts. It was produced by a team of over 90 Bible scholars and linguistic experts.',
    readabilityLevel: 'Easy (6th grade)',
    features: ['Highly readable', 'Contemporary language', 'Natural phrasing']
  },
  {
    id: 'nasb',
    name: 'New American Standard Bible',
    shortName: 'NASB',
    year: '1971 (updated 2020)',
    type: 'Formal Equivalence',
    description: 'The New American Standard Bible (NASB) is widely regarded as one of the most literally translated modern English Bible versions. It prioritizes accuracy and faithfulness to the original languages, making it excellent for study but sometimes at the cost of natural English flow and readability.',
    readabilityLevel: 'Challenging (11th grade+)',
    features: ['Word-for-word accuracy', 'Updated with modern scholarship', 'Literal translation']
  },
];

export default function BibleTranslations() {
  const [, navigate] = useLocation();

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col gap-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold text-primary">Bible Translations</h1>
        <p className="text-muted-foreground max-w-3xl">
          Explore the various translations of the Bible available within Leavn. Each translation 
          offers unique perspectives and language styles, suitable for different study approaches.
        </p>
        
        <Separator className="my-2" />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="translations">Translations</TabsTrigger>
            <TabsTrigger value="comparison">Compare Translations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Info className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Understanding Bible Translations</CardTitle>
                  <CardDescription>
                    Why there are different translations and how they differ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Bible translations fall along a spectrum from "word-for-word" (formal equivalence) 
                    to "thought-for-thought" (dynamic equivalence) approaches:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Formal Equivalence</h3>
                      <p className="text-sm text-muted-foreground">
                        Translations like KJV, NASB, and ESV aim to translate each word from the original 
                        languages as directly as possible, preserving original sentence structures.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Dynamic Equivalence</h3>
                      <p className="text-sm text-muted-foreground">
                        Translations like NIV and NLT focus on conveying the meaning and intent behind 
                        the original text, often using more natural phrasing in modern English.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Paraphrases</h3>
                      <p className="text-sm text-muted-foreground">
                        Versions like The Message are not strict translations but retellings that aim to 
                        capture the essence and emotional impact of the text in contemporary language.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Globe className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Original Languages</CardTitle>
                  <CardDescription>
                    The languages in which the Bible was originally written
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Hebrew</h3>
                      <p className="text-sm text-muted-foreground">
                        Most of the Old Testament was written in ancient Hebrew, a Semitic language 
                        that reads right-to-left. Hebrew emphasizes concrete imagery and action verbs.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Aramaic</h3>
                      <p className="text-sm text-muted-foreground">
                        Small portions of the Old Testament (parts of Daniel and Ezra) were written in 
                        Aramaic, which became the common language in the Near East after the Babylonian exile.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Koine Greek</h3>
                      <p className="text-sm text-muted-foreground">
                        The entire New Testament was written in Koine (common) Greek, the international 
                        language of the Mediterranean world during the first century CE.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <History className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Timeline of Major English Translations</CardTitle>
                  <CardDescription>
                    The evolution of Bible translation throughout history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l border-border pl-8 pb-6">
                    <div className="mb-8 relative">
                      <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-background"></div>
                      </div>
                      <h3 className="font-medium mb-1">1382-1395: Wycliffe Bible</h3>
                      <p className="text-sm text-muted-foreground">
                        The first complete English translation of the Bible, produced by John Wycliffe and his followers. 
                        Translated from the Latin Vulgate rather than original Hebrew and Greek.
                      </p>
                    </div>
                    
                    <div className="mb-8 relative">
                      <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-background"></div>
                      </div>
                      <h3 className="font-medium mb-1">1526: Tyndale's New Testament</h3>
                      <p className="text-sm text-muted-foreground">
                        William Tyndale's groundbreaking translation from Greek to English. His work formed 
                        the basis for much of the King James Version later.
                      </p>
                    </div>
                    
                    <div className="mb-8 relative">
                      <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-background"></div>
                      </div>
                      <h3 className="font-medium mb-1">1611: King James Version (KJV)</h3>
                      <p className="text-sm text-muted-foreground">
                        Commissioned by King James I of England, this translation became the standard English Bible 
                        for nearly 400 years and had profound influence on English language and literature.
                      </p>
                    </div>
                    
                    <div className="mb-8 relative">
                      <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-background"></div>
                      </div>
                      <h3 className="font-medium mb-1">1952: Revised Standard Version (RSV)</h3>
                      <p className="text-sm text-muted-foreground">
                        A significant revision of the American Standard Version that aimed to preserve the literary 
                        quality of the KJV while updating archaic language.
                      </p>
                    </div>
                    
                    <div className="mb-8 relative">
                      <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-background"></div>
                      </div>
                      <h3 className="font-medium mb-1">1978-1984: New International Version (NIV)</h3>
                      <p className="text-sm text-muted-foreground">
                        One of the most popular modern English translations, aimed at balancing readability with accuracy. 
                        Updated in 2011 to reflect modern English usage.
                      </p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-background"></div>
                      </div>
                      <h3 className="font-medium mb-1">2000s-Present: Modern Translations</h3>
                      <p className="text-sm text-muted-foreground">
                        Numerous translations including ESV (2001), NLT (1996, updated), NASB (1971, updated), 
                        and digital-focused versions continue to emerge, often targeting specific audiences or needs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="translations" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {translations.map((translation) => (
                <Card key={translation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{translation.name} ({translation.shortName})</CardTitle>
                        <CardDescription>{translation.year} • {translation.type}</CardDescription>
                      </div>
                      <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {translation.id === 'kjv' || translation.id === 'web' ? 'Available in Leavn' : 'Coming Soon'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {translation.description}
                    </p>
                    
                    <div className="mb-4">
                      <span className="text-xs font-medium">Readability:</span>
                      <span className="text-xs text-muted-foreground ml-2">{translation.readabilityLevel}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-xs font-medium">Features:</span>
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 ml-2">
                        {translation.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparing Translations</CardTitle>
                <CardDescription>
                  See how different versions translate the same passages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium mb-3">John 3:16</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-primary/10 px-2 py-0.5 rounded text-primary text-xs font-medium w-14 text-center mt-0.5 mr-3">
                        KJV
                      </div>
                      <p className="text-sm">
                        "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-primary/10 px-2 py-0.5 rounded text-primary text-xs font-medium w-14 text-center mt-0.5 mr-3">
                        WEB
                      </div>
                      <p className="text-sm">
                        "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life."
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-primary/10 px-2 py-0.5 rounded text-primary text-xs font-medium w-14 text-center mt-0.5 mr-3">
                        NIV
                      </div>
                      <p className="text-sm">
                        "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-primary/10 px-2 py-0.5 rounded text-primary text-xs font-medium w-14 text-center mt-0.5 mr-3">
                        ESV
                      </div>
                      <p className="text-sm">
                        "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-primary/10 px-2 py-0.5 rounded text-primary text-xs font-medium w-14 text-center mt-0.5 mr-3">
                        NLT
                      </div>
                      <p className="text-sm">
                        "For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life."
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <h3 className="font-medium mb-3">Psalm 23:1</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-primary/10 px-2 py-0.5 rounded text-primary text-xs font-medium w-14 text-center mt-0.5 mr-3">
                        KJV
                      </div>
                      <p className="text-sm">
                        "The LORD is my shepherd; I shall not want."
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-primary/10 px-2 py-0.5 rounded text-primary text-xs font-medium w-14 text-center mt-0.5 mr-3">
                        WEB
                      </div>
                      <p className="text-sm">
                        "Yahweh is my shepherd; I shall lack nothing."
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-primary/10 px-2 py-0.5 rounded text-primary text-xs font-medium w-14 text-center mt-0.5 mr-3">
                        NIV
                      </div>
                      <p className="text-sm">
                        "The LORD is my shepherd, I lack nothing."
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-primary/10 px-2 py-0.5 rounded text-primary text-xs font-medium w-14 text-center mt-0.5 mr-3">
                        ESV
                      </div>
                      <p className="text-sm">
                        "The LORD is my shepherd; I shall not want."
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-primary/10 px-2 py-0.5 rounded text-primary text-xs font-medium w-14 text-center mt-0.5 mr-3">
                        NLT
                      </div>
                      <p className="text-sm">
                        "The LORD is my shepherd; I have all that I need."
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button onClick={() => navigate('/bible-reader')}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Open Bible to Compare More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}