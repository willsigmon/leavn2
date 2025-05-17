import { Bubble } from "@/components/ui/bubble";
import { FaLightbulb } from "react-icons/fa";

interface DidYouKnowProps {
  content: string;
}

export default function DidYouKnow({ content }: DidYouKnowProps) {
  return (
    <Bubble
      heading="Did you know?"
      variant="accent"
      className="my-4"
      icon={<FaLightbulb className="text-accent" />}
    >
      <p className="text-sm text-gray-700">{content}</p>
    </Bubble>
  );
}
