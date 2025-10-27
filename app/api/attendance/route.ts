import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/attendance";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { company, name, email, photo } = body;
    if (!company || !name || !email)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const record = await Attendance.create({
      company,
      name,
      email,
      photo,
      ip_address: ip,
      timestamp: new Date(),
    });

    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const company = url.searchParams.get("company");
    if (!company) return NextResponse.json([]);

    const list = await Attendance.find({ company }).sort({ timestamp: -1 });
    return NextResponse.json(list);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
