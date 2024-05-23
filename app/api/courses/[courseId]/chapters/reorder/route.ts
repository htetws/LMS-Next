import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface IParams {
  params: { courseId: string };
}

export async function PUT(req: Request, { params }: IParams) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }
    const { lists } = await req.json();
    const { courseId } = params;

    const isCourseOwner = await db.course.findUnique({
      where: {
        userId,
        id: courseId,
      },
    });

    if (!isCourseOwner) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    for (const list of lists) {
      const { id, position } = list;
      await db.chapter.update({ where: { id }, data: { position } });
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("INTERNAL_ERROR", { status: 500 });
  }
}
