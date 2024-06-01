import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Course } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/course-sidebar";
import CourseNavbar from "./_components/course-navbar";

interface ICourseLayout {
  children: React.ReactNode;
  params: { courseId: Course["id"] };
}

const CourseLayout = async ({
  children,
  params: { courseId },
}: ICourseLayout) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgresses: {
            where: {
              userId,
              isCompleted: true,
            },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) return redirect("/");

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-full">
      <div className="h-[80px] fixed w-full inset-y-0 md:pl-80 z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 h-full pt-[80px]">{children}</main>
    </div>
  );
};

export default CourseLayout;
