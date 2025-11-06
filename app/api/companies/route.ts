import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";

export async function GET() {
  try {
    await connectDB();
    const companies = await Company.find().sort({ createdAt: -1 });
    return Response.json(companies);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, processType, processDate } = body;

    if (!name || !processType || !processDate) {
      return Response.json(
        { error: "Name, process type, and process date are required" },
        { status: 400 }
      );
    }

    const company = await Company.create({
      name,
      processType,
      processDate,
    });

    return Response.json(company, { status: 201 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
