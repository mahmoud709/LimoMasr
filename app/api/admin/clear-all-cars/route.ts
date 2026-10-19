import { NextResponse } from "next/server";
// Legacy maintenance endpoints must not execute database or filesystem mutations.
export async function DELETE() { return NextResponse.json({ error: "This maintenance endpoint is retired." }, { status: 410 }); }
