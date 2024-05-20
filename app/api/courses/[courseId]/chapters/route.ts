import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface IParams {
  params: { courseId: string };
}

export async function POST(req: Request, { params }: IParams) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const { courseId } = params;
    const { title } = await req.json();

    const isCourseOwner = await db.course.findUnique({
      where: {
        userId,
        id: courseId,
      },
    });

    if (!isCourseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newChapter = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: newChapter,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTER-CREATE-ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
