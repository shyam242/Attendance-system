import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";

export async function GET() {
  try {
    await connectDB();
    const companies = await Company.find().sort({ createdAt: -1 });
    return Response.json(companies);
  } catch (err: any) {
    console.error("GET /api/companies error:", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name) {
      return Response.json({ error: "Missing company name" }, { status: 400 });
    }

    const company = await Company.create({ name: body.name });
    return Response.json(company, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/companies error:", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
