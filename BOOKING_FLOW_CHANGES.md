# Cal.com Booking Flow Implementation - Complete Changes Documentation

**Date:** February 11, 2026  
**Project:** know-a-local (React/Next.js)  
**Status:** ✅ Complete & Ready for Testing

---

## Overview

This document outlines all changes made to implement a production-ready Cal.com booking flow where Cal.com serves **exclusively as a datetime picker + booking backend**, while custom UI handles **availability checking and user flow control**.

**Key Principle:** Users control the availability decision, not Cal.com automation.

---

## Files Created

### 1. `/src/app/api/cal/availability/route.ts`

**Purpose:** Check if a selected datetime slot is available via Cal.com API

**Key Features:**

- GET endpoint: `/api/cal/availability?eventTypeId=X&startTime=ISO8601&duration=30`
- Timezone conversion: Converts UTC to Asia/Kathmandu on server-side
- Server-side API key usage (never exposed to frontend)
- Returns: `{available: boolean, availableSlots?: [], message?: string}`

**Example Request:**

```typescript
const response = await fetch(
  `/api/cal/availability?eventTypeId=4718087&startTime=2026-02-14T14:30:00Z&duration=30`,
);
const data = await response.json(); // {available: true, message: "Slot available"}
```

**Security:**

- Validates required parameters on backend
- Uses `CAL_API_KEY` stored in `.env.local` (server-side only)
- Returns user-friendly error messages without exposing sensitive data

---

### 2. `/src/app/api/cal/booking/route.ts`

**Purpose:** Create booking and trigger Cal.com confirmation email

**Key Features:**

- POST endpoint: `/api/cal/booking`
- Request body: `{eventTypeId, startTime, attendeeEmail, attendeeName, timezone, metadata}`
- Server-side Cal.com API call with authentication
- Auto-sends confirmation email via Cal.com
- Returns: `{success, bookingId, confirmationUrl, message}`

**Example Request:**

```typescript
const response = await fetch("/api/cal/booking", {
  method: "POST",
  body: JSON.stringify({
    eventTypeId: "4718087",
    startTime: "2026-02-14T14:30:00Z",
    attendeeEmail: "user@example.com",
    attendeeName: "John Doe",
    timezone: "Asia/Kathmandu",
    metadata: { source: "know-a-local-web" },
  }),
});
const data = await response.json(); // {success: true, bookingId: "12345"}
```

**Security:**

- All sensitive operations server-side
- Email validation on backend
- Cal.com confirmation email automated (no custom email setup needed)

---

### 3. `/src/lib/booking-utils.ts`

**Purpose:** Centralized utility functions for booking operations

**Functions Exported:**

#### `checkAvailability(eventTypeId, startTime, duration)`

- Wrapper around `/api/cal/availability`
- Handles error responses gracefully
- Returns: `{available: boolean, availableSlots?: [], message?: string}`

#### `createBooking(eventTypeId, startTime, email, name, timezone)`

- Wrapper around `/api/cal/booking`
- Validates inputs before API call
- Returns: `{success: boolean, bookingId?: string, error?: string}`

#### `formatDateTimeForDisplay(iso, timezone)`

- Converts ISO datetime to user-friendly format
- Default timezone: Asia/Kathmandu
- Output: "Feb 14, 2026 - 2:30 PM"

#### `validateBookingForm(name, email, dateTime)`

- Validates all booking form inputs
- Checks: name (non-empty), email (regex), dateTime (not null)
- Returns: `{valid: boolean, errors: Record<string, string>}`

#### `isValidEmail(email)`

- RFC-compliant email validation
- Used by `validateBookingForm`

---

### 4. `/src/lib/toast-utils.ts`

**Purpose:** Wrapper around Sonner toast library with semantic functions

**Functions Exported:**

#### `showToast(message, type, options?)`

