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

    await db.course.update({
      where: { id: isCourse.id },
      data: { isPublished: false },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log("[COURSE-PUBLISH]", error);
    return NextResponse.json({ message: "Internal error!" }, { status: 500 });
  }
};
