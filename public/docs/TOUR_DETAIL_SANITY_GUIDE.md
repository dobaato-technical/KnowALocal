# Tour Detail Page - Sanity Integration Guide

## Overview

Your tour schema has been expanded to include all the fields needed for the detail page. Now you need to update `TourDetailsPage.tsx` to fetch from Sanity instead of mock data.

## Updated Schema Fields

Your tour now includes:

```typescript
- title: string
- description: string (short)
- fullDescription: string
- location: string
- image: image (hero image)
- galleryImages: array of images
- rating: number
- duration: string (e.g., "4 hours")
- difficulty: string (Easy, Moderate, Challenging)
- specialties: array of {name, description, price, icon}
- itinerary: array of {day, title, activities[]}
```

## Update Your Detail Page

### 1. Update the route handler (`src/app/tour-details/[slug]/page.tsx`)

```tsx
import { getTourBySlug } from "@/sanity/lib/queries";
import TourDetailsPage from "@/Views/TourDetails/TourDetailsPage";

interface TourDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // This can now be removed or fetch all tours from Sanity
  // For now, it will build pages on-demand
  return [];
}

export default async function Page({ params }: TourDetailsPageProps) {
  const resolvedParams = await params;
  const tour = await getTourBySlug(resolvedParams.slug);

  if (!tour) {
    return <div>Tour not found</div>;
  }

  return <TourDetailsPage tour={tour} />;
}
```

### 2. Update TourDetailsPage Component

Replace the mock data import with Sanity data:

```tsx
"use client";

import { Tour } from "@/sanity/lib/queries";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

/* -------- Dynamic Imports -------- */
const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

// ... other dynamic imports ...

interface TourDetailsPageProps {
  tour: Tour;
}

export default function TourDetailsPage({ tour }: TourDetailsPageProps) {
  return (
    <>
      <Header />

      {/* Use tour data instead of toursMockData */}
      <TourDetailHero
        title={tour.title}
        image={tour.image.asset.url}
        rating={tour.rating}
      />

      <TourInfoCards
        location={tour.location}
        duration={tour.duration}
        difficulty={tour.difficulty}
      />

      {/* Render itinerary */}
      {tour.itinerary?.map((day) => (
        <ItineraryDay
          key={day.day}
          day={day.day}
          title={day.title}
          activities={day.activities}
        />
      ))}

      {/* Gallery images */}
      {tour.galleryImages && tour.galleryImages.length > 0 && (
        <ImageGallery images={tour.galleryImages.map((img) => img.asset.url)} />
      )}

      {/* Specialties section */}
      {tour.specialties && tour.specialties.length > 0 && (
        <SpecialtiesSection specialties={tour.specialties} />
      )}

      {/* ... rest of your components ... */}

      <BookingSidebar price={tour.specialties?.[0]?.price || 0} />
    </>
  );
}
```

## Migration Steps

### 1. Update Mock Data with Production Data

You can now delete your mock data and fetch from Sanity. The migration script will populate your data with the new fields from `toursMockData`.

### 2. Run Migration (if you haven't added the new fields yet):

```bash
export $(cat .env.local | xargs) && npx tsx scripts/migrate-tours.ts
```

This will update existing tours or create new ones with all fields from your mock data.

### 3. Verify in Sanity Studio

1. Go to http://localhost:3000/studio
2. Click on "Tour Location"
3. Edit one of your tours to fill in the new fields:
   - Full Description
   - Location
   - Duration
   - Difficulty
   - Specialties
   - Itinerary
   - Gallery Images

### 4. Test Your Detail Page

Once you've updated the route and component, your detail page will automatically fetch from Sanity.

## Benefits of Using One Studio

✅ **Single Source of Truth**: All tour data in one place  
✅ **Easy to Manage**: Add/edit tours without touching code  
✅ **Consistent Data**: Same tour info on list and detail pages  
✅ **Gallery Support**: Easily add multiple images per tour  
✅ **Content Approval**: Use Sanity's publishing workflow  
✅ **Localization**: Easy to add multi-language support later

## Next Steps

1. Update your route file to fetch from Sanity
2. Update TourDetailsPage component signature
3. Map your child components to use tour data
4. Fill in additional fields in Sanity Studio
5. Test the detail page with real data

## Need Help?

Check the updated schema in Sanity Studio to see all available fields and their types. Use the Vision tool in Studio to test GROQ queries.
