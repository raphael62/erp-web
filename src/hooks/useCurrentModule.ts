"use client";
import { usePathname } from "next/navigation";
import { MAIN_MODULES } from "@/config/modules";

export function useCurrentModule() {
  const pathname = usePathname();

  if (pathname === "/") return MAIN_MODULES.find(m => m.href === "/") ?? null;

  for (const m of MAIN_MODULES) {
    if (pathname === m.href || pathname.startsWith(m.href + "/")) return m;
    if (m.submenus?.some(s => pathname === s.href || pathname.startsWith(s.href + "/")))
      return m;
  }
  return null;
}
