import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, startTime, endTime, eventTypeId = 4718087 } = body;

    console.log("🔗 Creating booking in Cal.com");
    console.log("📝 Name:", name);
    console.log("📧 Email:", email);
    console.log("⏰ Time period:", startTime, "to", endTime);

    if (!name || !email || !startTime) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, startTime" },
        { status: 400 },
      );
    }

    const apiKey = process.env.CAL_API_KEY;
    if (!apiKey) {
      throw new Error("CAL_API_KEY not configured");
    }

    // Try creating booking using Cal.com v2 API
    const res = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Cal-API-Key": apiKey,
      },
      body: JSON.stringify({
        start: startTime,
        end: endTime,
        eventTypeId: eventTypeId,
        timeZone: "Asia/Kathmandu",
        language: "en",
        metadata: {},
        responses: {
          name: name,
          email: email,
        },
      }),
    });

    const data = await res.json();

    console.log("📊 Cal.com API Response Status:", res.status);
    console.log("📊 Cal.com API Response:", JSON.stringify(data, null, 2));

    if (data.error?.details?.errors) {
      console.log(
        "📋 Cal.com Error Details:",
        JSON.stringify(data.error.details.errors, null, 2),
      );
    }

    if (!res.ok) {
      console.error("❌ Cal.com API Error:", data);
      return NextResponse.json(
        { error: "Failed to create booking", details: data },
        { status: res.status },
      );
    }

    console.log("✅ Booking created successfully:", data);

    return NextResponse.json({
      status: "success",
      data: data,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
