"use client";

import { useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutSwitchProps {
  onLayoutChange?: (layout: "grid" | "table") => void;
}

export default function LayoutSwitch({
  onLayoutChange = () => {},
}: LayoutSwitchProps) {
  const [isGrid, setIsGrid] = useState(true);

  const toggleLayout = () => {
    setIsGrid((prevIsGrid) => {
      const newIsGrid = !prevIsGrid;
      onLayoutChange?.(newIsGrid ? "grid" : "table");
      return newIsGrid;
    });
  };

  return (
    <button
      onClick={toggleLayout}
      className={cn(
        "relative flex h-10 w-24 items-center rounded-lg border border-primary p-1 shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isGrid ? "bg-tertiary" : "bg-tertiary",
      )}
      aria-pressed={isGrid}
      aria-label={`Switch to ${isGrid ? "table" : "grid"} layout`}
    >
      <span
        className={cn(
          "absolute h-8 w-12 transform rounded-lg bg-primary shadow-md transition-transform duration-200 ease-in-out",
          isGrid ? "translate-x-10" : "translate-x-0",
        )}
      />
      <span
        className={cn(
          "flex flex-1 items-center justify-center",
          isGrid ? "text-slate-500" : "text-white",
        )}
      >
        <LayoutGrid size={18} className="z-10" />
      </span>
      <span
        className={cn(
          "flex flex-1 items-center justify-center",
          !isGrid ? "text-slate-500" : "text-white",
        )}
      >
        <LayoutList size={18} className="z-10" />
      </span>
    </button>
  );
}
