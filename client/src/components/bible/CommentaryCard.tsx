import { Bubble } from "@/components/ui/bubble";

interface CommentaryCardProps {
  content: string;
}

export default function CommentaryCard({ content }: CommentaryCardProps) {
  return (
    <Bubble 
      heading="COMMENTARY" 
      variant="primary" 
      className="mt-4"
    >
      <p className="text-primary-dark">{content}</p>
    </Bubble>
  );
}
