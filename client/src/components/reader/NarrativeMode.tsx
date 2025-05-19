import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Book, Camera, Loader2, VideoIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface NarrativeModeProps {
  book: string;
  chapter: number;
  verses: Array<{ number: number; text: string }>;
}

const NarrativeMode: React.FC<NarrativeModeProps> = ({ book, chapter, verses }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [narrativeText, setNarrativeText] = useState<string>('');
  const [isNarrativeMode, setIsNarrativeMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combine all verses into a single text for context
  const fullText = verses?.map(v => v.text).join(' ') || '';

  const generateNarrative = async () => {
    if (narrativeText) {
      // If we already have the narrative, just toggle the view
      setIsNarrativeMode(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai/narrative/${book}/${chapter}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate narrative');
      }

      const data = await response.json();
      setNarrativeText(data.content);
      setIsNarrativeMode(true);
    } catch (error) {
      console.error('Error generating narrative:', error);
      setError('Failed to generate narrative. Please try again.');
      // Generate a fallback narrative for demo purposes
      const fallbackNarrative = generateFallbackNarrative(book, chapter, fullText);
      setNarrativeText(fallbackNarrative);
      setIsNarrativeMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset narrative when book/chapter changes
  useEffect(() => {
    setNarrativeText('');
    setIsNarrativeMode(false);
  }, [book, chapter]);

  const toggleNarrativeMode = () => {
    if (!narrativeText) {
      generateNarrative();
    } else {
      setIsNarrativeMode(!isNarrativeMode);
    }
  };

  return (
    <div className="mb-6">
      <Button
        onClick={toggleNarrativeMode}
        variant={isNarrativeMode ? "default" : "outline"}
        className={isNarrativeMode ? "bg-[#2c4c3b] hover:bg-[#1a3329] text-white" : ""}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : isNarrativeMode ? (
          <>
            <Book className="mr-2 h-4 w-4" />
            Return to Standard Mode
          </>
        ) : (
          <>
            <VideoIcon className="mr-2 h-4 w-4" />
            Read as Narrative
          </>
        )}
      </Button>

      {isNarrativeMode && (
        <Card className="mt-4 border-[#2c4c3b]/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-serif">
                  {book} {chapter}: The Narrative
                </CardTitle>
                <CardDescription>
                  An immersive retelling inspired by "The Chosen"
                </CardDescription>
              </div>
              <Camera className="h-5 w-5 text-[#2c4c3b] opacity-70" />
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div className="prose prose-green dark:prose-invert max-w-none">
                {error && (
                  <p className="text-red-500 text-sm mb-2">{error}</p>
                )}
                <div className="narrative-text leading-relaxed font-serif">
                  {narrativeText.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper function to generate a fallback narrative for demo purposes
const generateFallbackNarrative = (book: string, chapter: number, originalText: string): string => {
  let narrativeIntro = '';
  
  // Customize the intro based on the book
  if (book.toLowerCase() === 'genesis' && chapter === 1) {
    narrativeIntro = `The vast expanse of nothingness stretched before God, a canvas waiting for His touch. There was no light, no form, only the Spirit of God hovering expectantly over the deep waters of potential. The Director of all creation prepared to speak the first words of existence into being.

Mary, her eyes wide with wonder, leaned in closer to Jesus as He continued the story she had heard since childhood, yet now told by the very Author of creation Himself.

"In the beginning," Jesus said, His voice resonant with authority yet gentle, "when there was nothing—no stars, no earth, no creatures—my Father spoke." He paused, His eyes reflecting something ancient and profound. "And everything changed."`;
  } else if (book.toLowerCase() === 'john' && chapter === 1) {
    narrativeIntro = `The cool evening air settled over Ephesus as John, now elderly with weathered hands and deep lines etched across his face, sat surrounded by his disciples. His eyes, though dimmed with age, still burned with the fire of one who had witnessed the extraordinary. He dipped his pen and began to write, the words flowing from a place beyond mere memory.

"In the beginning was the Word," he wrote, his hand steady despite his years. "And the Word was with God, and the Word was God."

The young disciple Papias leaned forward. "Master, when you speak of the Word—this Logos—you mean Jesus, don't you?"

John's eyes grew distant, seeing beyond the small room to that day by the Jordan when he first saw Him. "Before He had a human name," John explained, "before He walked among us, He existed. He was there at creation itself, not just present, but active—the very expression of the Father's creative power and wisdom."`;
  } else {
    // Generic intro for other books/chapters
    narrativeIntro = `The ancient world came alive as the scroll was unrolled, the words transforming from mere text to vivid reality. The characters breathed, their emotions palpable, their struggles and triumphs no longer distant history but present experience.

As the narrative of ${book} chapter ${chapter} unfolded, the listeners were transported across time, walking alongside those who had lived these sacred stories. The divine inspiration behind the text revealed itself not just in the wisdom of the words, but in their power to transform hearts centuries after they were first written.`;
  }
  
  // Return the intro followed by a narrative adaptation of the original text
  return `${narrativeIntro}\n\n${adaptTextToNarrative(book, chapter, originalText)}`;
};

// Helper function to convert standard Bible text to narrative style
const adaptTextToNarrative = (book: string, chapter: number, text: string): string => {
  // Remove verse numbers and transform to narrative style
  let narrative = text
    .replace(/^\d+\s+/gm, '') // Remove verse numbers
    .replace(/And it came to pass/g, 'It happened')
    .replace(/And God said/g, 'God spoke, His voice resonating through the formless void')
    .replace(/And God saw/g, 'God beheld His work')
    .replace(/behold/gi, 'look')
    .replace(/unto/g, 'to')
    .replace(/Thus saith the Lord/gi, 'The Lord declared')
    .replace(/thy/g, 'your')
    .replace(/thou/g, 'you')
    .replace(/thee/g, 'you');
  
  // Add narrative elements based on book
  if (book.toLowerCase() === 'genesis') {
    narrative += '\n\nThe creation narrative continued to unfold as God spoke galaxies into existence with the same ease we might speak a greeting. The ancient storyteller's words barely captured the magnitude of these moments—how could language contain the birth of everything? Yet through these humble phrases, generations would connect to their Creator and find their place in His story.';
  } else if (book.toLowerCase() === 'john') {
    narrative += '\n\nThe disciples exchanged glances, only beginning to grasp the weight of what they were witnessing. They were not merely following a teacher; they were walking with the very Word that had been present since before time began. The Word that had now taken on flesh and made His dwelling among them, full of grace and truth.';
  }
  
  return narrative;
};

export default NarrativeMode;