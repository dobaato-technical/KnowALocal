# Sanity.io Integration Guide

## Overview

Your project is now set up to use Sanity.io for content management. Here's everything you need to know to get started.

## Setup Status ✅

- **Schema Created**: Tour location schema defined
- **Queries Ready**: GROQ queries for fetching tours
- **Components Updated**: `search-bar.tsx` now fetches from Sanity
- **Migration Script**: Ready to import your existing JSON data

## Next Steps

### 1. Start Your Development Server

```bash
npm run dev
```

Then visit:

- Your app: `http://localhost:3000`
- Sanity Studio: `http://localhost:3000/studio`

### 2. Get Your API Token

You'll need an API token to run the migration script. Get it from:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project: **know a local**
3. Go to **API** → **Tokens**
4. Create a new token with "Editor" permissions
5. Add it to `.env.local`:

```
SANITY_API_TOKEN=your_token_here
```

### 3. Migrate Your Data

Run the migration script to import your 7 tour locations from JSON to Sanity:

```bash
npx tsx scripts/migrate-tours.ts
```

This will:

- Read `src/data/travelLocations.json`
- Upload images to Sanity
- Create tour documents with all fields

### 4. Verify in Sanity Studio

1. Visit `http://localhost:3000/studio`
2. You should see "Tour Location" content type
3. Click on it to view your migrated tours
4. They're automatically available in your app via the GROQ queries

## What's Changed

### Files Created

- `src/sanity/schemaTypes/tour.ts` - Tour location schema
- `src/sanity/lib/queries.ts` - GROQ queries
- `scripts/migrate-tours.ts` - Data migration script

### Files Updated

- `src/Views/LandingPage/components/search-bar.tsx` - Now fetches from Sanity
- `src/sanity/schemaTypes/index.ts` - Includes tour schema

## Schema Structure

Your Tour documents include:

- **Title** (required): Name of the tour location
- **Slug** (required): URL-friendly identifier (auto-generated from title)
- **Description** (required): Details about the location
- **Image** (required): Photo of the location
- **Rating** (required): 0-5 star rating

## API Configuration

Your environment variables in `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=avyet4j7
NEXT_PUBLIC_SANITY_DATASET=know-a-local
SANITY_API_TOKEN=your_api_token_here  # Only needed for migrations/publishing
```

## Querying Tours from Components

Example of fetching tours in your components:

```tsx
import { getTours, getTourBySlug } from "@/sanity/lib/queries";

// Get all tours
const allTours = await getTours();

// Get a specific tour by slug
const tour = await getTourBySlug("cape-forchu");
```

## Next: Update Other Components

Once migration is complete, consider updating:

- Tour detail pages to fetch from Sanity
- Tour cards/galleries
- Any other components using the old JSON data

## Troubleshooting

### "Missing SANITY_API_TOKEN"

Add your API token to `.env.local` and restart the dev server.

### Images not uploading

- Ensure image paths in JSON match actual files in `/public`
- Check file permissions
- Verify the image format is supported (JPG, PNG, etc.)

### Tours not showing in app

- Check browser console for fetch errors
- Verify Sanity dataset is set to "production"
- Ensure CORS origins are configured (should be auto-added)

## Documentation

- [Sanity Docs](https://www.sanity.io/docs)
- [next-sanity](https://github.com/sanity-io/next-sanity)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
