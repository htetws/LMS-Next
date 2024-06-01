import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { Chapter, Course } from "@prisma/client";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/preview";
import { Suspense } from "react";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/course-progress-button";

interface ICourseChapterPage {
  params: {
    courseId: Course["id"];
    chapterId: Chapter["id"];
  };
}

const CourseChapterPage = async ({
  params: { courseId, chapterId },
}: ICourseChapterPage) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const {
    course,
    chapter,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({ userId, courseId, chapterId });

  if (!chapter) return redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = purchase && !userProgress;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner label="You need to purchase this course to watch this chapter!" />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd || false}
          />
        </div>

        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course?.price} />
            )}
          </div>

          <Separator />

          <div>
            <Preview value={chapter.description || ""} />
          </div>
          {!!attachments?.length && (
            <>
              <Separator />
              <div className="p-4 space-y-2">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    className="flex items-center p-3 w-full border-s-sky-200 border text-sky-700 rounded-md hover:underline"
                    key={attachment.id}
                  >
                    <File className="w-6 h-6 mr-2" />
                    <p className="">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseChapterPage;
