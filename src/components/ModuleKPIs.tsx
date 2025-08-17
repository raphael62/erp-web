"use client";

import * as React from "react";
import { Circle } from "lucide-react";

type IconType = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

type Props = {
  /** Pass the icon COMPONENT (e.g., LayoutDashboard), NOT <LayoutDashboard /> */
  icon?: IconType;
  label: string;
  value: string | number;
  sublabel?: string;
  className?: string;
};

export default function ModuleKPIs({
  icon,
  label,
  value,
  sublabel,
  className = "",
}: Props) {
  const display = typeof value === "number" ? value.toLocaleString() : String(value);
  const IconComp = icon ?? Circle; // safe fallback

  return (
    <div
      className={`flex items-center gap-3 rounded-md border bg-white px-3 py-2 ${className}`}
      role="group"
      aria-label={`${label} ${display}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-50">
        <IconComp className="h-5 w-5 text-violet-600" aria-hidden="true" />
      </div>
      <div className="min-w-0 leading-tight">
        <div className="truncate text-xs text-gray-500">{label}</div>
        <div className="truncate text-base font-semibold text-gray-900">{display}</div>
        {sublabel ? <div className="truncate text-[11px] text-gray-500">{sublabel}</div> : null}
      </div>
    </div>
  );
}
