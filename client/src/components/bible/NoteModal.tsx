import { useState, useEffect } from "react";
import { Note } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FaTimes } from "react-icons/fa";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseNumber: number;
  verseText: string;
  existingNote?: Note;
  book: string;
  chapter: number;
}

export default function NoteModal({
  isOpen,
  onClose,
  verseNumber,
  verseText,
  existingNote,
  book,
  chapter
}: NoteModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (existingNote) {
      setContent(existingNote.content || "");
    } else {
      setContent("");
    }
  }, [existingNote, isOpen]);
  
  const handleSave = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      if (existingNote) {
        // Update existing note
        await apiRequest("PATCH", `/api/notes/${existingNote.id}`, {
          content: content
        });
        
        toast({
          title: "Note updated",
          description: "Your note has been updated successfully"
        });
      } else {
        // Create new note
        await apiRequest("POST", "/api/notes", {
          book,
          chapter,
          verse: verseNumber,
          content: content
        });
        
        toast({
          title: "Note added",
          description: "Your note has been added successfully"
        });
      }
      
      queryClient.invalidateQueries({ queryKey: [`/api/notes/${book}/${chapter}`] });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-lg text-primary-dark">
            {existingNote ? "Edit Note" : "Add Note"} - Verse {verseNumber}
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-gray-100 p-3 rounded-lg mb-3">
          <p className="font-serif text-sm text-gray-700">{verseText}</p>
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add your thoughts about this verse..."
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
        />
        
        <DialogFooter className="flex justify-end space-x-3">
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            className="bg-primary hover:bg-primary-dark text-white"
            onClick={handleSave}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "Saving..." : "Save Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
