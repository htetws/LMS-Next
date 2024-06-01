import NavbarRoutes from "@/components/navbar-routes";
import { Chapter, Course, userProgress } from "@prisma/client";
import CourseMobileSidebar from "./course-mobile-sidebar";

interface ICourseNavbar {
  course: Course & {
    chapters: (Chapter & { userProgresses: userProgress[] | null })[];
  };
  progressCount: number;
}

const CourseNavbar = ({ course, progressCount }: ICourseNavbar) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;
