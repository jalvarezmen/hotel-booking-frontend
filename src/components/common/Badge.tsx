import { ReservationStatus } from '../../services/types';

interface BadgeProps {
  status: ReservationStatus;
  children: React.ReactNode;
}

const statusColors: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'bg-[#FFD7BA]/40 text-[#FF6B35] border-[#FF6B35]/30',
  [ReservationStatus.CONFIRMED]: 'bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/30',
  [ReservationStatus.ACTIVE]: 'bg-[#8B7355]/10 text-[#8B7355] border-[#8B7355]/30',
  [ReservationStatus.COMPLETED]: 'bg-[#D4C5B0]/30 text-[#8B7355] border-[#D4C5B0]',
  [ReservationStatus.CANCELLED]: 'bg-red-50 text-red-700 border-red-200',
  [ReservationStatus.EXPIRED]: 'bg-[#E8DED0] text-[#8B7355] border-[#D4C5B0]',
};

export function Badge({ status, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}
    >
      {children}
    </span>
  );
}