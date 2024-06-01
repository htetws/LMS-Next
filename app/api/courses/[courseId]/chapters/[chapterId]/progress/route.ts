import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  {
    params: { courseId, chapterId },
  }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { message: "Chapter not found!" },
        { status: 404 }
      );
    }

    const { isCompleted } = await req.json();

    await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId: chapter.id,
        isCompleted: true,
      },
    });

    return NextResponse.json({ message: "Progress updated" }, { status: 200 });
  } catch (error: any) {
    console.log("[COURSE_PROGRESS]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
};
