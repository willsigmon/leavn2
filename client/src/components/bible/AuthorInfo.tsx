import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthorInfoProps {
  book: string;
}

export default function AuthorInfo({ book }: AuthorInfoProps) {
  const { data: authorInfo, isLoading } = useQuery({
    queryKey: [`/api/author/${book.toLowerCase()}`],
  });

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!authorInfo) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-4">
        {authorInfo.imageUrl && (
          <img
            src={authorInfo.imageUrl}
            alt={`Representation of ${authorInfo.name || 'the author'}`}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h3 className="font-serif font-bold text-lg">About the Book of {book}</h3>
          <p className="text-gray-600 text-sm mt-1">
            {authorInfo.description}
          </p>
        </div>
      </div>
    </div>
  );
}
