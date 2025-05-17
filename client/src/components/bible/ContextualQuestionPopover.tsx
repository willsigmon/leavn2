import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type Question = {
  id: string;
  text: string;
  answer?: string | any;  // Allow any type for answer to handle various response formats
  timestamp: Date;
};

interface ContextualQuestionPopoverProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

export default function ContextualQuestionPopover({ 
  book, 
  chapter, 
  verse, 
  verseText 
}: ContextualQuestionPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsAsking(true);
    
    // Create new question
    const newQuestion: Question = {
      id: uuidv4(),
      text: question,
      timestamp: new Date()
    };
    
    try {
      // Call API to get AI generated answer
      const response = await apiRequest(
        "POST",
        "/api/ai/contextual-question",
        {
          book,
          chapter,
          verse,
          verseText,
          question
        }
      );
      
      // Add answer to question
      // Check the response format
      console.log("Response from API:", response);
      
      // Parse the response
      let answerContent;
      try {
        if (response && typeof response === 'object') {
          if ('content' in response) {
            answerContent = response.content;
          } else if (typeof response === 'string') {
            answerContent = response;
          } else {
            answerContent = JSON.stringify(response);
          }
        } else {
          answerContent = "Received response but couldn't find content";
        }
      } catch (err) {
        console.error("Error parsing response:", err);
        answerContent = "I'm having trouble processing this answer right now.";
      }
      
      const answeredQuestion = {
        ...newQuestion,
        answer: answerContent
      };
      
      // Add to recent questions list
      setRecentQuestions(prev => [answeredQuestion, ...prev.slice(0, 4)]);
      setQuestion("");
      setExpandedQuestionId(answeredQuestion.id);
    } catch (error) {
      console.error("Failed to get answer:", error);
      setRecentQuestions(prev => [
        {
          ...newQuestion,
          answer: "I'm sorry, I couldn't generate an answer at this time. Please try again later."
        }, 
        ...prev.slice(0, 4)
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const toggleQuestion = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  // Sample presets for contextual questions
  const questionPresets = [
    "What would this verse mean to a first-century Jew?",
    "How does this connect to Jesus' teachings?",
    "What's the historical context of this passage?",
    "How do different denominations interpret this?"
  ];
  
  const handleQuestionPresetClick = (preset: string) => {
    setQuestion(preset);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs px-2 py-1 rounded-full flex items-center">
          <FaQuestionCircle className="mr-1 h-3 w-3" />
          <span>Ask about this</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md" aria-describedby="contextual-question-description">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-1">
            Ask about {book} {chapter}:{verse}
          </DialogTitle>
          <div className="text-sm text-center py-2 px-4 bg-accent/5 rounded border border-border mb-4">
            {verseText}
          </div>
          <div id="contextual-question-description" className="sr-only">
            Ask and receive answers about this Bible verse in context
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Your question</Label>
            <div className="flex mt-1.5">
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about this verse..."
                className="flex-1"
              />
              <Button 
                onClick={handleAskQuestion}
                disabled={isAsking || !question.trim()}
                className="ml-2"
              >
                {isAsking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {questionPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleQuestionPresetClick(preset)}
                className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-full px-2 py-1"
              >
                {preset}
              </button>
            ))}
          </div>
          
          {recentQuestions.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="font-medium text-sm">Recent Questions</h3>
              <div className="space-y-2">
                {recentQuestions.map((q) => (
                  <div key={q.id} className="border rounded-md overflow-hidden">
                    <button
                      onClick={() => toggleQuestion(q.id)}
                      className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-50"
                    >
                      <span className="font-medium text-sm">{q.text}</span>
                      {expandedQuestionId === q.id ? 
                        <FaChevronUp className="h-3 w-3 text-gray-400" /> : 
                        <FaChevronDown className="h-3 w-3 text-gray-400" />
                      }
                    </button>
                    {expandedQuestionId === q.id && (
                      <div className="p-3 border-t bg-gray-50">
                        <p className="text-sm">{q.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}