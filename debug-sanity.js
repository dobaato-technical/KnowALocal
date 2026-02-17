#!/usr/bin/env node

const { createClient } = require("next-sanity");
require("dotenv").config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-02-10",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function debugTour() {
  console.log("🔍 Checking Sanity dataset for tours...\n");

  // Check all tours (including drafts)
  const allToursQuery = `*[_type == "tour"] | order(_createdAt desc) {
    _id,
    _type,
    title,
    slug,
    description,
    fullDescription,
    itinerary,
    galleryImages,
    specialties,
    tourInclusions,
    keyRequirements,
    safetyWarnings
  }`;

  try {
    const tours = await client.fetch(allToursQuery);
    console.log(`✅ Found ${tours.length} tours:`);
    console.log(JSON.stringify(tours, null, 2));

    // Check for the specific tour
    const targetTour = tours.find((t) => t.slug?.current === "title-ho-mero");
    if (targetTour) {
      console.log('\n🎯 Found target tour "title-ho-mero":');
      console.log(JSON.stringify(targetTour, null, 2));

      // Check what fields are empty
      console.log("\n📋 Field status:");
      console.log(
        `- itinerary: ${targetTour.itinerary ? "✓ Present" : "✗ Missing"} (${targetTour.itinerary?.length || 0} items)`,
      );
      console.log(
        `- galleryImages: ${targetTour.galleryImages ? "✓ Present" : "✗ Missing"} (${targetTour.galleryImages?.length || 0} items)`,
      );
      console.log(
        `- specialties: ${targetTour.specialties ? "✓ Present" : "✗ Missing"} (${targetTour.specialties?.length || 0} items)`,
      );
      console.log(
        `- tourInclusions: ${targetTour.tourInclusions ? "✓ Present" : "✗ Missing"} (${targetTour.tourInclusions?.length || 0} items)`,
      );
      console.log(
        `- keyRequirements: ${targetTour.keyRequirements ? "✓ Present" : "✗ Missing"} (${targetTour.keyRequirements?.length || 0} items)`,
      );
      console.log(
        `- safetyWarnings: ${targetTour.safetyWarnings ? "✓ Present" : "✗ Missing"} (${targetTour.safetyWarnings?.length || 0} items)`,
      );
    } else {
      console.log('\n❌ Tour "title-ho-mero" NOT found!');
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

debugTour();
