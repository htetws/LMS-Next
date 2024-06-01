import { db } from "@/lib/db";
import { Course } from "@prisma/client";
import { redirect } from "next/navigation";

interface ICoursePage {
  params: { courseId: Course["id"] };
}

const CoursePage = async ({ params: { courseId } }: ICoursePage) => {
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/");

  return redirect(`/courses/${courseId}/chapters/${course.chapters?.[0]?.id}`);
};

export default CoursePage;
