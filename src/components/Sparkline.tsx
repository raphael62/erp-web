"use client";
import React from "react";

type Props = {
  data: number[];
  width?: number;   // px
  height?: number;  // px
  strokeClassName?: string;   // e.g. "stroke-green-600"
  fillClassName?: string;     // optional area fill
};

export default function Sparkline({
  data,
  width = 140,
  height = 36,
  strokeClassName = "stroke-gray-800 dark:stroke-gray-100",
  fillClassName,
}: Props) {
  if (!data || data.length < 2) {
    return <div className="h-9" />; // blank space to keep card height stable
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1; // avoid divide by zero
  const stepX = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / span) * height; // invert Y for SVG
    return [x, y] as const;
  });

  const d = points.map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`)).join(" ");

  // Optional area fill path
  const areaD = `${d} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {fillClassName && <path d={areaD} className={`${fillClassName}`} fillOpacity="0.12" />}
      <path d={d} className={`fill-none ${strokeClassName}`} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
