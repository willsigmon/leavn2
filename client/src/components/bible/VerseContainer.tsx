import Verse from "./Verse";
import { Verse as VerseType, Note } from "@shared/schema";
import { cn } from "@/lib/utils";

interface VerseContainerProps {
  verses: VerseType[];
  selectedLens: string;
  readerMode?: string;
  notes: Note[];
  onOpenNoteModal: (verseNum: number) => void;
  compact?: boolean;
}

export default function VerseContainer({ 
  verses, 
  selectedLens,
  readerMode = "standard",
  notes,
  onOpenNoteModal,
  compact = false
}: VerseContainerProps) {
  return (
    <div className={cn(
      "flex-1",
      compact && "space-y-3"
    )}>
      {verses.map((verse) => {
        const note = notes.find(n => n.verse === verse.verseNumber);
        
        return (
          <Verse 
            key={verse.verseNumber}
            verse={verse}
            lens={selectedLens}
            readerMode={readerMode}
            note={note}
            onOpenNoteModal={onOpenNoteModal}
            compact={compact}
          />
        );
      })}
    </div>
  );
}
