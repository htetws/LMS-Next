import { Button, buttonVariants } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}