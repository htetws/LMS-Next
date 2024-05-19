import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { courseId: string; attachmentId: string };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const { courseId, attachmentId } = params;

    const isCourseOwner = await db.attachment.findUnique({
      where: {
        courseId: courseId,
        id: attachmentId,
        course: {
          userId,
        },
      },
    });

    if (!isCourseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.attachment.delete({
      where: {
        id: isCourseOwner.id,
      },
    });

    return NextResponse.json("ATTACHMENT DELETED");
  } catch (err) {
    console.log("ATTACHMENT-DELETE", err);
    return new NextResponse("Internal Error!", { status: 500 });
  }
}
