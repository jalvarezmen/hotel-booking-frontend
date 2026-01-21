import { Construction } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  description: string;
}

export function PlaceholderView({ title, description }: PlaceholderViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[600px] bg-white rounded-xl border-2 border-dashed border-[#D4C5B0]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35]/10 to-[#FF8C42]/10 mb-4">
          <Construction className="w-8 h-8 text-[#FF6B35]" />
        </div>
        <h2 className="text-xl font-semibold text-[#3E2723] mb-2">{title}</h2>
        <p className="text-[#8B7355] max-w-md">{description}</p>
      </div>
    </div>
  );
}