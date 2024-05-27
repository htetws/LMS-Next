"use client";
import { courseWithProgressWithCategory } from "@/actions/get-courses";
import CourseCard from "./course-card";

interface ICoursesList {
  items: courseWithProgressWithCategory[];
}

const CoursesList = ({ items }: ICoursesList) => {
  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard key={item.id} item={item} />
        ))}
      </div>
      <div>
        {!items.length && (
          <div className="text-center text-muted-foreground text-sm mt-10">
            No courses found
          </div>
        )}
      </div>
    </>
  );
};

export default CoursesList;
