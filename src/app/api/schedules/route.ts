// ❌ Cal.com API integration disabled
// export async function GET() {
//   const apiKey = process.env.CAL_API_KEY;
//
//   // Check for API key
//   if (!apiKey) {
//     console.error("❌ CAL_API_KEY is not set in environment variables");
//     return NextResponse.json(
//       { error: "No apiKey provided - CAL_API_KEY not configured" },
//       { status: 500 },
//     );
//   }
//
//   try {
//     // Fetch schedule data from Cal.com API
//     const scheduleId = "1232811";
//     const url = `https://api.cal.com/v2/schedules/${scheduleId}`;
//
//     console.log("📅 Fetching schedule:", scheduleId);
//
//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//     });
//
//     const data = await res.json();
//
//     console.log("📊 Cal.com schedule response status:", res.status);
//     console.log("📊 Schedule data:", data);
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
//     console.log("✅ Successfully fetched schedule");
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("❌ Schedule fetch error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch schedule", details: String(error) },
//       { status: 500 },
//     );
//   }
// }
