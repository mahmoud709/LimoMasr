export default function AdminLoading() {
  return (
    <div className="flex-1 p-8 lg:px-12 xl:px-16 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-10">
        <div className="h-8 w-48 bg-gray-200 rounded-md mb-3"></div>
        <div className="h-4 w-72 bg-gray-100 rounded-md"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0"></div>
              <div className="space-y-2">
                <div className="h-7 w-16 bg-gray-200 rounded-md"></div>
                <div className="h-3 w-20 bg-gray-100 rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Breakdown Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0"></div>
            <div className="space-y-2">
              <div className="h-5 w-12 bg-gray-200 rounded-md"></div>
              <div className="h-3 w-16 bg-gray-100 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table Skeleton */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-16 bg-gray-100 rounded-md"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
              <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-24 bg-gray-100 rounded-md"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-28 bg-gray-100 rounded-md"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
