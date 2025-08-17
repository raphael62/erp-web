import { NextResponse } from "next/server";

// TODO: Replace with real SQL query to Neon.
// This mock returns 5 items you can wire up later.
export async function GET() {
  return NextResponse.json([
    { code: "COKE-500", name: "Coca-Cola 500ml", onHand: 12, reorder: 24, location: "Main WH" },
    { code: "SPRT-350", name: "Sprite 350ml",     onHand: 6,  reorder: 20, location: "Main WH" },
    { code: "FANTA-1L", name: "Fanta 1L",         onHand: 9,  reorder: 18, location: "Depot A" },
    { code: "WATER-1.5",name: "Mineral Water 1.5L",onHand: 4, reorder: 12, location: "Main WH" },
    { code: "MALT-330", name: "Malt 330ml",       onHand: 7,  reorder: 16, location: "Depot B" },
  ]);
}
