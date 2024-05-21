"use client";

import axios from "axios";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { freeSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type Chapter } from "@prisma/client";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Editor from "@/components/editor";
import Preview from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessProps {
  courseId: string;
  chapterId: string;
  initialData: Chapter;
}

const ChapterAccess = ({
  courseId,
  chapterId,
  initialData,
}: ChapterAccessProps) => {
  const router = useRouter();
  const [isEditting, setIsEditting] = useState<boolean>(false);

  const toggleEdit = () => setIsEditting((prev) => !prev);

  const form = useForm<z.infer<typeof freeSchema>>({
    resolver: zodResolver(freeSchema),
    defaultValues: {
      isFree: initialData.isFree,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof freeSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        value
      );
      toggleEdit();
      router.refresh();
      toast.success("Chapter description updated.");
    } catch (err: any) {
      toast.error(err.response.data || "Something went wrong!");
    }
  };

  return (
    <div className="mt-6 border p-4 rounded-md bg-slate-100">
      <div className="font-medium flex items-center justify-between">
        Chapter access
        <Button onClick={toggleEdit} variant="ghost">
          {isEditting ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit access
            </>
          )}
        </Button>
      </div>

      {!isEditting && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.isFree && "italic text-slate-500"
          )}
        >
          {initialData.isFree
            ? "This chapter is for free to preview"
            : "This chapter is not free"}
        </p>
      )}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              name="isFree"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border pt-5 pb-4 px-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-[0]">
                    <FormLabel className="">
                      Check this box if you want to make this chapter free for
                      preview.
                    </FormLabel>
                    <FormDescription className="text-xs">
                      You can change access setting by later.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterAccess;