- Generic toast display function
- Types: "success" | "error" | "warning" | "info" | "loading"
- Position: bottom-right (configured in Providers)
- Auto-dismisses after 4 seconds

#### `showAvailabilityToast(available, message)`

- Specialized for availability check results
- Shows green toast on available, red on unavailable
- Includes icon and custom styling

#### `showBookingSuccessToast(bookingId)`

- Displays success message with booking ID
- Auto-dismisses after 5 seconds
- Encourages user to check email for confirmation

#### `showBookingErrorToast(error)`

- Displays user-friendly error messages
- Longer duration (5 seconds) for important info

#### `showLoadingToast(message)`

- Returns toast ID for updates
- Used for long-running operations
- Usage: `const id = showLoadingToast("Booking..."); updateToast(id, "...success")`

---

### 5. `/src/lib/providers.tsx`

**Purpose:** Global provider wrapper for Toaster component

**Content:**

```typescript
"use client";

import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        theme="light"
        richColors
        closeButton
        expand
        duration={4000}
      />
    </>
  );
}
```

**Configuration:**

- Position: bottom-right of viewport
- Theme: light
- Close button: enabled
- Auto-expand: on new toasts
- Duration: 4 seconds (customizable per toast)

---

### 6. Updated `/src/app/layout.tsx`

**Change:** Wrapped entire app with `<Providers>` component

**Before:**

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**After:**

```typescript
import Providers from "@/lib/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Why:** Enables global toast notifications via Sonner throughout entire app.

---

### 7. Updated `/src/Views/LandingPage/components/search-bar.tsx`

**Purpose:** Main booking flow component - orchestrates complete user journey

**Total Lines:** 785  
**Status:** Production-ready with complete state management

#### State Interfaces

```typescript
type AvailabilityStatus = "idle" | "checking" | "available" | "unavailable";

interface BookingState {
  // Tentative datetime selected by user
  selectedDateTime: string | null;

  // Controlled by "Check Availability" button ONLY
  availabilityStatus: AvailabilityStatus;

  // Collected after availability confirmed
  attendeeName: string;
  attendeeEmail: string;

  // API call in progress
  isConfirmingBooking: boolean;

  // Only show when user explicitly clicks "Confirm Booking"
  showBookingForm: boolean;
}
```

**State Transitions:**

```
INITIAL STATE
├─ selectedDateTime: null
├─ availabilityStatus: "idle"
├─ showBookingForm: false
└─ User sees: "Select Date & Time" button

AFTER USER SELECTS DATE
├─ selectedDateTime: "2026-02-14T14:30:00Z"
├─ availabilityStatus: "idle" (still no availability assumption)
├─ showBookingForm: false
└─ User sees: Selected date displayed, "Check Availability" button ready

DURING AVAILABILITY CHECK
├─ availabilityStatus: "checking"
└─ User sees: Loading spinner, "Checking..." state

AFTER AVAILABILITY CHECK - AVAILABLE
├─ availabilityStatus: "available"
├─ showBookingForm: false (NOT automatic)
└─ User sees: Green "Confirm Booking" button (must click to show form)

AFTER AVAILABILITY CHECK - UNAVAILABLE
├─ availabilityStatus: "unavailable"
└─ User sees: Red "Try Another Time" error button, can select new date

AFTER USER CLICKS "CONFIRM BOOKING"
├─ showBookingForm: true
└─ User sees: Modal with name/email form

