"use client";

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Course } from "@prisma/client";
import { imageSchema } from "@/utils/validation";
import { FileUpload } from "@/components/file-upload";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter();
  const [isEditting, setIsEditting] = useState<boolean>(false);

  const toggleEdit = () => setIsEditting((prev) => !prev);

  const onSubmit = async (value: z.infer<typeof imageSchema>) => {
    try {
      if (initialData.imageUrl) {
        await axios.delete("/api/uploadthing", {
          data: { url: initialData.imageUrl },
        });
      }

      await axios.patch(`/api/courses/${courseId}`, value);
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
        Course Image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditting && <>Cancel</>}
          {!isEditting && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditting && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditting &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="w-10 h-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              fill
              priority
              alt="upload"
              src={initialData.imageUrl}
              className="object-cover rounded-md"
            />
          </div>
        ))}
      {isEditting && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
