"use client";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md";
}

export default function RatingBadge({ rating, size = "sm" }: RatingBadgeProps) {
  const percentage = Math.round(rating * 10);
  const radius = size === "sm" ? 14 : 18;
  const stroke = size === "sm" ? 2.5 : 3;
  const padding = 4;
  const viewBoxSize = (radius + stroke + padding) * 2;
  const center = radius + stroke + padding;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeColor =
    rating >= 7 ? "#10b981" : rating >= 5 ? "#f59e0b" : "#ef4444";

  const trackColor =
    rating >= 7
      ? "rgba(16,185,129,0.3)"
      : rating >= 5
        ? "rgba(245,158,11,0.3)"
        : "rgba(239,68,68,0.3)";

  const boxSize = size === "sm" ? 36 : 46;
  const textSize = size === "sm" ? "text-[11px]" : "text-sm";

  return (
    <div
      aria-label={`Rating: ${rating.toFixed(1)} out of 10`}
      className="relative inline-flex items-center justify-center rounded-full bg-zinc-900/90 backdrop-blur-sm"
      style={{ width: boxSize, height: boxSize }}
    >
      <svg
        className="-rotate-90"
        height={viewBoxSize}
        style={{ position: "absolute" }}
        width={viewBoxSize}
      >
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={stroke}
        />
      </svg>
      <span className={`relative font-bold ${textSize} text-white`}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
