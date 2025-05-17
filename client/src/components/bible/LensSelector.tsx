import { cn } from "@/lib/utils";

interface LensSelectorProps {
  selectedLens: string;
  onSelectLens: (lens: string) => void;
}

const lenses = [
  { id: "standard", label: "Standard" },
  { id: "catholic", label: "Catholic" },
  { id: "evangelical", label: "Evangelical" },
  { id: "jewish", label: "Jewish" },
  { id: "genz", label: "Gen-Z" },
  { id: "kids", label: "Kids" }
];

export default function LensSelector({ selectedLens, onSelectLens }: LensSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="px-4 sm:px-6">
          <nav 
            className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide" 
            aria-label="Commentary Lenses"
          >
            {lenses.map((lens) => (
              <button
                key={lens.id}
                onClick={() => onSelectLens(lens.id)}
                className={cn(
                  "font-medium pb-2 px-1 whitespace-nowrap border-b-2 transition-colors",
                  selectedLens === lens.id
                    ? "text-primary-dark border-primary-dark"
                    : "text-gray-500 hover:text-primary-dark border-transparent hover:border-gray-300"
                )}
              >
                {lens.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
