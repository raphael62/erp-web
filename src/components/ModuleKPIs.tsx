// src/components/ModuleKPIs.tsx
import type { ReactNode, SVGProps, ComponentType } from "react";
import { CircleHelp } from "lucide-react";

/** A small KPI card with an icon, label and value. */
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type Props = {
  /** Small text above the value */
  label?: string;
  /** Main metric value (number, string, or JSX) */
  value?: ReactNode;
  /** Lucide icon component (e.g., Users, Package). Defaults to CircleHelp */
  icon?: IconType;
  /** Optional helper text under the value */
  helpText?: string;
  /** Optional trend text/badge under the value */
  trend?: ReactNode;
  /** Extra classNames for the outer wrapper */
  className?: string;
};

export default function ModuleKPIs({
  label = "—",
  value = "—",
  icon: Icon = CircleHelp,
  helpText,
  trend,
  className = "",
}: Props) {
  return (
    <div
      className={
        "rounded-2xl border bg-white/50 p-4 shadow-sm backdrop-blur " + className
      }
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-violet-600" aria-hidden={true} />
        <span className="text-sm text-gray-500">{label}</span>
      </div>

      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>

      {trend ? <div className="mt-1 text-sm text-gray-600">{trend}</div> : null}
      {helpText ? (
        <div className="mt-2 text-xs text-gray-400">{helpText}</div>
      ) : null}
    </div>
  );
}
