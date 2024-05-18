import { db } from "@/lib/db";
import { titleSchema } from "@/util/validation";
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
    const data = await req.json();
    const validatedValue = titleSchema.safeParse(data);

    if (!userId) {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }

    if (!validatedValue.success) {
      return new NextResponse("Invalid title!", { status: 400 });
    }

    const values = validatedValue.data;

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
