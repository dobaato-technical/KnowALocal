import { createClient } from "next-sanity";

const client = createClient({
  projectId: "avyet4j7",
  dataset: "know-a-local",
  apiVersion: "2026-02-10",
  useCdn: false,
  token:
    "skmkvI9g7VI4BgnOdBXBsgyJuyw7GsCYB5lglOhPD8jSX8KqCRPqZNqD9PxSGMqKDhZ0MblFfbjWjLQLMG9Fi800YktuAExnQXVOqY1K8QB5cLq8Sx6n7LScUB3uLLMBVBReBG94aTGsVCLgrOEBvpeD3kLHth0dZYOniMQSsKcmHm2JQPqz",
});

async function checkTours() {
  try {
    const query = `*[_type == "tour"] {
      _id,
      title,
      slug,
      itinerary,
      galleryImages,
      specialties,
      tourInclusions
    } | order(_createdAt desc)`;

    const tours = await client.fetch(query);

    console.log("📊 Tours Summary:");
    console.log("================\n");

    tours.forEach((tour: any) => {
      console.log(`✓ ${tour.title} (${tour.slug.current})`);
      console.log(
        `  - Itinerary: ${tour.itinerary && tour.itinerary.length > 0 ? "✓" : "✗"} (${tour.itinerary?.length || 0} items)`,
      );
      console.log(
        `  - Gallery: ${tour.galleryImages && tour.galleryImages.length > 0 ? "✓" : "✗"} (${tour.galleryImages?.length || 0} images)`,
      );
      console.log(
        `  - Specialties: ${tour.specialties && tour.specialties.length > 0 ? "✓" : "✗"} (${tour.specialties?.length || 0} items)`,
      );
      console.log(
        `  - Inclusions: ${tour.tourInclusions && tour.tourInclusions.length > 0 ? "✓" : "✗"}`,
      );
      console.log();
    });

    // Check specific tour
    const targetSlug = "title-ho-mero";
    const targetTour = tours.find((t: any) => t.slug.current === targetSlug);

    if (targetTour) {
      console.log(`\n🎯 Found "${targetSlug}":`);
      console.log(JSON.stringify(targetTour, null, 2));
    } else {
      console.log(`\n❌ Tour "${targetSlug}" not found!`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkTours();
