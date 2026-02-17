#!/usr/bin/env node
/**
 * Migration script to import travel locations from JSON to Sanity
 * Run with: node --loader tsx scripts/migrate-tours.ts
 */

import "dotenv/config";
import * as fs from "fs";
import { createClient } from "next-sanity";
import * as path from "path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing required environment variables:");
  if (!projectId) console.error("  - NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!dataset) console.error("  - NEXT_PUBLIC_SANITY_DATASET");
  if (!token) console.error("  - SANITY_API_TOKEN");
  console.error(
    "\nMake sure these are set in your .env.local file and you can access them.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-10",
  token,
  useCdn: false,
});

interface OldTour {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  rating: number;
  location?: string;
  fullDescription?: string;
  duration?: string;
  difficulty?: string;
  specialties?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    icon?: string;
  }>;
  itinerary?: Array<{
    day: number;
    title: string;
    activities: Array<{
      time: string;
      activity: string;
    }>;
  }>;
}

async function migrateTours() {
  try {
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), "src/data/travelLocations.json");
    const jsonData = fs.readFileSync(jsonPath, "utf-8");
    const tours: OldTour[] = JSON.parse(jsonData);

    console.log(`Found ${tours.length} tours to migrate...`);

    // Create documents in Sanity
    for (const tour of tours) {
      try {
        // Download image and upload to Sanity
        const imageUrl = `${process.cwd()}/public${tour.image}`;
        let imageAsset: { _ref: string } | null = null;

        if (fs.existsSync(imageUrl)) {
          try {
            const imageBuffer = fs.readFileSync(imageUrl);
            const uploadedAsset = await client.assets.upload(
              "image",
              imageBuffer,
              {
                filename: path.basename(tour.image),
              },
            );
            imageAsset = {
              _ref: uploadedAsset._id,
            };
          } catch (err) {
            console.warn(
              `Warning: Could not upload image for ${tour.title}:`,
              err,
            );
          }
        }

        const tourDoc = {
          _type: "tour",
          title: tour.title,
          slug: {
            _type: "slug",
            current: tour.slug,
          },
          description: tour.description,
          fullDescription: tour.fullDescription || tour.description,
          location: tour.location || "Nova Scotia",
          rating: tour.rating,
          duration: tour.duration || "1 day",
          difficulty: tour.difficulty || "Easy",
          customizations: tour.specialties || [],
          itinerary: tour.itinerary || [],
          ...(imageAsset && {
            image: {
              _type: "image",
              asset: imageAsset,
            },
          }),
        };

        const created = await client.create(tourDoc);
        console.log(`✓ Created: ${tour.title} (${created._id})`);
      } catch (err) {
        console.error(`✗ Error migrating ${tour.title}:`, err);
      }
    }

    console.log("\n✓ Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateTours();
