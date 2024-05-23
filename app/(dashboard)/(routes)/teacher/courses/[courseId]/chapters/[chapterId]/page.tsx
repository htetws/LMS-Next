import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { IconBadge } from "@/components/icon-badge";
import { redirect } from "next/navigation";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import ChapterTitle from "./_components/chapter-title";
import ChapterDescription from "./_components/chapter-description";
import ChapterAccess from "./_components/chapter-access";
import VideoForm from "./_components/video-upload";
import { Banner } from "@/components/banner";
import ChapterActions from "./_components/chapter-actions";

interface ChapterProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const ChapterPage = async ({ params }: ChapterProps) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const { courseId, chapterId } = params;
  const isOwnCourse = await db.course.findUnique({
    where: { userId, id: courseId },
  });

  if (!isOwnCourse) return redirect("/");

  const chapter = await db.chapter.findFirst({
    where: { id: chapterId },
    include: { muxDatas: true },
  });

  if (!chapter) return redirect("/");

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${requiredFields.length})`;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner label="This chapter is unpublished. It will not be visible in the course!" />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>

              <ChapterActions
                disabled={!isCompleted}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
                chapter={chapter}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapters</h2>
              </div>

              <ChapterTitle
                courseId={courseId}
                chapterId={chapter.id}
                initialData={chapter}
              />

              <ChapterDescription
                courseId={courseId}
                chapterId={chapterId}
                initialData={chapter}
              />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access settings</h2>
              </div>

              <ChapterAccess
                courseId={courseId}
                chapterId={chapterId}
                initialData={chapter}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl">Add a video</h2>
              </div>

              <VideoForm
                courseId={courseId}
                chapterId={chapter.id}
                initialData={chapter}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterPage;
