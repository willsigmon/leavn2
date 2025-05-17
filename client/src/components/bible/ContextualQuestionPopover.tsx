import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Send, 
  HistoryIcon, 
  Clock 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";

type Question = {
  id: string;
  text: string;
  answer?: string;
  timestamp: Date;
};

interface ContextualQuestionPopoverProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

// Sample contextual questions that users might want to ask
const sampleQuestions = [
  "What would this mean to a first-century Jew?",
  "How was this interpreted in early Christianity?",
  "What cultural context is important to understand here?",
  "Are there any translation nuances from the original language?"
];

export default function ContextualQuestionPopover({ 
  book, 
  chapter, 
  verse, 
  verseText 
}: ContextualQuestionPopoverProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Mutation for submitting a question
  const askQuestionMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/ai/contextual-question", {
        verseText,
        question
      });
      return response;
    },
    onSuccess: (data) => {
      // Add the question and answer to recent questions
      const newQuestion: Question = {
        id: Date.now().toString(),
        text: question,
        answer: data.content,
        timestamp: new Date()
      };
      setRecentQuestions(prev => [newQuestion, ...prev].slice(0, 5));
      setQuestion("");
    }
  });

  const handleSubmitQuestion = () => {
    if (!question.trim()) return;
    askQuestionMutation.mutate(question);
  };

  const handleSampleQuestion = (sampleQuestion: string) => {
    setQuestion(sampleQuestion);
    askQuestionMutation.mutate(sampleQuestion);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
        >
          <HelpCircle size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm flex items-center text-blue-600">
              <HelpCircle size={16} className="mr-2" />
              Ask a Question About This Verse
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 rounded-full"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? <Clock size={14} /> : <HistoryIcon size={14} />}
            </Button>
          </div>
          
          {showHistory ? (
            <div className="max-h-60 overflow-y-auto space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Recent Questions</h4>
              {recentQuestions.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No questions yet</p>
              ) : (
                recentQuestions.map(q => (
                  <div key={q.id} className="space-y-1 pb-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{q.text}</p>
                    <p className="text-sm text-gray-600">{q.answer}</p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Textarea 
                  placeholder="Ask a question about historical context, original language, or cultural significance..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleSubmitQuestion}
                    disabled={!question.trim() || askQuestionMutation.isPending}
                    className="flex items-center"
                  >
                    {askQuestionMutation.isPending ? "Thinking..." : "Ask"}
                    <Send size={14} className="ml-2" />
                  </Button>
                </div>
              </div>
              
              {askQuestionMutation.isPending ? (
                <div className="pt-2 pb-2">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : askQuestionMutation.data ? (
                <div className="pt-2 pb-2 text-sm text-gray-700">
                  <p className="font-medium text-blue-600 mb-1">Answer:</p>
                  <p>{askQuestionMutation.data.content}</p>
                </div>
              ) : null}
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500">SUGGESTED QUESTIONS</h4>
                <div className="flex flex-wrap gap-2">
                  {sampleQuestions.map((q, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs py-1 h-auto"
                      onClick={() => handleSampleQuestion(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}