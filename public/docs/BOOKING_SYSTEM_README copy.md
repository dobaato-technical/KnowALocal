# Cal.com Booking Flow Implementation

Complete production-ready booking system for Know A Local using Cal.com as the backend booking engine.

## 📋 Overview

This implementation provides:

- ✅ Cal.com calendar UI in modal for date/time selection
- ✅ Availability checking before booking
- ✅ Booking confirmation with auto-generated emails via Cal.com
- ✅ Asia/Kathmandu timezone handling
- ✅ Error handling and loading states
- ✅ Toast notifications for user feedback
- ✅ Server-side API routes (secure, no frontend API key exposure)
- ✅ Form validation
- ✅ Production-ready code with comments

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install sonner
# Already have: @calcom/embed-react
```

### 2. Update Environment Variables

Your `.env.local` already has:

```env
NEXT_PUBLIC_CAL_EVENT_TYPE_ID=4718087  # Add this if missing
CAL_API_KEY=cal_live_xxxxx
CAL_USERNAME=know-a-local-okxsgd
```

### 3. Add Toaster to Root Layout

Update `src/app/layout.tsx`:

```tsx
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

Alternatively, add the Toaster directly:

```tsx
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="bottom-right" theme="light" richColors closeButton />
      </body>
    </html>
  );
}
```

### 4. Done! 🎉

The SearchBar component is already updated with the booking flow. Users can now:

1. Select date/time from Cal.com calendar
2. Check availability
3. Enter their details
4. Confirm booking (confirmation email sent automatically)

## 📁 Files Created

```
src/
├── app/
│   └── api/
│       └── cal/
│           ├── availability/route.ts    # Check slot availability
│           └── booking/route.ts         # Create booking & send email
├── lib/
│   ├── booking-utils.ts                 # Helper functions
│   ├── toast-utils.ts                   # Toast notifications
│   └── providers.tsx                    # Client providers (optional)
└── Views/
    └── LandingPage/
        └── components/
            └── search-bar.tsx           # Updated with booking flow
```

## 🔄 Booking Flow

```
┌─────────────────────────────────────┐
│  User Opens SearchBar               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  User Selects Date/Time from        │
│  Cal.com Calendar                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Click "Check Availability" Button  │
│  API: GET /api/cal/availability     │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────┐
         │           │
    Available?   Unavailable?
         │           │
         ▼           ▼
    Show Form    Show Error
         │         Toast
         ▼           │
    ┌────────────┐  └─→ (End)
    │ User enters│
    │ name/email │
    └─────┬──────┘
          │
          ▼
    ┌──────────────────────┐
    │ Click "Confirm       │
    │ Booking" Button      │
    │ POST /api/cal/booking│
    └─────┬────────────────┘
          │
     ┌────┴────┐
     │          │
 Success   Error
     │          │
     ▼          ▼
  Show    Show Error
Success   Toast
 Toast    │
     │    └─→ (End)
     │
     ▼
 Show Booking
 Confirmation
     │
     ▼
 Reset Form
  (Ready for
  next booking)
```

## 🔑 API Endpoints

### GET /api/cal/availability

Check if a time slot is available.

**Query Parameters:**

- `eventTypeId` (string): Cal.com event type ID
- `startTime` (string): ISO 8601 datetime (UTC will be converted to Asia/Kathmandu)
- `duration` (string): Duration in minutes (default: 30)

**Example:**

```
GET /api/cal/availability?eventTypeId=4718087&startTime=2026-02-14T14:30:00Z&duration=30
```

**Response:**

```json
{
  "available": true,
  "availableSlots": [...],
  "message": "Slot available"
}
```

### POST /api/cal/booking

Create a booking and send confirmation email.

**Body:**

```json
{
  "eventTypeId": "4718087",
  "startTime": "2026-02-14T14:30:00Z",
  "attendeeEmail": "user@example.com",
  "attendeeName": "John Doe",
  "timezone": "Asia/Kathmandu",
  "metadata": {
    "tourType": "cultural",
    "groupSize": 4
  }
}
```

**Response:**

```json
{
  "success": true,
  "bookingId": "12345",
  "confirmationUrl": "https://cal.com/...",
  "message": "Booking confirmed! Confirmation email has been sent."
}
```

## 🛠️ Utility Functions

### Booking Utils

`src/lib/booking-utils.ts` provides:

```typescript
// Format date for display
formatDateTimeForDisplay(isoString, timezone);
// → "Feb 14, 2026 - 2:30 PM"

// Check availability
checkAvailability(eventTypeId, startTime, duration);
// → { available: boolean, message: string }

// Create booking
createBooking(eventTypeId, startTime, email, name, timezone);
// → { success: boolean, bookingId?, error? }

// Validate booking form
validateBookingForm(name, email, dateTime);
// → { valid: boolean, errors: {} }
```

### Toast Utils

`src/lib/toast-utils.ts` provides:

```typescript
// Show toast notification
showToast(message, type, options);

// Show availability feedback
showAvailabilityToast(available, message);

// Show booking success
showBookingSuccessToast(bookingId);

// Show booking error
showBookingErrorToast(error);
```

## 🌍 Timezone Handling

Current timezone: **Asia/Kathmandu (UTC+5:45)**

**How it works:**

