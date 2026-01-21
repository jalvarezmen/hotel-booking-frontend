import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'orange' | 'beige' | 'brown';
}

const colorClasses = {
  orange: 'bg-gradient-to-br from-[#FF6B35]/10 to-[#FF8C42]/10 text-[#FF6B35]',
  beige: 'bg-gradient-to-br from-[#D4C5B0]/20 to-[#E8DED0]/20 text-[#8B7355]',
  brown: 'bg-gradient-to-br from-[#8B7355]/10 to-[#D4C5B0]/10 text-[#8B7355]',
};

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#D4C5B0]/30 p-6 hover:shadow-lg hover:shadow-[#FF6B35]/10 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#8B7355]">{title}</p>
          <p className="text-2xl font-bold text-[#3E2723] mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}