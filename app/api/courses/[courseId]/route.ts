import { UTApi } from "uploadthing/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

interface IParams {
  params: {
    courseId: string;
  };
}

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated!" },
        { status: 401 }
      );
    }

    const isCourse = await db.course.findUnique({
      where: {
        userId,
        id: courseId,
      },
      include: {
        chapters: {
          include: { muxDatas: true },
        },
        attachments: true,
      },
    });

    if (!isCourse) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const utapi = new UTApi();

    if (isCourse.chapters.length) {
      for (const { videoUrl, muxDatas } of isCourse.chapters) {
        const url = videoUrl?.substring(videoUrl.lastIndexOf("/") + 1);

        //remove : uploadthing
        await utapi.deleteFiles(url!);

        //remove : Mux
        await video.assets.delete(muxDatas?.assetId!);
      }
    }

    const { imageUrl, ...rest } = isCourse;

    const courseImageUrl = imageUrl?.substring(imageUrl.lastIndexOf("/") + 1); //rm course image
    utapi.deleteFiles(courseImageUrl!);

    if (rest.attachments.length) {
      for (const attachement of rest.attachments) {
        const attchUrl = attachement.url.substring(
          attachement.url.lastIndexOf("/") + 1
        );

        await utapi.deleteFiles(attchUrl);
      }
    }

    await db.course.delete({
      where: { id: isCourse.id },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log("[COURSE_DELETE]", error);
    return NextResponse.json({ message: "Internal error!" }, { status: 500 });
  }
}
