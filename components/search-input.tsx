"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const debounce = useDebounce(value);

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const query = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debounce,
          categoryId: currentCategoryId,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(query);
  }, [currentCategoryId, pathname, debounce, router]);

  return (
    <div className="relative">
      <Search className="w-4 h-4 absolute top-3 left-3 text-slate-600" />
      <Input
        type="search"
        placeholder="Search for a course"
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-[300px] rounded-full bg-slate-100 focus-visible:ring-slate-100 pl-9"
      />
    </div>
  );
};

export default SearchInput;
