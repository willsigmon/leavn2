import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaExchangeAlt, FaChevronLeft, FaChevronRight, FaSyncAlt } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

interface VerseComparisonProps {
  book: string;
  chapter: number;
  verse: number;
}

const TRANSLATIONS = [
  { id: "esv", name: "English Standard Version" },
  { id: "niv", name: "New International Version" },
  { id: "kjv", name: "King James Version" },
  { id: "nlt", name: "New Living Translation" },
  { id: "nasb", name: "New American Standard Bible" }
];

export default function VerseComparison({ book, chapter, verse }: VerseComparisonProps) {
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(["esv", "niv"]);

  // In a full implementation, we would fetch different translations from an API
  // For now, we'll use mock data based on our current verse
  const { data: verseData, isLoading } = useQuery({
    queryKey: [`/api/bible/${book}/${chapter}`],
  });

  const currentVerse = verseData?.verses?.find((v: any) => v.verseNumber === verse);
  
  // Mock translations for demonstration
  const getMockTranslation = (translation: string) => {
    if (!currentVerse) return "";
    
    switch (translation) {
      case "kjv":
        return currentVerse.text.replace("the LORD", "the LORD").replace("understanding", "understanding");
      case "niv":
        return currentVerse.text;
      case "nlt":
        return currentVerse.text.replace("Trust in the LORD", "Trust in the LORD completely").replace("lean not on", "don't rely on");
      case "nasb":
        return currentVerse.text.replace("Trust in", "Trust in").replace("heart", "heart");
      default:
        return currentVerse.text;
    }
  };

  const handleAddTranslation = (translation: string) => {
    if (selectedTranslations.includes(translation) || selectedTranslations.length >= 3) {
      return;
    }
    setSelectedTranslations([...selectedTranslations, translation]);
  };

  const handleRemoveTranslation = (translation: string) => {
    if (selectedTranslations.length <= 1) {
      return;
    }
    setSelectedTranslations(selectedTranslations.filter(t => t !== translation));
  };

  if (isLoading) {
    return (
      <Card className="w-full mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentVerse) {
    return (
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>Verse Comparison</CardTitle>
          <CardDescription>Verse not found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Verse Comparison</CardTitle>
            <CardDescription>Compare translations of {book} {chapter}:{verse}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => verseData?.verses?.[verse - 2] && window.location.hash = `verse-${verse - 1}`}
              disabled={!verseData?.verses?.[verse - 2]}
            >
              <FaChevronLeft className="mr-1" /> Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => verseData?.verses?.[verse] && window.location.hash = `verse-${verse + 1}`}
              disabled={!verseData?.verses?.[verse]}
            >
              Next <FaChevronRight className="ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedTranslations.map((translation, index) => (
            <div key={translation} className="flex items-start">
              <div className="w-24 flex-shrink-0">
                <div className="font-semibold text-sm text-primary-dark">{translation.toUpperCase()}</div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700">{getMockTranslation(translation)}</p>
              </div>
              {selectedTranslations.length > 1 && (
                <button 
                  className="text-gray-400 hover:text-red-500 ml-2"
                  onClick={() => handleRemoveTranslation(translation)}
                >
                  <span className="sr-only">Remove</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <FaExchangeAlt className="text-primary" />
          <Select 
            onValueChange={(value) => handleAddTranslation(value)}
            disabled={selectedTranslations.length >= 3}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Add version" />
            </SelectTrigger>
            <SelectContent>
              {TRANSLATIONS.filter(t => !selectedTranslations.includes(t.id)).map(translation => (
                <SelectItem key={translation.id} value={translation.id}>
                  {translation.id.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" className="flex items-center">
          <FaSyncAlt className="mr-2" />
          <span>Refresh</span>
        </Button>
      </CardFooter>
    </Card>
  );
}