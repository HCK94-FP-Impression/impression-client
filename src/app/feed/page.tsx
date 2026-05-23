"use client";

import { useState } from "react";
import FeedProfileCard from "./components/FeedProfileCard";
import FeedRatingPanel from "./components/FeedRatingPanel";
import { dummyProfile } from "./data";

export default function FeedPage() {
  const [scores, setScores] = useState<Array<number | null>>(() =>
    Array(dummyProfile.criteria.length).fill(null),
  );
  const [isFlipped, setIsFlipped] = useState(false);

  const handleScoreChange = (index: number, level: number) => {
    const next = [...scores];
    next[index] = level;
    setScores(next);
  };

  return (
    <div className="mx-auto w-full max-w-7xl py-2">
      <div className="grid grid-cols-12 items-start gap-8">
        <FeedProfileCard
          isFlipped={isFlipped}
          onToggleFlip={() => setIsFlipped((prev) => !prev)}
        />
        <FeedRatingPanel scores={scores} onScoreChange={handleScoreChange} />
      </div>
    </div>
  );
}
