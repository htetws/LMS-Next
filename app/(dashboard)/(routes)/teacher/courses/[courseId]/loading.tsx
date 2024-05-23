import { Skeleton } from "@/components/ui/skeleton";
import { Circle } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-[250px] my-2" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-[250px] ml-2" />
            </div>

            <Skeleton className="h-[100px] w-full rounded-md my-6" />
            <Skeleton className="h-[100px] w-full rounded-md my-6" />
            <Skeleton className="h-[500px] w-full rounded-md my-6" />
            <Skeleton className="h-[100px] w-full rounded-md my-6" />
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-[250px] ml-2" />
            </div>

            <Skeleton className="h-[130px] w-full rounded-md my-6" />

            <div className="flex items-center gap-x-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-[250px] ml-2" />
            </div>

            <Skeleton className="h-[100px] w-full rounded-md my-6" />

            <div className="flex items-center gap-x-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-[250px] ml-2" />
            </div>

            <Skeleton className="h-[105px] w-full rounded-md my-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
