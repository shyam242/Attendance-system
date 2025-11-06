import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/attendance";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "Unknown";

    const { name, email, rollNumber, branch, photo, company } = body;

    // ✅ Validate new fields
    if (!name || !email || !rollNumber || !branch || !photo || !company) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const attendance = await Attendance.create({
      name,
      email,
      rollNumber,
      branch,
      photo,
      company,
      ip_address: ip,
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/attendance error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company");

    if (!company)
      return NextResponse.json({ error: "Missing company name" }, { status: 400 });

    const attendees = await Attendance.find({ company }).sort({ createdAt: -1 });
    return NextResponse.json(attendees);
  } catch (err: any) {
    console.error("GET /api/attendance error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
