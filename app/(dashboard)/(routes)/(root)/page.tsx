import { getDashboardCourses } from "@/actions/get-dashboard.courses";
import CoursesList from "@/components/courses-list";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Clock } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import InfoCard from "./_components/info-card";

export default async function Home() {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const { completedCourses, courseInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={courseInProgress.length}
        />
        <InfoCard
          icon={Clock}
          variant="success"
          label="Completed"
          numberOfItems={completedCourses.length}
        />
      </div>
      <div>
        <CoursesList items={[...completedCourses, ...courseInProgress]} />
      </div>
    </div>
  );
}
