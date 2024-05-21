import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ChapterProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export async function PATCH(
  req: Request,
  { params: { courseId, chapterId } }: ChapterProps
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }

    const isOwner = await db.course.findUnique({
      where: {
        userId,
        id: courseId,
      },
    });

    if (!isOwner) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const { isPublished, ...values } = await req.json();

    const chapter = await db.chapter.update({
      where: { id: chapterId },
      data: values,
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("CHAPTER-UPDATE", error);
    return new NextResponse("Internal error!", { status: 500 });
  }
}
