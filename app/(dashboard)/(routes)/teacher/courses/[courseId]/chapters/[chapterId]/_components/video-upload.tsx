"use client";

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Chapter } from "@prisma/client";
import { videoSchema } from "@/utils/validation";
import { FileUpload } from "@/components/file-upload";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

interface VideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const VideoForm = ({ initialData, courseId, chapterId }: VideoFormProps) => {
  const router = useRouter();
  const [isEditting, setIsEditting] = useState<boolean>(false);

  const toggleEdit = () => setIsEditting((prev) => !prev);

  const onSubmit = async (value: z.infer<typeof videoSchema>) => {
    try {
      if (initialData.videoUrl) {
        await axios.delete("/api/uploadthing", {
          data: { url: initialData.videoUrl },
        });
      }

      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        value
      );
      toggleEdit();
      toast.success("Course image updated.");
      router.refresh();
    } catch (err: any) {
      toast.error(err.response.data || "Something went wrong!");
    }
  };

  return (
    <div className="mt-6 border p-4 rounded-md bg-slate-100">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditting && <>Cancel</>}
          {!isEditting && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an video
            </>
          )}
          {!isEditting && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditting &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="w-10 h-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <video
              src={initialData.videoUrl}
              className="w-full h-full"
              controls
            />
          </div>
        ))}
      {isEditting && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}

      {!isEditting && initialData.videoUrl && (
        <div className="text-xs mt-4 text-muted-foreground">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};

export default VideoForm;
