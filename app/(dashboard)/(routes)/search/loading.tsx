"use client";

import { Skeleton } from "@/components/ui/skeleton";

const SearchPageLoading = () => {
  return (
    <div className="p-6 space-y-7">
      <div className="flex flex-row gap-x-2">
        {Array.from({ length: 7 }).map((_, idx) => (
          <Skeleton
            key={idx}
            className="min-w-[130px] h-[35px] bg-slate-100 shadow-sm rounded-full"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="w-full relative aspect-video">
          <Skeleton className="w-full h-[280px] bg-slate-100 rounded-md shadow-sm" />
        </div>
      </div>
    </div>
  );
};

export default SearchPageLoading;
