"use client";

import ReactConfetti from "react-confetti";
import { useConfettiStore } from "@/hooks/use-confetti-store";

export const ConfettiProvider = () => {
  const confetti = useConfettiStore();

  if (!confetti.isOpen) return null;

  return (
    <ReactConfetti
      recycle={false}
      numberOfPieces={500}
      className="w-full z-[100] pointer-events-none"
      onConfettiComplete={() => confetti.onClose()}
    />
  );
};