AFTER SUCCESSFUL BOOKING
├─ selectedDateTime: null
├─ availabilityStatus: "idle"
├─ showBookingForm: false
├─ attendeeName: ""
├─ attendeeEmail: ""
└─ User sees: Success toast + resets to initial state
```

#### Core Functions

**`handleDateTimeSelected()`**

- Called by Cal.com embed when user selects datetime
- Sets `selectedDateTime` from Cal.com event data
- Sets `availabilityStatus: "idle"` (no availability assumption yet)
- Shows toast: "Date selected! Now check availability"
- **Key Change:** Removed invalid event listeners ("eventScheduled", "dateTimeSelected")

**`handleCheckAvailability()`**

- **Only called when user clicks "Check Availability" button**
- Validates selectedDateTime exists
- Sets `availabilityStatus: "checking"`
- Calls `/api/cal/availability` with timezone conversion
- Updates state to "available" or "unavailable" based on response
- Shows semantic toast: green for available, red for unavailable
- **Key Change:** Moved from Auto-trigger to Explicit Button

**`handleShowBookingForm()`**

- Only appears when `availabilityStatus === "available"`
- Sets `showBookingForm: true`
- Shows booking modal with name/email form
- **Previously:** Form appeared automatically after availability check
- **Now:** Form ONLY appears when user explicitly clicks button

**`handleConfirmBooking()`**

- Validates booking form: name, email, dateTime
- Shows individual toast per validation error
- Double-checks `availabilityStatus === "available"`
- Sets `isConfirmingBooking: true` (shows loading state)
- Calls `/api/cal/booking` to create booking
- **On Success:**
  - Shows success toast with booking ID
  - Resets entire state including `showBookingForm: false`
  - Resets duration filter
  - Cal.com automatically sends confirmation email to attendee
- **On Error:**
  - Shows error toast with message
  - Sets `isConfirmingBooking: false`
  - Allows user to retry

**`handleCloseBooking()`**

- Closes booking form modal
- Resets entire state: selectedDateTime, availabilityStatus, form fields, showBookingForm
- Allows user to start fresh or select different date

#### UI Components Rendered

**Calendar Modal (Cal.com Embed)**

```tsx
<Cal
  calLink="know-a-local-okxsgd/30min"
  config={{
    theme: "light",
    layout: "month_view",
    hideEventTypeDetails: false,
  }}
  onDateTimeSelected={handleDateTimeSelected}
/>
```

**Modal Footer (NEW)**

```tsx
<button
  onClick={() => {
    setShowCalendar(false);
    setTimeout(() => {
      handleCheckAvailability();
    }, 300);
  }}
>
  Check Availability
</button>
```

- **Purpose:** Closes calendar and triggers availability check
- **Delay:** 300ms to allow modal close animation before API call

**Primary Action Button (Dynamic)**

```tsx
// Changes based on availabilityStatus
{
  "idle": "Check Availability", // Only after date selected
  "checking": "Checking...", // Loading state
  "available": "Confirm Booking", // Success state - green
  "unavailable": "Try Another Time", // Error state - red
}
```

**Booking Form Modal (Conditional)**

```tsx
{
  bookingState.showBookingForm === true && (
    <div className="modal">
      <input type="text" placeholder="Your Name" />
      <input type="email" placeholder="Your Email" />
      <button onClick={handleConfirmBooking}>Confirm Booking</button>
    </div>
  );
}
```

- **Only appears:** When `showBookingForm === true`
- **Triggers:** Only after user clicks "Confirm Booking" button
- **Closes:** After successful booking OR when user clicks Cancel

---

## Environment Variables

**File:** `.env.local`

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=avyet4j7
NEXT_PUBLIC_SANITY_DATASET=know-a-local

# Cal.com Configuration
NEXT_PUBLIC_CAL_EVENT_TYPE_ID=4718087
CAL_API_KEY=cal_live_...
```

**Security Notes:**

- `CAL_API_KEY` is server-side only (no NEXT*PUBLIC* prefix)
- Never commit `.env.local` to git
- Use `.env.example` as template for local setup

---

## Complete User Journey

### 1. User Arrives at Landing Page

- Sees search bar with date/destination/duration filters
- Primary CTA: "Select Date & Time" button above search bar

### 2. Click "Select Date & Time"

- Cal.com modal opens (calendar view)
- User browses dates, selects preferred date/time slot
- Button at modal footer changes to "Check Availability"

### 3. Click "Check Availability" (in Modal Footer)

