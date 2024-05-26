"use client";

import ConfirmModal from "@/components/modal/confirm-model";
import { Button } from "@/components/ui/button";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
  chapter?: Chapter;
}

const ChapterActions: FC<ChapterActionsProps> = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
  chapter,
}) => {
  const [isPending, startTransition] = useState<boolean>(false);
  const router = useRouter();

  const onClick = async () => {
    try {
      if (!isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success("Chapter published");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success("Chapter unpublished");
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.response.data.message || "Something went wrong!");
    }
  };

  const onDelete = async () => {
    startTransition(true);
    try {
      if (chapter?.videoUrl) {
        await axios.delete("/api/uploadthing", {
          data: { url: chapter?.videoUrl },
        });
      }

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success("Chapter deleted.");
      router.push(`/teacher/courses/${courseId}`);
      router.refresh();
    } catch (err: any) {
      console.log(err);

      toast.error(err.response.data.message || "Something went wrong!");
    } finally {
      startTransition(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={onClick} disabled={disabled} variant="outline" size="sm">
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isPending} size="sm">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
