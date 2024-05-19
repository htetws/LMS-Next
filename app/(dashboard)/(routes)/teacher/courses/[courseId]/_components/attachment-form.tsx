"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Attachment, Course } from "@prisma/client";
import { attachmentSchema } from "@/utils/validation";
import { FileUpload } from "@/components/file-upload";

import { Button } from "@/components/ui/button";
import { File, Loader2, Pencil, PlusCircle, X } from "lucide-react";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const router = useRouter();
  const [isEditting, setIsEditting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditting((prev) => !prev);

  const onSubmit = async (value: z.infer<typeof attachmentSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, value);
      toggleEdit();
      toast.success("Course attachment updated.");
      router.refresh();
    } catch (err: any) {
      toast.error(err.response.data || "Something went wrong!");
    }
  };

  const onDelete = async (id: string, url: string) => {
    try {
      setDeletingId(id);

      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      await axios.delete("/api/uploadthing", { data: { url } });

      router.refresh();
      toast.success("Deleted attachment!");
    } catch (err: any) {
      toast.error(err.response.data || "Something went wrong!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border p-4 rounded-md bg-slate-100">
      <div className="font-medium flex items-center justify-between">
        Course attachment
        <Button onClick={toggleEdit} variant="ghost">
          {isEditting && <>Cancel</>}
          {!isEditting && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an attachment
            </>
          )}
          {!isEditting && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit attachment
            </>
          )}
        </Button>
      </div>

      {!isEditting && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachment yet
            </p>
          )}

          {initialData.attachments.length > 0 &&
            initialData.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex  items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md my-1"
              >
                <File className="w-4 h-4 mr-2 text-sky-700 rounded-md" />
                <p className="text-xs line-clamp-1">{attachment.name}</p>

                {deletingId === attachment.id && (
                  <Loader2 className="w-4 h-4 ml-auto animate-spin" />
                )}

                {deletingId !== attachment.id && (
                  <button
                    className="ml-auto"
                    onClick={() => onDelete(attachment.id, attachment.url)}
                  >
                    <X className="w-4 h-4 hover:text-destructive" />
                  </button>
                )}
              </div>
            ))}
        </>
      )}
      {isEditting && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