- Modal closes smoothly (300ms animation)
- Loading spinner appears in primary button: "Checking..."
- App calls `/api/cal/availability` API route
- Server queries Cal.com, converts timezone, returns result

### 4a. Availability Check - SUCCESS

- Primary button turns green: "Confirm Booking"
- Toast appears: "✅ Slot is available!"
- Selected date displayed in UI

### 4b. Availability Check - FAILURE

- Primary button turns red: "Try Another Time"
- Toast appears: "❌ This slot is booked"
- User can click button to select different date
- Goes back to Step 2

### 5. Click "Confirm Booking" (in Primary Button)

- Booking form modal appears with two fields:
  - Name (text input)
  - Email (text input)
- Button displays: "Confirm Booking" (inside modal)

### 6. Enter Details & Click "Confirm Booking" (Modal Button)

- Validates: name (non-empty), email (valid format), date (selected)
- Each validation error shows individual toast
- If valid: Shows "Confirming..." with loading spinner
- App calls `/api/cal/booking` API route
- Server creates booking via Cal.com API

### 7. Booking Confirmation

- Success toast: "✅ Booking confirmed! Check your email for confirmation"
- Toast includes booking ID for reference
- Booking form modal closes
- All state resets to initial
- User can make another booking immediately

### 8. Email Confirmation (Automatic)

- Cal.com automatically sends confirmation email to attendee
- Email includes: date, time, tour details, timezone
- User clicks link in email to confirm attendance (optional, Cal.com handles)

---

## Key Implementation Decisions

### 1. **Cal.com as Datetime Picker ONLY**

- ✅ Handles UI for calendar selection
- ✅ Creates booking on backend
- ❌ NO availability checking (custom UI handles this)
- ❌ NO auto-confirmation (user explicitly clicks button)
- ❌ NO automatic modal display (form only shows on explicit action)

### 2. **Explicit User Flow Control**

```
User Click → State Change → UI Update (NOT Auto-triggered)
```

- Each step requires explicit user action
- No auto-advancing through states
- User can abandon at any point

### 3. **State-Driven UI**

- Single source of truth: `bookingState` object
- Each UI element derived from one state property
- Clear mapping: availabilityStatus → button text/color
- No component-specific state for booking info

### 4. **Server-Side Security**

- All API keys on backend (`.env.local`)
- Frontend never knows about Cal.com API details
- Custom API routes act as secure proxy
- Timezone conversion on server before Cal.com queries

### 5. **Timezone Handling**

- Primary timezone: Asia/Kathmandu (UTC+5:45)
- Server-side conversion in availability route
- User-friendly display format: "Feb 14, 2026 - 2:30 PM"
- Immutable string: "Asia/Kathmandu" (hardcoded in handlers)

### 6. **Error Handling Strategy**

- Network errors: Show toast with message, allow retry
- Validation errors: Show individual toast per field
- API errors: Show user-friendly message without technical details
- Form re-validation: Double-check availability before creating booking

### 7. **Toast Notifications**

- Position: bottom-right (never obstructs important UI)
- Auto-dismiss: 4 seconds (customizable)
- Types: success (green), error (red), warning (yellow), info (blue)
- Rich colors: Sonner renders semantic styling

---

## Dependencies

### Production Dependencies

```json
{
  "@calcom/embed-react": "latest",
  "next": "14+",
  "react": "18+",
  "sonner": "latest",
  "lucide-react": "latest",
  "typescript": "latest"
}
```

### Development Tools

- Next.js TypeScript support built-in
- Tailwind CSS for styling
- ESLint for code quality

---

## Testing Checklist

