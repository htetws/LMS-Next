import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

interface ICourses {
  userId: string;
  title?: string;
  categoryId?: string;
}

export type courseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: Omit<Chapter, Exclude<keyof Chapter, "id">>[]; //only id.
  progress: number | null;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: ICourses): Promise<courseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: { contains: title },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: { isPublished: true },
          select: { id: true },
        },
        purchases: {
          where: { userId },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: courseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return { ...course, progress: null };
          }

          const userProgress = await getProgress(userId, course.id);
          return { ...course, progress: userProgress };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET-COURSES]", error);
    return [];
  }
};
