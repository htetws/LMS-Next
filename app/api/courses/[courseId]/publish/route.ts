import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated!" },
        { status: 401 }
      );
    }

    const { courseId } = params;

    const isCourse = await db.course.findUnique({
      where: { id: courseId, userId },
      include: { chapters: true },
    });

    if (!isCourse) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const requiredFields = [
      isCourse.title,
      isCourse.description,
      isCourse.imageUrl,
      isCourse.categoryId,
      isCourse.price,
      isCourse.chapters.some((chapter) => chapter.isPublished),
    ];

    if (!requiredFields.every(Boolean)) {
      return NextResponse.json({ message: "Required field!" }, { status: 400 });
    }

    await db.course.update({
      where: { id: isCourse.id },
      data: { isPublished: true },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log("[COURSE-PUBLISH]", error);
    return NextResponse.json({ message: "Internal error!" }, { status: 500 });
  }
};