1. User selects time in their browser (browser's local timezone)
2. Browser sends ISO string (UTC) to server
3. API converts UTC → Asia/Kathmandu
4. Cal.com confirms availability in that timezone
5. User sees formatted time in Asia/Kathmandu

**To change timezone:**

1. `src/lib/booking-utils.ts`:
   - Update `formatDateTimeForDisplay()` timezone parameter
   - Update `getCurrentDateInKathmandu()` to your timezone

2. `src/app/api/cal/availability/route.ts`:
   - Update `convertToKathmandu()` function
   - Change "Asia/Kathmandu" to your timezone

3. `src/app/api/cal/booking/route.ts`:
   - Update default timezone in request body

Example for US Eastern Time:

```typescript
// Change "Asia/Kathmandu" to "America/New_York"
const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  // ...
});
```

## 🛡️ Security

- ✅ **API keys hidden**: Cal.com API key only used in server-side route handlers
- ✅ **Input validation**: All form fields validated before API calls
- ✅ **No direct API calls**: Frontend never calls Cal.com API directly
- ✅ **Email validation**: Regex validation before booking creation
- ✅ **Error messages**: User-friendly without exposing sensitive info

## ⚙️ Configuration

### Change Event Duration

1. Update `.env.local`:

```env
NEXT_PUBLIC_CAL_EVENT_TYPE_ID=YOUR_EVENT_TYPE_ID
```

2. Update `search-bar.tsx`:

```typescript
// Find handleCheckAvailability()
// Change the "30" to your desired duration (in minutes)
await checkAvailability(
  eventTypeIdRef.current,
  bookingState.selectedDateTime,
  "60", // Change this
);
```

### Customize Styling

Search-bar uses these colors:

- Primary: `#335358` (dark teal)
- Accent: `#774738` (brown)
- Highlight: `#d69850` (gold)
- Secondary: `#69836a` (sage green)
- Background: `#f8f1dd` (cream)
- Border: `#bcd2c2` (light green)

Update className values to match your brand colors.

### Add Metadata to Bookings

Pass metadata when creating booking:

```typescript
const result = await createBooking(
  eventTypeId,
  startTime,
  email,
  name,
  "Asia/Kathmandu",
  {
    tourId: destination.id,
    groupSize: guests,
    currency: "NPR",
    notes: "Prefer morning tours",
  },
);
```

The metadata will be stored with the booking in Cal.com.

## 🧪 Testing

### Manual Testing Checklist

- [ ] Install sonner with `npm install sonner`
- [ ] Add Toaster to root layout
- [ ] Open the search bar
- [ ] Click "Tour Date & Time" button
- [ ] Calendar modal opens
- [ ] Select a date and time
- [ ] Click "Check Availability"
- [ ] See loading spinner
- [ ] See success/error toast based on availability
- [ ] If available, booking form appears
- [ ] Enter valid name and email
- [ ] View booking details summary
- [ ] Click "Confirm Booking"
- [ ] See loading spinner
- [ ] See success toast with confirmation message
- [ ] Check email for confirmation (if using real Cal.com account)
- [ ] Form resets
- [ ] Try with invalid email (should show error)
- [ ] Try with missing fields (should show errors)
- [ ] Try unavailable slot (should show error toast)
- [ ] Check browser console for API logs

### Using Cal.com Sandbox

To test without sending real emails:

1. Use Cal.com's sandbox credentials
2. Create test event types
3. Update `.env.local` with sandbox credentials
4. Bookings won't trigger real emails

## 📊 Monitoring

To monitor bookings, check:

1. **Cal.com Dashboard**: https://cal.com/settings/bookings
2. **Browser Console**: All API calls logged with timestamps
3. **Server Logs**: Check Next.js console for errors

## 🐛 Troubleshooting

### Calendar not loading

- Check if `@calcom/embed-react` is installed
- Verify `CAL_USERNAME` in `.env.local`
- Check browser console for errors

### Availability check returns false

- Verify `eventTypeId` is correct
- Check if slot is actually available in Cal.com
- Check API key permissions

### Emails not sending

- Verify Cal.com account has email feature enabled
- Check Cal.com settings for email templates
- Try with sandbox credentials first

### Timezone mismatch

- Check if timezone string is valid (e.g., "Asia/Kathmandu")
- Test with different browsers
- Log the converted time in the API route

### Toast notifications not showing

- Ensure Toaster is added to root layout
- Check if sonner is installed: `npm list sonner`
- Verify no CSS conflicts with Tailwind

## 📚 References

- [Cal.com API Documentation](https://cal.com/docs/api)
- [Cal.com Embed React](https://github.com/calcom/cal.com/tree/main/packages/embeds/embed-react)
- [Sonner Toast Library](https://sonner.emilkowal.ski/)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 🎨 Component Props

### SearchBar Component

```typescript
interface SearchBarProps {
  transparent?: boolean; // Use transparent styling
  onSearch?: (filters) => void; // Called when user clicks "Search Tours"
}
```

**Usage:**

```tsx
<SearchBar transparent={false} onSearch={(filters) => console.log(filters)} />
```

## 📝 Notes

- All API routes validate input before sending to Cal.com
- Emails are sent by Cal.com (no custom email setup needed)
- Timezone conversion happens server-side for accuracy
- Loading states use Lucide React spinner icon
- Error handling is comprehensive with user-friendly messages
- Code follows TypeScript best practices with strict typing

## 🚦 Status Indicators

- **Green**: Slot available, ready to book
- **Red**: Slot unavailable or error occurred
- **Blue**: Loading/processing
- **Gray**: Disabled (incomplete form)

## 📞 Support

For issues with:

- **Cal.com Integration**: Check Cal.com documentation
- **Email Delivery**: Check Cal.com email settings
- **Timezone Issues**: Verify timezone string is valid
- **API Errors**: Check console logs in browser and terminal

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
