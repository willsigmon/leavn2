import Verse from "./Verse";
import { Verse as VerseType, Note } from "@shared/schema";

interface VerseContainerProps {
  verses: VerseType[];
  selectedLens: string;
  notes: Note[];
  onOpenNoteModal: (verseNum: number) => void;
}

export default function VerseContainer({ 
  verses, 
  selectedLens,
  notes,
  onOpenNoteModal
}: VerseContainerProps) {
  return (
    <div className="flex-1">
      {verses.map((verse) => {
        const note = notes.find(n => n.verse === verse.verseNumber);
        
        return (
          <Verse 
            key={verse.verseNumber}
            verse={verse}
            lens={selectedLens}
            note={note}
            onOpenNoteModal={onOpenNoteModal}
          />
        );
      })}
    </div>
  );
}
