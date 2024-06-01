"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface ICourseEnrollButton {
  courseId: string;
  price?: number | null;
}

const CourseEnrollButton = ({ courseId, price }: ICourseEnrollButton) => {
  const [isLoading, setIsLoading] = useState(false);

  const OnEnroll = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);

      window.location.assign(response.data.url);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={OnEnroll}
      disabled={isLoading}
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price || 0)}
    </Button>
  );
};

export default CourseEnrollButton;