- [ ] **Date Selection:** Can select date from Cal.com calendar
- [ ] **Calendar Close:** Calendar closes after clicking "Check Availability"
- [ ] **Date Display:** Selected date shows in UI after selection
- [ ] **Availability Check:** API call completes and shows result
- [ ] **Available Slot:** Green button appears when slot available
- [ ] **Unavailable Slot:** Red button appears when slot booked
- [ ] **Form Appearance:** Booking form only shows after clicking "Confirm Booking"
- [ ] **Form Validation:** Individual toast for each validation error
- [ ] **Booking Creation:** Booking successfully created via API
- [ ] **Email Confirmation:** Confirmation email received in inbox
- [ ] **State Reset:** All state resets after successful booking
- [ ] **New Booking:** Can immediately start new booking after first one
- [ ] **Try Another Time:** Can select different date after failed availability
- [ ] **Loading States:** Loading spinners show during API calls
- [ ] **Error Handling:** Graceful error messages on network failures
- [ ] **Timezone Display:** Times show correctly in Asia/Kathmandu timezone

---

## Troubleshooting

### Issue: "Select a date first" Message Persists

**Cause:** Cal.com isn't calling `onDateTimeSelected` callback  
**Solution:** Check Cal.com embed configuration, verify calLink is correct

### Issue: Booking Modal Appears Automatically

**Cause:** `showBookingForm` is true in initial state  
**Solution:** Verify initial state has `showBookingForm: false`

### Issue: Calendar Doesn't Close After "Check Availability"

**Cause:** Modal footer button not triggering `setShowCalendar(false)`  
**Solution:** Check button onClick handler includes `setShowCalendar(false)`

### Issue: Dates Display in Wrong Timezone

**Cause:** Client-side formatting using local browser timezone instead of Asia/Kathmandu  
**Solution:** Verify `formatDateTimeForDisplay` uses "Asia/Kathmandu" string

### Issue: Confirmation Email Not Received

**Cause:** Cal.com API not configured correctly OR booking somehow succeeded without email trigger  
**Solution:** Check CAL_API_KEY is valid in `.env.local`, verify booking was created in Cal.com dashboard

---

## Production Deployment Checklist

- [ ] Remove all `console.log()` statements (or keep for analytics)
- [ ] Verify `.env.local` is in `.gitignore` (never commit API keys)
- [ ] Use `.env.example` as template for production team
- [ ] Test with production Cal.com API key
- [ ] Verify all 4 availability states work correctly
- [ ] Load test: Multiple simultaneous bookings
- [ ] Error scenarios: Network timeout, invalid slot, duplicate booking
- [ ] Email verification: Receive confirmation in production email account
- [ ] Analytics: Track state transitions (optional)
- [ ] Monitoring: Set up alerts for API failures
- [ ] Documentation: Share this file with team

---

## Summary of Changes

| File                                               | Type    | Lines | Purpose                 |
| -------------------------------------------------- | ------- | ----- | ----------------------- |
| `/src/app/api/cal/availability/route.ts`           | Created | 89    | Check slot availability |
| `/src/app/api/cal/booking/route.ts`                | Created | 95    | Create booking          |
| `/src/lib/booking-utils.ts`                        | Created | 200+  | Utility functions       |
| `/src/lib/toast-utils.ts`                          | Created | 150+  | Toast notifications     |
| `/src/lib/providers.tsx`                           | Created | 30    | Global providers        |
| `/src/app/layout.tsx`                              | Updated | 60    | Added Providers wrapper |
| `/src/Views/LandingPage/components/search-bar.tsx` | Updated | 785   | Main booking component  |
| `.env.local`                                       | Updated | 6     | Environment variables   |

**Total Lines Added:** 500+  
**Total Files Modified:** 8  
**Status:** ✅ Ready for Production Testing

---

## Contact & Support

For questions about implementation:

1. Check troubleshooting section above
2. Review inline comments in search-bar.tsx (marked with emojis: ✅, 🔍, ❌, 📅, 📋, 🔄)
3. Check browser console for debug output
4. Verify `.env.local` has all required variables

---

_Last Updated: February 11, 2026_  
_Project Status: Complete & Ready for Testing_
