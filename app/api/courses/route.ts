import * as z from "zod";
import { NextRequest, NextResponse } from "next/server";
import { titleSchema } from "@/util/validation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  try {
    const validatedValue = titleSchema.safeParse(await req.json());

    if (!validatedValue.success) {
      return new NextResponse("Invalid data!", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }

    const { title } = validatedValue.data;

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);

    return new NextResponse("Internal error!", { status: 500 });
  }
}
