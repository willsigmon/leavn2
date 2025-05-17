import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  Calendar, 
  Clock, 
  Video, 
  Globe, 
  MessagesSquare, 
  BookOpen,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function OnlineGroups() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const groups = [
    {
      id: 'genesis-study',
      name: 'Genesis Study Group',
      description: 'A beginner-friendly exploration of the book of Genesis, focusing on creation, covenant, and key narratives.',
      members: 24,
      category: 'book-study',
      schedule: 'Tuesdays at 7:00 PM ET',
      format: 'Video call with breakout rooms',
      facilitator: 'Sarah Johnson',
      joinable: true,
      popular: true,
      focus: 'Old Testament'
    },
    {
      id: 'gospels-deep-dive',
      name: 'Gospels Deep Dive',
      description: 'An advanced study examining the four Gospels, their unique perspectives, and theological emphases.',
      members: 18,
      category: 'book-study',
      schedule: 'Wednesdays at 8:00 PM ET',
      format: 'Video call with shared discussion',
      facilitator: 'Dr. Michael Chen',
      joinable: true,
      popular: true,
      focus: 'New Testament'
    },
    {
      id: 'prayer-fellowship',
      name: 'Prayer Fellowship',
      description: 'A supportive community focused on prayer practices, scriptural prayers, and lifting up each other\'s needs.',
      members: 32,
      category: 'fellowship',
      schedule: 'Daily check-ins, live prayer Sundays at 9:00 AM ET',
      format: 'Text chat with weekly video gatherings',
      facilitator: 'Grace Martinez',
      joinable: true,
      popular: false,
      focus: 'Spiritual Practice'
    },
    {
      id: 'psalms-devotional',
      name: 'Psalms Devotional Group',
      description: 'A devotional journey through the Psalms, exploring themes of praise, lament, thanksgiving, and wisdom.',
      members: 29,
      category: 'devotional',
      schedule: 'Mondays and Fridays at 6:30 AM ET',
      format: 'Audio call with guided meditation',
      facilitator: 'Robert Wilson',
      joinable: true,
      popular: true,
      focus: 'Old Testament'
    },
    {
      id: 'theology-matters',
      name: 'Theology Matters',
      description: 'Discussions on systematic theology, doctrinal development, and contemporary theological issues.',
      members: 15,
      category: 'topical',
      schedule: 'Every other Thursday at 7:30 PM ET',
      format: 'Video discussion with assigned readings',
      facilitator: 'Dr. Eliza Thompson',
      joinable: false,
      popular: false,
      focus: 'Theology'
    },
    {
      id: 'biblical-hebrew',
      name: 'Biblical Hebrew Study',
      description: 'Learn the basics of Biblical Hebrew to engage with the Old Testament in its original language.',
      members: 12,
      category: 'language',
      schedule: 'Saturdays at 10:00 AM ET',
      format: 'Video class with interactive exercises',
      facilitator: 'Professor David Levy',
      joinable: false,
      popular: false,
      focus: 'Language'
    },
    {
      id: 'revelation-study',
      name: 'Understanding Revelation',
      description: 'A balanced approach to the book of Revelation, focusing on its historical context, symbolism, and message of hope.',
      members: 23,
      category: 'book-study',
      schedule: 'Sundays at 4:00 PM ET',
      format: 'Video discussion with Q&A',
      facilitator: 'Pastor James Williams',
      joinable: true,
      popular: true,
      focus: 'New Testament'
    },
    {
      id: 'scripture-art',
      name: 'Scripture & Art',
      description: 'Exploring Scripture through visual art, creative expression, and aesthetic engagement with biblical themes.',
      members: 19,
      category: 'creative',
      schedule: 'First Saturday of each month at 2:00 PM ET',
      format: 'Video workshop with shared galleries',
      facilitator: 'Emma Rodriguez',
      joinable: true,
      popular: false,
      focus: 'Creative Exploration'
    }
  ];

  const filteredGroups = groups.filter(
    group => group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             group.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
             group.facilitator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <PageHeader
        title="Online Study Groups"
        description="Connect with others for shared Scripture study and spiritual growth"
        breadcrumbs={[
          { label: 'Community', href: '/community' },
          { label: 'Online Groups' }
        ]}
      />

      <div className="flex flex-col gap-6 md:flex-row mb-10">
        <div className="md:w-2/3">
          <p className="text-lg">
            Our online study groups provide a welcoming environment to explore Scripture 
            together with others from around the world. Each group offers a unique focus, 
            format, and schedule to suit different interests and needs.
          </p>
          <p className="mt-4">
            Whether you're looking for in-depth Bible study, supportive prayer fellowship, 
            or theological discussion, you'll find a community here to enhance your 
            spiritual journey.
          </p>
        </div>
        <div className="md:w-1/3 bg-muted rounded-lg p-4 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Group Features</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Video className="h-4 w-4 text-emerald-600" />
              <span>Live video and audio meetings</span>
            </li>
            <li className="flex items-center gap-2">
              <MessagesSquare className="h-4 w-4 text-emerald-600" />
              <span>Text-based discussion forums</span>
            </li>
            <li className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span>Shared study resources</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="book-study">Book Studies</TabsTrigger>
          <TabsTrigger value="devotional">Devotional</TabsTrigger>
          <TabsTrigger value="topical">Topical</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredGroups.map(group => (
              <Card key={group.id} className={`overflow-hidden transition-all ${!group.joinable ? 'opacity-80' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{group.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Led by {group.facilitator}
                      </CardDescription>
                    </div>
                    {group.popular && (
                      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm mb-4">{group.description}</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p><span className="font-medium">{group.members}</span> members</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Schedule</p>
                        <p className="text-muted-foreground">{group.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Video className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Format</p>
                        <p className="text-muted-foreground">{group.format}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <Badge variant="outline">{group.focus}</Badge>
                  <Button disabled={!group.joinable}>
                    {group.joinable ? "Join Group" : "Group Full"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredGroups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No groups found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="book-study">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredGroups
              .filter(group => group.category === 'book-study')
              .map(group => (
                <Card key={group.id} className={`overflow-hidden transition-all ${!group.joinable ? 'opacity-80' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{group.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Led by {group.facilitator}
                        </CardDescription>
                      </div>
                      {group.popular && (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Popular</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm mb-4">{group.description}</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p><span className="font-medium">{group.members}</span> members</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Schedule</p>
                          <p className="text-muted-foreground">{group.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Video className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Format</p>
                          <p className="text-muted-foreground">{group.format}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <Badge variant="outline">{group.focus}</Badge>
                    <Button disabled={!group.joinable}>
                      {group.joinable ? "Join Group" : "Group Full"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="devotional">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredGroups
              .filter(group => group.category === 'devotional')
              .map(group => (
                <Card key={group.id} className={`overflow-hidden transition-all ${!group.joinable ? 'opacity-80' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{group.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Led by {group.facilitator}
                        </CardDescription>
                      </div>
                      {group.popular && (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Popular</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm mb-4">{group.description}</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p><span className="font-medium">{group.members}</span> members</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Schedule</p>
                          <p className="text-muted-foreground">{group.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Video className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Format</p>
                          <p className="text-muted-foreground">{group.format}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <Badge variant="outline">{group.focus}</Badge>
                    <Button disabled={!group.joinable}>
                      {group.joinable ? "Join Group" : "Group Full"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="topical">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredGroups
              .filter(group => group.category === 'topical')
              .map(group => (
                <Card key={group.id} className={`overflow-hidden transition-all ${!group.joinable ? 'opacity-80' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{group.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Led by {group.facilitator}
                        </CardDescription>
                      </div>
                      {group.popular && (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Popular</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm mb-4">{group.description}</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p><span className="font-medium">{group.members}</span> members</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Schedule</p>
                          <p className="text-muted-foreground">{group.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Video className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Format</p>
                          <p className="text-muted-foreground">{group.format}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <Badge variant="outline">{group.focus}</Badge>
                    <Button disabled={!group.joinable}>
                      {group.joinable ? "Join Group" : "Group Full"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Upcoming Featured Events</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>Summer Bible Reading Challenge</CardTitle>
                  <CardDescription>A community-wide initiative to read through the New Testament</CardDescription>
                </div>
                <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Featured</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>June 1 - August 31, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>214 participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>Global</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto gap-1">
                Learn More <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>Virtual Bible Conference: The Prophets</CardTitle>
                  <CardDescription>A weekend of in-depth teaching on the prophetic books</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>July 15-17, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>9:00 AM - 5:00 PM ET</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span>Live-streamed with interactive sessions</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto gap-1">
                Register Now <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="prose prose-emerald max-w-none">
        <h2>Starting Your Own Group</h2>
        <p>
          Interested in leading a study group? We welcome community members to facilitate groups 
          based on their interests, expertise, and areas of passion. Here's how to get started:
        </p>
        
        <ol>
          <li>
            <strong>Define Your Focus</strong>: Choose a book of the Bible, theological topic, 
            or spiritual practice you'd like to explore with others.
          </li>
          <li>
            <strong>Determine Format and Schedule</strong>: Decide on meeting frequency, time commitment, 
            and how your group will interact (video, audio, text, or combination).
          </li>
          <li>
            <strong>Prepare Resources</strong>: Gather study materials, discussion questions, 
            and supplementary content to support your group's learning.
          </li>
          <li>
            <strong>Submit Your Proposal</strong>: Use our group leader application to share your 
            vision and get approved to start your group.
          </li>
          <li>
            <strong>Launch and Facilitate</strong>: Once approved, we'll help you launch your group 
            and provide ongoing support for facilitation.
          </li>
        </ol>
        
        <div className="flex justify-center my-8">
          <Button size="lg" className="gap-2">
            Apply to Lead a Group <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}