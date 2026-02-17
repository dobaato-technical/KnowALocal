import { client } from "./client";

// Check what's being fetched
async function debugFetch() {
  try {
    const query = `*[_type == "tour"] {
      _id,
      title,
      slug,
      description,
      image { asset-> { url } },
      rating
    } | order(_createdAt desc)`;

    console.log("🔍 Debug: Running query...");
    const results = await client.fetch(query);
    console.log("✅ Debug: Query returned ", results.length, "tours");
    if (results.length > 0) {
      console.log("📋 Debug: First tour:", results[0]);
    }
    return results;
  } catch (error) {
    console.error("❌ Debug: Fetch error:", error);
    throw error;
  }
}

debugFetch();
