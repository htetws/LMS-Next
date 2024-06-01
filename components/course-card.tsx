"use client";

import { courseWithProgressWithCategory } from "@/actions/get-courses";
import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./course-progress";

const CourseCard = ({ item }: { item: courseWithProgressWithCategory }) => {
  return (
    <Link href={`/courses/${item.id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image alt={item.title} fill src={item.imageUrl || ""} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {item.title}
          </div>
          <p className="text-xs text-muted-foreground">{item.category?.name}</p>
          <div className="flex items-center gap-x-2 text-sm md:text-sm my-3">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge icon={BookOpen} size="sm" />
              <span>
                {item.chapters.length}
                {item.chapters.length ? " Chapters" : " Chapter"}
              </span>
            </div>
          </div>
        </div>
        {item.progress !== null ? (
          <CourseProgress
            size="sm"
            value={item.progress}
            variant={item.progress === 100 ? "success" : "default"}
          />
        ) : (
          <p className="text-md md:text-sm font-medium text-slate-700">
            {formatPrice(item.price || 0)}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
