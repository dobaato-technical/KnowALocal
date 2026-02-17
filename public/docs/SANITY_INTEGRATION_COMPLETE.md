# Sanity Integration - Complete Data Flow Analysis

## Summary

Your project is now **fully integrated with Sanity.io**. All pages have been updated to fetch content dynamically from Sanity instead of JSON files.

## Data Flow Architecture

### 1. **Landing Page - Tours Section**

**File:** `src/Views/LandingPage/components/Tour.tsx`

- **Data Source:** Sanity (`getTours()`)
- **Display:** 4 featured tours (paginated)
- **Fields Used:** title, slug, image, description, rating
- **Features:**
  - Async data loading with skeleton placeholders
  - Rating badge display
  - Click-to-detail navigation

### 2. **Explore All Tours Page**

**File:** `src/Views/ExploreAllTours/components/ToursList.tsx`

- **Data Source:** Sanity (`getTours()`)
- **Display:** All available tours in grid
- **Fields Used:** title, slug, image, description, rating
- **Features:**
  - Loading state while fetching
  - Hover animations
  - Full tour listing

### 3. **Search Bar Component**

**File:** `src/Views/LandingPage/components/search-bar.tsx`

- **Data Source:** Sanity (`getTours()`)
- **Display:** Dropdown destination list
- **Fields Used:** title
- **Features:**
  - Real-time tour list in search dropdown
  - Loads on component mount

### 4. **Tour Detail Page - Complete Structure**

**Route:** `src/app/tour-details/[slug]/page.tsx`

- Fetches single tour by slug using `getTourBySlug()`
- Passes data to detail view component

**Component:** `src/Views/TourDetails/TourDetailsPage.tsx`

Renders multiple sections:

#### a) **TourDetailHero**

- Hero image carousel with gallery support
- **Uses:** `image`, `galleryImages[]`
- **Features:** Auto-rotating gallery with navigation

#### b) **TourInfoCards**

- Key statistics display
- **Uses:** location, duration, difficulty, rating
- **Display Icons:** Compass, Timer, Mountain, Award, Shield, Users

#### c) **SpecialtiesSection**

- Food and specialty items showcase
- **Uses:** specialties[] (name, description, price, icon)
- **Features:** Icon mapping, price display

#### d) **ItineraryDay Accordion**

- Day-by-day itinerary breakdown
- **Uses:** itinerary[] (day, title, activities[{time, activity}])
- **Features:** Expandable accordion interface

#### e) **ImageGallery**

- Circular carousel of tour images
- **Uses:** galleryImages[]
- **Falls back to:** Default Unsplash images if not provided
- **Features:** GSAP animations, auto-play, navigation controls

#### f) **BookingSidebar**

- Date and guest selection
- **Independent** of tour data structure

## Schema Structure (Sanity)

```typescript
Tour Document {
  title: string                    // Tour name
  slug: slug                       // URL-friendly identifier
  description: string              // Short description (max 200 chars)
  fullDescription: string          // Detailed description
  location: string                 // Tour location/region
  image: image                     // Hero image with hotspot
  galleryImages: image[]           // Multiple images for carousel
  rating: number                   // 0-5 star rating
  duration: string                 // e.g., "4 hours", "Full Day"
  difficulty: string               // Easy, Moderate, Challenging
  specialties: array               // Food items / experiences
    - name: string
    - description: string
    - price: number
    - icon: string (emoji)
  itinerary: array                 // Day-by-day breakdowns
    - day: number
    - title: string
    - activities: array
      - time: string
      - activity: string
}
```

## API Queries (Sanity)

Located in: `src/sanity/lib/queries.ts`

### `getTours()` - Fetch all tours

Returns filtered array for listing pages

### `getTourBySlug(slug)` - Fetch single tour

Returns complete tour data for detail page

## Component Data Mapping

| Component        | Source | Data Path            | Type     |
| ---------------- | ------ | -------------------- | -------- |
| Tour Card        | Sanity | tour.image.asset.url | String   |
|                  |        | tour.slug.current    | String   |
|                  |        | tour.title           | String   |
|                  |        | tour.description     | String   |
| Tour Detail Hero | Sanity | tour.image.asset.url | Image    |
|                  |        | tour.galleryImages[] | Images[] |
| Tour Info        | Sanity | tour.location        | String   |
|                  |        | tour.duration        | String   |
|                  |        | tour.difficulty      | String   |
| Specialties      | Sanity | tour.specialties[]   | Object[] |
| Itinerary        | Sanity | tour.itinerary[]     | Object[] |

## File Updates

### Created/Modified:

- ✅ `src/sanity/schemaTypes/tour.ts` - Complete tour schema
- ✅ `src/sanity/lib/queries.ts` - GROQ queries
- ✅ `src/Views/LandingPage/components/Tour.tsx` - Sanity integration
- ✅ `src/Views/ExploreAllTours/components/ToursList.tsx` - Sanity integration
- ✅ `src/Views/LandingPage/components/search-bar.tsx` - Sanity integration
- ✅ `src/app/tour-details/[slug]/page.tsx` - Dynamic routing
- ✅ `src/Views/TourDetails/TourDetailsPage.tsx` - Data mapping
- ✅ `src/Views/TourDetails/components/TourDetailHero.tsx` - Gallery support
- ✅ `src/Views/TourDetails/components/carousel-circular-image-gallery.tsx` - Dynamic images
- ✅ `scripts/migrate-tours.ts` - Migration tool

### Still Using JSON (Optional to migrate):

- `src/data/travelLocations.json` - Can be deleted after verifying Sanity works

## Next Steps

### 1. **Verify Sanity Studio Updates**

```bash
npm run dev
# Visit http://localhost:3000/studio
# Edit tours to add:
# - Full Description
# - Location
# - Duration
# - Difficulty
# - Specialties
# - Itinerary
# - Gallery Images
```

### 2. **Test All Pages**

- `/` - Landing page with tour section
- `/explore-all-tours` - Full tour listing
- `/tour-details/[slug]` - Individual tour details

### 3. **Verify Data Binding**

- Check that all fields display correctly
- Verify images load from Sanity
- Test carousel and accordions
- Validate form interactions

### 4. **Deploy**

Once tested locally, deploy to production:

```bash
npm run build
npm start
```

## Troubleshooting

### Tours Not Loading

- Check `.env.local` has correct `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
- Verify tours exist in Sanity Studio
- Check browser console for fetch errors

### Images Not Displaying

- Ensure images uploaded to Sanity
- Verify image URLs are accessible
- Check CORS settings in Sanity project

### Detail Page Shows "Tour Not Found"

- Verify slug in URL matches `slug.current` in Sanity
- Check Sanity dataset has published documents
- Verify GROQ query returns results (test in Vision tab)

## Benefits of This Architecture

✅ **Single Source of Truth** - All content in Sanity
✅ **No Code Deploys** - Update content without builds
✅ **Type Safe** - TypeScript interfaces for all data
✅ **Scalable** - Add new fields anytime in schema
✅ **Media Management** - Built-in image optimization
✅ **Collaboration** - Team can edit content in Studio
✅ **Preview** - See changes before publishing
✅ **Versioning** - Track content history

## Support

Refer to:

- [Sanity Documentation](https://www.sanity.io/docs)
- [next-sanity](https://github.com/sanity-io/next-sanity)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
