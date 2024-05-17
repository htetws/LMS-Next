import { Menu } from "lucide-react";
import Sidebar from "@/app/(dashboard)/_components/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileSidbar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 transition hover:opacity-75">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidbar;
