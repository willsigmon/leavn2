import { Bubble } from "@/components/ui/bubble";

interface DenominationCardProps {
  lens: string;
  content: string;
}

export default function DenominationCard({ lens, content }: DenominationCardProps) {
  const lensLabels: Record<string, string> = {
    catholic: "CATHOLIC PERSPECTIVE",
    evangelical: "EVANGELICAL PERSPECTIVE",
    jewish: "JEWISH PERSPECTIVE",
    genz: "GEN-Z PERSPECTIVE",
    kids: "KIDS PERSPECTIVE"
  };

  return (
    <Bubble
      heading={lensLabels[lens] || "PERSPECTIVE"}
      variant="default"
      className="mt-4"
      icon={
        <img 
          src="https://pixabay.com/get/g6d790696242aecbcc6b334ec66688081ec153fa01148be84988554709e33328bc26d35a742ebeba784eb2afc3c27e79b75455e97e6167a4a48111e9bbd44a40b_1280.jpg" 
          className="w-4 h-4 rounded-full" 
          alt={`${lens} perspective icon`}
        />
      }
    >
      <p className="text-sm text-gray-700">{content}</p>
    </Bubble>
  );
}
