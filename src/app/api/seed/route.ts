/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { seedDatabase } from "@/shared/utils/seed-api";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST() {
  try {
    await seedDatabase(supabase);
    return NextResponse.json({ success: true });
  } catch (err: any) {

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
