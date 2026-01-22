export function HotelLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo.jpg"
        alt="HOTEL"
        className="h-8 w-auto object-contain"
      />
    </div>
  );
}

