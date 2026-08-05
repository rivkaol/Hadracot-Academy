export default function SkeletonGallery() {
  return (
    <div dir="rtl" className="flex-1 font-sans bg-[#FAF7F2] text-[#3E3935]">
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm h-20 flex items-center px-4 sm:px-8">
        <div className="skeleton-shimmer h-10 w-48 rounded-md"></div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="skeleton-shimmer h-48 w-full rounded-[2rem] mb-12"></div>
        <div className="flex gap-4 mb-8">
          <div className="skeleton-shimmer h-8 w-24 rounded-md"></div>
          <div className="skeleton-shimmer h-8 w-32 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 h-72 border border-gray-100 shadow-sm flex flex-col">
              <div className="skeleton-shimmer rounded-xl h-36 w-full mb-4"></div>
              <div className="skeleton-shimmer h-5 rounded w-3/4 mb-2"></div>
              <div className="skeleton-shimmer h-4 rounded w-1/2"></div>
              <div className="mt-auto flex justify-end">
                <div className="skeleton-shimmer h-8 rounded-full w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
