import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import CourseSidebar from "./course-sidebar";
import { Chapter, Course, userProgress } from "@prisma/client";

interface ICourseMobileSidebar {
  course: Course & {
    chapters: (Chapter & { userProgresses: userProgress[] | null })[];
  };
  progressCount: number;
}

const CourseMobileSidebar = ({
  course,
  progressCount,
}: ICourseMobileSidebar) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden mr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white border-0">
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
