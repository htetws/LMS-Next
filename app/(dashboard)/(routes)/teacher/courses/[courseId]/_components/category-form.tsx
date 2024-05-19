"use client";

import axios from "axios";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { categorySchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type Course } from "@prisma/client";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const router = useRouter();
  const [isEditting, setIsEditting] = useState<boolean>(false);

  const toggleEdit = () => setIsEditting((prev) => !prev);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  const onSubmit = async (value: z.infer<typeof categorySchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, value);
      toggleEdit();
      router.refresh();
      toast.success("Course category updated.");
    } catch (err: any) {
      toast.error(err.response.data || "Something went wrong!");
    }
  };

  return (
    <div className="mt-6 border p-4 rounded-md bg-slate-100">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditting ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>

      {!isEditting && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.categoryId && "italic text-slate-500"
          )}
        >
          {selectedOption?.label || "No category"}
        </p>
      )}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
                  </FormControl>
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

export default CategoryForm;
