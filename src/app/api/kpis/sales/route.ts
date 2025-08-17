import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      label: "Orders (30d)",
      value: 162,
      delta: 6.4,
      deltaLabel: "MoM",
      series: [108, 112, 120, 125, 131, 139, 147, 153, 158, 162],
    },
    {
      label: "Revenue (30d)",
      value: "$129,450",
      delta: 5.1,
      deltaLabel: "MoM",
      series: [92000, 96500, 101000, 105000, 109500, 113000, 118000, 121000, 125000, 129450],
    },
    {
      label: "Avg Order",
      value: "$799",
      delta: -1.2,             // down slightly
      deltaLabel: "MoM",
      series: [820, 815, 812, 810, 808, 805, 803, 800, 798, 799],
      positiveIsGood: true,    // (still treat up as good)
    },
    {
      label: "Customers",
      value: 93,
      delta: 3.3,
      deltaLabel: "MoM",
      series: [80, 82, 84, 86, 87, 88, 90, 91, 92, 93],
    },
  ]);
}
