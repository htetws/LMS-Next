"use client";

import ConfirmModal from "@/components/modal/confirm-model";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface CourseActionsProps {
  course: Course & { chapters: Chapter[] };
  courseId: string;
  disabled: boolean;
  isPublished: boolean;
}

const CourseActions: FC<CourseActionsProps> = ({
  course,
  courseId,
  disabled,
  isPublished,
}) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isPending, startTransition] = useState<boolean>(false);

  const onClick = async () => {
    try {
      if (!isPublished) {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course published");
        confetti.onOpen();
      } else {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course unpublished");
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.response.data.message || "Something went wrong!");
    }
  };

  const onDelete = async () => {
    startTransition(true);
    try {
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Chapter deleted.");
      router.refresh();
      router.push(`/teacher/courses`);
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

export default CourseActions;
