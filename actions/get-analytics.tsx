import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type purchaseWithCourse = Purchase & {
  course: Course;
};

type analytics = {
  data: { name: string; total: number }[];
  totalRevenues: number;
  totalSales: number;
};

export const groupByEarning = async (purchases: purchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {}; //Record<string,number>

  for (let purchase of purchases) {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += purchase.course.price!;
  }

  return grouped;
};

export const getAnalytics = async (userId: string): Promise<analytics> => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupEarning = await groupByEarning(purchases);
    const data = Object.entries(groupEarning).map(([courseTitle, total]) => ({
      name: courseTitle,
      total,
    }));

    const totalRevenues = data.reduce((acc, cur) => acc + cur.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenues,
      totalSales,
    };
  } catch (error) {
    console.error("[Get-Analytics]", error);
    return {
      data: [],
      totalRevenues: 0,
      totalSales: 0,
    };
  }
};
