"use client";

import * as React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "subtle";
};

export default function Button({ className, variant = "solid", ...props }: Props) {
  const styles =
    variant === "outline"
      ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
      : variant === "subtle"
      ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
      : "bg-purple-600 hover:bg-purple-700 text-white";

  return (
    <button
      {...props}
      className={clsx(
        "inline-flex h-8 items-center rounded px-3 text-sm transition-colors disabled:opacity-50",
        styles,
        className
      )}
    />
  );
}
