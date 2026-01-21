export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#FFD7BA] rounded-full animate-spin border-t-[#FF6B35]" />
      </div>
    </div>
  );
}