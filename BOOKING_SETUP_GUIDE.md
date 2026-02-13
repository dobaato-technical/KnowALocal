/\*\*

- Cal.com Booking Integration Setup Guide
-
- This guide explains the booking flow implementation for your Next.js app
- with Cal.com backend and production-ready error handling.
  \*/

/\*\*

- SETUP INSTRUCTIONS
- ==================
-
- 1.  INSTALL DEPENDENCIES
- ***
- Required packages:
- - sonner (for toast notifications)
- - cal.com/embed-react (already in package.json)
-
- Run:
- npm install sonner
-
- 2.  ENVIRONMENT VARIABLES
- ***
- Your .env.local already has:
- - NEXT_PUBLIC_CAL_EVENT_TYPE_ID (needed by search-bar.tsx)
- - CAL_API_KEY
- - CAL_USERNAME
-
- 3.  ADD TOASTER TO ROOT LAYOUT
- ***
- Update your root layout.tsx:
-
- import { Toaster } from "sonner";
-
- export default function RootLayout({ children }: { children: React.ReactNode }) {
- return (
-     <html lang="en">
-       <body>
-         {children}
-         <Toaster
-           position="bottom-right"
-           theme="light"
-           richColors
-           closeButton
-         />
-       </body>
-     </html>
- );
- }
  \*/

/\*\*

- FILE STRUCTURE CREATED
- =======================
-
- /api/cal/
- ├── availability/route.ts - Check slot availability
- ├── booking/route.ts - Create booking confirmation
-
- /lib/
- ├── booking-utils.ts - Booking helper functions
- ├── toast-utils.ts - Toast notification utilities
-
- /Views/LandingPage/components/
- └── search-bar.tsx - Enhanced with booking flow
  \*/

/\*\*

- BOOKING FLOW EXPLANATION
- =========================
-
- 1.  USER SELECTS DATE/TIME
- - User clicks "Tour Date & Time" button
- - Cal.com embed opens in modal
- - User selects date and time
- - Calendar modal shows "Check Availability" button
-
- 2.  CHECK AVAILABILITY
- - Frontend calls /api/cal/availability
- - API converts user timezone (UTC) to Asia/Kathmandu
- - Cal.com API confirms slot availability
- - If available → booking form appears
- - If unavailable → toast: "This slot is already booked"
-
- 3.  BOOKING FORM
- - User enters name and email
- - Form validates (required fields, valid email)
- - "Confirm Booking" button submits data
-
- 4.  CREATE BOOKING
- - Frontend calls /api/cal/booking
- - API creates booking via Cal.com API
- - Cal.com automatically sends confirmation email
- - Success toast shown to user
- - Form resets for next booking
    \*/

/\*\*

- TIMEZONE HANDLING
- ==================
-
- Current Implementation: Asia/Kathmandu (UTC+5:45)
-
- Flow:
- 1.  User selects time in browser (local timezone)
- 2.  Frontend sends ISO string (UTC)
- 3.  availability/route.ts converts UTC → Asia/Kathmandu
- 4.  Cal.com confirms availability in that timezone
- 5.  User sees formatted time (Asia/Kathmandu)
-
- To change timezone:
- - Update "Asia/Kathmandu" in functions:
- - booking-utils.ts: formatDateTimeForDisplay()
- - availability/route.ts: convertToKathmandu()
- - booking/route.ts: sendDatetime (timezone field)
    \*/

/\*\*

- API ENDPOINTS
- ==============
-
- GET /api/cal/availability
- Query parameters:
- - eventTypeId: string (from CAL_EVENT_TYPE_ID env)
- - startTime: string (ISO 8601 datetime)
- - duration: string (minutes, default: 30)
-
- Response:
- {
- available: boolean
- availableSlots?: Array<{ time: string, available: boolean }>
- message: string
- }
-
- POST /api/cal/booking
- Body:
- {
- eventTypeId: string
- startTime: string (ISO 8601)
- attendeeEmail: string
- attendeeName: string
- timezone?: string (default: "Asia/Kathmandu")
- metadata?: object (optional)
- }
-
- Response:
- {
- success: boolean
- bookingId?: string
- confirmationUrl?: string
- message?: string
- error?: string
- }
  \*/

/\*\*

- ERROR HANDLING
- ===============
-
- Availability Check Errors:
- - Invalid event type → API returns 400
- - Cal.com API down → Falls back to "unavailable"
- - Network error → Toast notification with retry option
-
- Booking Errors:
- - Invalid email → Form validation before API call
- - Slot already booked → Cal.com API returns error
- - Missing fields → Form validation catches this
-
- All errors show user-friendly toast messages
- API errors logged to console for debugging
  \*/

/\*\*

- SECURITY NOTES
- ===============
-
- ✓ API Key never exposed to frontend (server-side only)
- ✓ Route handlers validate all inputs
- ✓ Email validation on frontend and backend
- ✓ Timezone handling prevents timezone confusion
- ✓ No direct Cal.com API calls from frontend
-
- Frontend sends data →
- Route handler validates →
- Route handler calls Cal.com with API key →
- Returns sanitized response to frontend
  \*/

/\*\*

- TESTING CHECKLIST
- ==================
-
- □ Install sonner package
- □ Add Toaster to root layout
- □ Test calendar opens/closes
- □ Select date/time from calendar
- □ Click "Check Availability"
- □ See availability result (success/failure toast)
- □ Fill booking form with valid data
- □ Click "Confirm Booking"
- □ Verify confirmation email sent (to test email)
- □ Test with invalid email (should show error)
- □ Test with unavailable slot
- □ Check console for API logs
- □ Test loading states (spinners show during API calls)
- □ Test modal close buttons
- □ Test timezone displays correctly
  \*/

/\*\*

- CUSTOMIZATION OPTIONS
- =======================
-
- Change Duration:
- - Update "30" in search-bar.tsx handleCheckAvailability()
- - Update CAL_EVENT_TYPE_ID in .env.local
-
- Change Timezone:
- - Search "Asia/Kathmandu" in booking-utils.ts and availability/route.ts
- - Replace with desired timezone (e.g., "America/New_York")
-
- Change Styling:
- - Search-bar uses Tailwind + custom colors (#335358, #774738, etc.)
- - Update color values in className strings
- - Booking modal styling in handleConfirmBooking section
-
- Add Metadata to Booking:
- - Pass metadata object to createBooking()
- - Example: { tourId: "123", currency: "NPR" }
    \*/

export const setupInstructions = {
installDependencies: "npm install sonner",
requiredEnvVars: [
"NEXT_PUBLIC_CAL_EVENT_TYPE_ID",
"CAL_API_KEY",
"CAL_USERNAME",
],
files: [
"src/app/api/cal/availability/route.ts",
"src/app/api/cal/booking/route.ts",
"src/lib/booking-utils.ts",
"src/lib/toast-utils.ts",
"src/Views/LandingPage/components/search-bar.tsx",
],
};
