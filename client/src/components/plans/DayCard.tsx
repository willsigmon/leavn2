import React from 'react';
import { ReadingPlanDay } from '../../types/readingPlan';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Book, Calendar, Check } from 'lucide-react';

interface DayCardProps {
  day: ReadingPlanDay;
  dayNumber: number;
  isCompleted: boolean;
  onClick: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ 
  day, 
  dayNumber, 
  isCompleted, 
  onClick 
}) => {
  return (
    <Card 
      className={`group hover:shadow-md transition-all duration-200 cursor-pointer border-stone-200 
                dark:border-stone-700 overflow-hidden ${isCompleted ? 'bg-[#2c4c3b]/5 dark:bg-[#2c4c3b]/20' : ''}`}
      onClick={onClick}
    >
      {/* Completion indicator */}
      {isCompleted && (
        <div className="absolute right-3 top-3 bg-[#2c4c3b] rounded-full p-1 shadow-sm">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
      
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#2c4c3b]/10 dark:bg-[#2c4c3b]/30">
            <Calendar className="h-4 w-4 text-[#2c4c3b] dark:text-green-300" />
          </div>
          <span className="text-sm font-medium text-[#2c4c3b] dark:text-green-300">
            Day {dayNumber}
          </span>
        </div>
        <h3 className="text-base font-semibold mt-2 text-gray-800 dark:text-gray-200 group-hover:text-[#2c4c3b] dark:group-hover:text-green-300 transition-colors">
          {day.title}
        </h3>
      </CardHeader>
      
      <CardContent className="px-4 pb-4">
        {/* Passages */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {day.passages.map(passage => (
            <Badge 
              key={passage} 
              variant="outline" 
              className="bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 flex items-center gap-1.5 text-xs"
            >
              <Book className="h-3 w-3 text-[#2c4c3b] dark:text-green-300" />
              <span>{passage}</span>
            </Badge>
          ))}
        </div>
        
        {/* Contextual indicators */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {day.historicalContext && (
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs">
              Historical Context
            </Badge>
          )}
          {day.theologicalConcepts && day.theologicalConcepts.length > 0 && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs">
              Theological Concepts
            </Badge>
          )}
          {day.reflectionQuestions && day.reflectionQuestions.length > 0 && (
            <Badge variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-xs">
              Reflection Questions
            </Badge>
          )}
        </div>
        
        {/* Progress indicator */}
        {isCompleted && (
          <div className="mt-3 pt-2 border-t border-[#2c4c3b]/10 dark:border-[#2c4c3b]/30 flex items-center text-xs text-[#2c4c3b] dark:text-green-300 font-medium">
            <Check className="h-3.5 w-3.5 mr-1.5" />
            Completed
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DayCard;