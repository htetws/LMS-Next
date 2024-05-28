"use client";

import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="ml-auto flex gap-x-2">
        {isTeacherPage || isCoursePage ? (
          <Button size="sm" variant="ghost" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Link>
          </Button>
        ) : (
          <Link
            href="/teacher/courses"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Teacher mode
          </Link>
        )}

        <ClerkLoading>
          <div className="bg-slate-200 w-7 h-7 rounded-full" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton />
        </ClerkLoaded>
      </div>
    </>
  );
};

export default NavbarRoutes;
