"use client";

import { useMemo } from "react";

type CircularProgressProps = {
  percentage: number;
  size?: number; // diameter of the SVG (width & height)
  strokeWidth?: number;
};

export default function CircularProgress({
  percentage,
  size = 200,
  strokeWidth = 12,
}: CircularProgressProps) {
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  const strokeDashoffset = useMemo(
    () => circumference - (percentage / 100) * circumference,
    [percentage, circumference],
  );

  // Color transition from red to green via yellow
  const getColor = (percent: number) => {
    const hue = (percent / 100) * 120;
    return `hsl(${hue}, 70%, 50%)`;
  };

  //   const statusText =
  //     percentage <= 33 ? "Low" : percentage <= 66 ? "Medium" : "High";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="-rotate-90 transform"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {/* Centered text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div
            className="font-bold"
            style={{
              fontSize: size * 0.2,
              color: getColor(percentage),
            }}
          >
            {Math.floor(percentage)}%
          </div>
          {/* <div className="mt-1 text-sm text-gray-500">{statusText}</div> */}
        </div>
      </div>
    </div>
  );
}
