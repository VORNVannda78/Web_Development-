export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
      {/* Image placeholder */}
      <div className="bg-gray-200" style={{ height: 160 }} />

      {/* Body */}
      <div className="p-3 pb-3.5 space-y-2">
        {/* Name + rating row */}
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 bg-gray-200 rounded-md flex-1" />
          <div className="h-4 w-12 bg-gray-200 rounded-md flex-shrink-0" />
        </div>
        {/* Cuisines */}
        <div className="h-3 bg-gray-100 rounded-md w-3/4" />
        {/* Delivery info */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-3 bg-gray-100 rounded-md w-16" />
          <div className="h-3 bg-gray-100 rounded-md w-20" />
          <div className="h-3 bg-gray-100 rounded-md w-14" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
