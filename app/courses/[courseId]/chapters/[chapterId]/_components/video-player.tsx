"use client";

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

interface IVideoPlayer {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: IVideoPlayer) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="bg-slate-800 absolute inset-0 flex flex-col text-secondary justify-center items-center gap-y-2">
          <Lock className="w-8 h-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          playbackId={playbackId}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => alert("end")}
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoPlayer;
