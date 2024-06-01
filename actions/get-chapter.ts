import { db } from "@/lib/db";
import {
  Attachment,
  Chapter,
  muxData,
  Purchase,
  userProgress,
} from "@prisma/client";

interface IChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

type ChapterWithData = {
  course: { price: number | null } | null;
  chapter: Chapter | null;
  muxData: muxData | null;
  attachments: Attachment[] | null;
  nextChapter: Chapter | null;
  userProgress: userProgress | null;
  purchase: Purchase | null;
};

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: IChapterProps): Promise<ChapterWithData> => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        price: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, isPublished: true },
    });

    if (!course || !chapter) {
      throw new Error("Course or chapter not found!");
    }

    let muxData: muxData | null = null;
    let nextChapter: Chapter | null = null;
    let attachments: Attachment[] | null = null;

    if (purchase || chapter.isFree) {
      muxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: { courseId },
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      course,
      chapter,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("[GET-CHAPTER]", error);
    return {
      course: null,
      chapter: null,
      muxData: null,
      attachments: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
