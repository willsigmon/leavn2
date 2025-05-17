import { Note } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { FaStickyNote, FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NotePanelProps {
  notes: Note[];
  book: string;
  chapter: number;
  onOpenNoteModal: (verseNum: number) => void;
}

export default function NotePanel({ notes, book, chapter, onOpenNoteModal }: NotePanelProps) {
  const { toast } = useToast();
  
  const deleteNote = async (noteId: string) => {
    try {
      await apiRequest("DELETE", `/api/notes/${noteId}`, undefined);
      
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/notes/${book}/${chapter}`] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full md:w-80 bg-card rounded-xl shadow-sm border border-border h-fit sticky top-24 overflow-hidden">
      <div className="border-b border-border p-4">
        <h2 className="font-bold text-lg text-primary flex items-center">
          <FaStickyNote className="mr-2" />
          My Notes
        </h2>
      </div>
      <div className="p-4">
        {notes.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <FaStickyNote className="text-primary/70 text-2xl" />
            </div>
            <div>
              <p className="text-foreground font-medium">Track what resonates</p>
              <p className="text-sm text-muted-foreground mt-1">Tap a verse to reflect and record your insights</p>
            </div>
            <div className="pt-3 px-6">
              <Button 
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => onOpenNoteModal(1)}
              >
                Tap to create your first note
              </Button>
            </div>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Verse {note.verse}</h3>
              <div className="bg-accent/5 rounded-lg p-3 border border-border">
                <p className="text-sm text-foreground">{note.content}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <button 
                      className="hover:text-primary"
                      onClick={() => onOpenNoteModal(note.verse)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button 
                      className="hover:text-destructive"
                      onClick={() => deleteNote(note.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {notes.length > 0 && (
          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg py-2 px-4 font-medium transition-colors mt-2"
            onClick={() => onOpenNoteModal(1)}
          >
            <FaPlus className="mr-1.5" />
            Add New Note
          </Button>
        )}
      </div>
    </div>
  );
}
