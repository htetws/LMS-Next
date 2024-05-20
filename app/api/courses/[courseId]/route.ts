import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface IParams {
  params: {
    courseId: string;
  };
}

export async function PATCH(req: Request, { params: { courseId } }: IParams) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: values,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSEID]", error);
    return new NextResponse("Internal error!", { status: 500 });
  }
}
