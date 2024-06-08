import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type courseWithCategoryAndProgress = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type dashboardCourses = {
  completedCourses: courseWithCategoryAndProgress[];
  courseInProgress: courseWithCategoryAndProgress[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<dashboardCourses> => {
  try {
    const courses = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const formatCourses = courses.map(
      (course) => course.course
    ) as courseWithCategoryAndProgress[];

    for (let course of formatCourses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    const completedCourses = formatCourses.filter(
      (course) => course.progress === 100
    );

    const courseInProgress = formatCourses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses: completedCourses,
      courseInProgress: courseInProgress,
    };
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      courseInProgress: [],
    };
  }
};
