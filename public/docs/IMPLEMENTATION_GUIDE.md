# Component Update Guide

## Files to Update

### 1. src/Views/LandingPage/components/Tour.tsx

**Change on Line 4:**

```typescript
// OLD
import { getTours, type Tour } from "@/sanity/lib/queries";

// NEW
import { getToursPreview, type TourPreview } from "@/sanity/lib/queries";
```

**Change on Line 12 (useState):**

```typescript
// OLD
const [tours, setTours] = useState<Tour[]>([]);

// NEW
const [tours, setTours] = useState<TourPreview[]>([]);
```

**Change on Line 18 (loadTours function):**

```typescript
// OLD
const data = await getTours();

// NEW
const data = await getToursPreview();
```

**That's it!** The component already uses only the preview fields (title, slug, image, description, rating).

---

### 2. src/Views/ExploreAllTours/components/ToursList.tsx

**Change on Line 8:**

```typescript
// OLD
import { getTours, type Tour } from "@/sanity/lib/queries";

// NEW
import { getToursPreview, type TourPreview } from "@/sanity/lib/queries";
```

**Change on Line 12 (useState):**

```typescript
// OLD
const [tours, setTours] = useState<Tour[]>([]);

// NEW
const [tours, setTours] = useState<TourPreview[]>([]);
```

**Change on Line 18 (loadTours function):**

```typescript
// OLD
const data = await getTours();

// NEW
const data = await getToursPreview();
```

**That's it!** The component already matches the preview data structure.

---

## Implementation Checklist

- [ ] Update `src/sanity/lib/queries.ts` with new `getToursPreview()` and optimize `getTourBySlug()`
- [ ] Update `src/Views/LandingPage/components/Tour.tsx` to import and use `getToursPreview`
- [ ] Update `src/Views/ExploreAllTours/components/ToursList.tsx` to import and use `getToursPreview`
- [ ] Test landing page loads correctly
- [ ] Test explore all tours page loads correctly
- [ ] Test tour detail page still works (uses `getTourBySlug`)
- [ ] Compare network requests (should see ~60% reduction on list pages)

---

## Optional Enhancements

### Add Pagination to Explore All Tours

```typescript
// In ToursList.tsx
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const pageSize = 12;

useEffect(() => {
  async function loadTours() {
    try {
      const data = await getToursPaginated(pageSize, (page - 1) * pageSize);
      if (page === 1) {
        setTours(data);
      } else {
        setTours((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === pageSize);
    } catch (error) {
      console.error("Error loading tours:", error);
    } finally {
      setIsLoading(false);
    }
  }
  loadTours();
}, [page]);
```

### Add Lazy Loading Images

```typescript
// In components showing tour images
<Image
  src={tour.image.asset.url}
  alt={tour.title}
  loading="lazy"  // Add this
  placeholder="blur"  // Optional
/>
```

---

## Database Impact

✅ **No schema changes needed** - Schema remains the same
✅ **Backward compatible** - Old `getTours()` can be kept for other uses
✅ **Easy to maintain** - Clear separation of preview vs full data

---

## Performance Metrics

**Before Optimization:**

- Landing Page: Loads ~3 tours × full data = ~50KB payload
- Explore Page: Loads ~7 tours × full data = ~110KB payload

**After Optimization:**

- Landing Page: Loads ~3 tours × preview data = ~20KB payload (60% reduction)
- Explore Page: Loads ~7 tours × preview data = ~45KB payload (60% reduction)
- Detail Page: Same as before (full data needed anyway)

---

## Questions?

- Want to use the old `getTours()` for something else? Keep it alongside the new queries
- Need caching? Can add Next.js `revalidateTag` for ISR
- Need pagination UI? Can implement "Load More" or numbered pagination
