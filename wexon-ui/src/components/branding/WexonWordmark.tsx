"use client";

import React from "react";
import clsx from "clsx";

type WexonWordmarkProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
};

const sizeClass: Record<NonNullable<WexonWordmarkProps["size"]>, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export default function WexonWordmark({
  size = "md",
  showTagline = false,
  className,
}: WexonWordmarkProps) {
  return (
    <div className={clsx("flex flex-col items-center", className)}>
      <div
        className={clsx(
          "font-bold tracking-[0.18em] text-gray-900",
          sizeClass[size],
        )}
      >
        WEXON
      </div>
      {showTagline && (
        <div className="mt-1 text-xs text-muted-foreground">
          Warehouse EXcellence &amp; Optimization Network
        </div>
      )}
    </div>
  );
}

