import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated!" },
        { status: 401 }
      );
    }

    const { courseId, chapterId } = params;

    const hasChapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId, course: { userId } },
      include: { muxDatas: true },
    });

    if (!hasChapter) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const hasAllFields = [
      hasChapter,
      hasChapter.title,
      hasChapter.description,
      hasChapter.videoUrl,
      hasChapter.muxDatas,
    ];

    if (!hasAllFields.every(Boolean)) {
      return NextResponse.json(
        { message: "Required field to publish!" },
        { status: 400 }
      );
    }

    await db.chapter.update({
      where: { id: hasChapter.id },
      data: { isPublished: true },
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("[CHAPTER-PUBLISH]", error);
    return NextResponse.json({ message: "Internal error!" }, { status: 500 });
  }
};
