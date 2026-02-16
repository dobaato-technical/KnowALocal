// ❌ Cal.com API integration disabled
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//
//   const startTime = searchParams.get("startTime");
//   const endTime = searchParams.get("endTime");
//
//   // Check for missing query parameters
//   if (!startTime || !endTime) {
//     return NextResponse.json(
//       {
//         error: "Missing required parameters",
//         missing: {
//           startTime: !startTime,
//           endTime: !endTime,
//         },
//       },
//       { status: 400 },
//     );
//   }
//
//   // Check for API key
//   const apiKey = process.env.CAL_API_KEY;
//   if (!apiKey) {
//     console.error("❌ CAL_API_KEY is not set in environment variables");
//     return NextResponse.json(
//       { error: "No apiKey provided - CAL_API_KEY not configured" },
//       { status: 500 },
//     );
//   }
//
//   console.log("📅 Checking availability:", {
//     startTime,
//     endTime,
//     apiKeyExists: !!apiKey,
//     apiKeyPrefix: apiKey.substring(0, 10) + "...",
//   });
//
//   try {
//     // Build URL with dynamic startTime and endTime, hardcoded eventTypeId and apiKey
//     const url = `https://api.cal.com/v2/slots/available?eventTypeId=4718087&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&timeZone=Asia/Kathmandu&apiKey=${apiKey}`;
//
//     console.log("🔗 Calling Cal.com API");
//     console.log("🔑 Using eventTypeId: 4718087");
//     console.log("📍 Time period:", startTime, "to", endTime);
//
//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//
//     const data = await res.json();
//
//     console.log("📊 Cal.com response status:", res.status);
//     console.log("📊 Response:", data);
//
//     if (!res.ok) {
//       console.error("❌ Cal.com API error (status " + res.status + "):", data);
//       return NextResponse.json(
//         {
//           error: data.message || data.error || "Cal.com API error",
//           details: data,
//           status: res.status,
//         },
//         { status: res.status },
//       );
//     }
//
//     console.log("✅ Successfully fetched availability slots");
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("❌ Availability check error:", error);
//     return NextResponse.json(
//       { error: "Failed to check availability", details: String(error) },
//       { status: 500 },
//     );
//   }
// }
