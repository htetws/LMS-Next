"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ICourseProgressButton {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}

const CourseProgressButton = ({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}: ICourseProgressButton) => {
  const Icon = isCompleted ? XCircle : CheckCircle;
  const confetti = useConfettiStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onNext = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress updated");
      router.refresh();
    } catch (error) {
      console.log("ON_NEXT", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onNext}
      disabled={isLoading}
      variant={isCompleted ? "outline" : "success"}
    >
      {isCompleted ? "Not completed" : "Mark as complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;
