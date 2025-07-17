export function LoadingContent() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-12 h-12 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-r-orange-300 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <div className="text-gray-500 text-sm animate-pulse">Loading wallet...</div>
      </div>
    </div>
  )
}
