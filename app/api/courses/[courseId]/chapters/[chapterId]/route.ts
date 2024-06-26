import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface ChapterProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: { id: existingMuxData.id },
        });
      }

      const asset = await video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        encoding_tier: "baseline",
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          chapterId: chapter.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("CHAPTER-UPDATE", error);
    return new NextResponse("Internal error!", { status: 500 });
  }
}

export const DELETE = async (req: Request, { params }: ChapterProps) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated!" },
        { status: 401 }
      );
    }

    const { courseId, chapterId } = params;

    const isChapterOwner = await db.chapter.findUnique({
      where: { id: chapterId, courseId, course: { userId } },
      include: {
        muxDatas: true,
      },
    });

    if (!isChapterOwner) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    if (isChapterOwner.videoUrl) {
      await video.assets.delete(isChapterOwner.muxDatas?.assetId!);
    }

    await db.chapter.delete({ where: { id: isChapterOwner.id } });

    //Todo : if there is no atleast chapter that in not published . So , we need to unpublish the course again !

    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error("CHAPTER-DELETE", err);
    return NextResponse.json({ message: "Internal error!" }, { status: 500 });
  }
};
