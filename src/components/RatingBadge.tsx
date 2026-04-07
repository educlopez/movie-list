"use client";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md";
}

export default function RatingBadge({ rating, size = "sm" }: RatingBadgeProps) {
  const percentage = Math.round(rating * 10);
  const radius = size === "sm" ? 16 : 22;
  const stroke = size === "sm" ? 3 : 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const viewBoxSize = (radius + stroke) * 2;
  const center = radius + stroke;

  const color =
    rating >= 7
      ? "text-emerald-500"
      : rating >= 5
        ? "text-amber-500"
        : "text-red-500";

  const bgColor =
    rating >= 7
      ? "stroke-emerald-500/20"
      : rating >= 5
        ? "stroke-amber-500/20"
        : "stroke-red-500/20";

  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div
      aria-label={`Rating: ${rating.toFixed(1)} out of 10`}
      className="relative inline-flex items-center justify-center"
    >
      <svg
        className={`-rotate-90 ${color}`}
        height={viewBoxSize}
        width={viewBoxSize}
      >
        <circle
          className={bgColor}
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={stroke}
        />
      </svg>
      <span
        className={`absolute font-bold ${textSize} text-zinc-900 dark:text-white`}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
