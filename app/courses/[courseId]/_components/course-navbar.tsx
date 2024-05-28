import NavbarRoutes from "@/components/navbar-routes";
import { Chapter, Course, userProgress } from "@prisma/client";

interface ICourseNavbar {
  course: Course & {
    chapters: (Chapter & { userProgresses: userProgress[] | null })[];
  };
  progressCount: number;
}

const CourseNavbar = ({ course, progressCount }: ICourseNavbar) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;
