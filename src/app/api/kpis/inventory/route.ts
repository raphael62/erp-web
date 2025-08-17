import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Replace with real SQL; series is just mock data
  return NextResponse.json([
    {
      label: "Total Items",
      value: 2847,
      note: "+12 this month",
      delta: 0.4,               // % change vs prior period
      deltaLabel: "MoM",
      series: [2400, 2420, 2450, 2460, 2485, 2530, 2600, 2710, 2760, 2847],
    },
    {
      label: "Total Value",
      value: "847,293",
      note: "+8.2% MoM",
      delta: 8.2,
      deltaLabel: "MoM",
      series: [720000, 732000, 741000, 746000, 758000, 770000, 792000, 810000, 820000, 847293],
    },
    {
      label: "Low Stock",
      value: 15,
      note: "Needs attention",
      delta: 1.0,               // up = worse here → set positiveIsGood: false
      deltaLabel: "WoW",
      series: [10, 11, 10, 12, 13, 14, 14, 15],
      positiveIsGood: false,
    },
    {
      label: "Warehouses",
      value: 3,
      note: "Active",
      delta: 0,                 // flat
      deltaLabel: "MoM",
      series: [3, 3, 3, 3, 3],
    },
  ]);
}
