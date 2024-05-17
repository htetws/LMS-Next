"use server";

import { titleSchema } from "@/util/validation/index";
import * as z from "zod";

export const createCourse = async (value: z.infer<typeof titleSchema>) => {
  const validatedValue = titleSchema.safeParse(value);
  if (!validatedValue.success) return { error: "Invalid course's title!" };

  const { title } = validatedValue.data;

  return { success: { data: { title } } };
};
