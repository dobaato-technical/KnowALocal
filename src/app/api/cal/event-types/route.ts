// ❌ Cal.com API integration disabled
// export async function GET() {
//   const apiKey = process.env.CAL_API_KEY;
//
//   if (!apiKey) {
//     return NextResponse.json(
//       { error: "CAL_API_KEY not configured" },
//       { status: 500 },
//     );
//   }
//
//   try {
//     // List all event types for your account
//     const res = await fetch("https://api.cal.com/v1/event-types", {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//       },
//     });
//
//     const data = await res.json();
//
//     console.log("📋 Available Event Types:", data);
//
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error fetching event types:", error);
//     return NextResponse.json({ error: String(error) }, { status: 500 });
//   }
// }
