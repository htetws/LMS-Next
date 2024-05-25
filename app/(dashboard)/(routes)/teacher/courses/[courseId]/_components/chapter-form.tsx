"use client";

import axios from "axios";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { chapterSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type Chapter, Course } from "@prisma/client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChapterLists from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/chapter-list";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ChapterFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const toggleCreate = () => setIsCreating((prev) => !prev);

  const form = useForm<z.infer<typeof chapterSchema>>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof chapterSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, value);
      toggleCreate();
      form.reset();
      router.refresh();
      toast.success("Chapter uploaded.");
    } catch (err: any) {
      toast.error(err.response.data || "Something went wrong!");
    }
  };

  const onReorder = async (updatedData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        lists: updatedData,
      });
      toast.success("Reordered.");
    } catch (err: any) {
      toast.error(err.response.data || "Something went wrong!");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = async (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="mt-6 border p-4 rounded-md bg-slate-100 relative">
      {isUpdating && (
        <div className="absolute cursor-wait bg-slate-500/20 inset-0 rounded-md flex justify-center items-center">
          <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
        </div>
      )}

      <div className="font-medium flex items-center justify-between">
        Course chapter
        <Button onClick={toggleCreate} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={!isValid || isSubmitting} type="submit">
              Save
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && "italic text-slate-500"
          )}
        >
          {!initialData.chapters.length && "No chapters"}
          {/** todo : list of chapter */}
          <ChapterLists
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag & drop to reorder the chapters
        </p>
      )}
    </div>
  );
};

export default ChapterForm;
