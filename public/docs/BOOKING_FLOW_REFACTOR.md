# Cal.com UI-Driven Booking Flow - REFACTORED

**Date**: February 11, 2026  
**Status**: ✅ Fixed - Cal.com is now ONLY for datetime picking

## Overview

The booking flow has been completely refactored so that **Cal.com is ONLY used as a datetime picker**, not for availability or booking decisions. Your custom UI controls the entire booking workflow.

## 🔄 New Booking Flow

```
┌─────────────────────────────────┐
│  1. User clicks "Select Date   │
│     & Time" in search bar        │
└──────────────┬──────────────────┘
               │
               ▼
        ┌──────────────┐
        │ Cal.com      │
        │ Calendar     │
        │ Opens        │
        │ (modal)      │
        └──────┬───────┘
               │
               ▼
      ┌─────────────────────┐
      │  2. User selects    │
      │  date & time from   │
      │  Cal.com calendar   │
      │                     │
      │  ✅ Cal closes      │
      │  ✅ NO availability │
      │     check happens   │
      │  ✅ Datetime is     │
      │     tentative       │
      └────────┬────────────┘
               │
               ▼
    ┌────────────────────────┐
    │  3. Selected datetime  │
    │  appears in search bar │
    │  + "Check Availability"│
    │  button shown          │
    └──────────┬─────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼ (user clicks)   │
┌──────────────────┐    │ (or closes)
│ 4. Check         │    │
│ Availability API │    │
│ call             │    │
└────────┬─────────┘    │
         │              │
    ┌────┴────┐         │
    │          │         │
Available   Unavailable  │
    │          │         │
    ▼          ▼         ▼
┌────┐    ┌────┐   ┌──────┐
│"✓" │    │"❌"│   │Reset │
│Con-│    │Try │   │selec-│
│firm│    │Another│tion  │
│Book│    │Time│   └──────┘
│ing"│    └────┘
└──┬──┘
   │
   ▼
┌──────────────────────┐
│ 5. Booking form      │
│ appears (modal)      │
│ - Name input         │
│ - Email input        │
│ - "Confirm Booking"  │
│   button             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 6. Call Booking API  │
│ + Send confirmation  │
│   email via Cal.com  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 7. Success toast     │
│ Reset form           │
│ Ready for next order │
└──────────────────────┘
```

## 🔑 Key Concept Changes

### BEFORE (Cal-driven)

- Cal.com modal had "Check Availability" button
- Availability was implicitly assumed after selection
- Flow felt like Cal was in control

### AFTER (UI-driven)

- Cal.com modal ONLY shows calendar
- Modal closes immediately after date/time selection
- Availability status is "idle" after selection (tentative)
- **Your custom "Check Availability" button controls the flow**
- Availability is checked ONLY when user explicitly clicks the button
- Booking form appears ONLY after availability confirmed

## 📋 State Management

```typescript
type AvailabilityStatus = "idle" | "checking" | "available" | "unavailable";

interface BookingState {
  // TENTATIVE: No availability assumed
  selectedDateTime: string | null;

  // CONTROLLED BY USER ACTION ONLY
  availabilityStatus: AvailabilityStatus;

  // COLLECTED AFTER AVAILABILITY CONFIRMED
  attendeeName: string;
  attendeeEmail: string;
  isConfirmingBooking: boolean;
}
```

### State Transitions

```
selectedDateTime = null
availabilityStatus = "idle"
        │
        │ (User selects date from Cal)
        ▼
selectedDateTime = "2026-02-14T14:30:00Z"
availabilityStatus = "idle"  ← TENTATIVE, not assumed available
        │
        │ (User clicks "Check Availability")
        ▼
availabilityStatus = "checking"  ← API call in progress
        │
   ┌────┴────┐
   │          │
   ▼ (API ok) ▼ (API error)
available   unavailable
   │          │
   ▼          ▼
"Confirm"   "Try Another"
button       button
```

## 🎯 Cal.com Integration Changes

### Reduced Responsibility

Cal.com now handles ONLY:

- ✅ Date/time picker UI
- ✅ Calendar visualization
- ✅ Booking creation (via API route)
- ✅ Confirmation email sending

Cal.com NO LONGER handles:

- ❌ Availability checking (your API route does this)
- ❌ Availability display (your UI does this)
- ❌ Booking form (your UI collects name/email)

### Event Handling

```typescript
// Listen for date selection
cal("on", {
  action: "dateTimeSelected",
  callback: (eventData: any) => {
    // Extract selected datetime
    // Close modal immediately
    // Reset availability status to "idle"
  },
});

// Listen for booking events (optional)
cal("on", {
  action: "eventScheduled",
  callback: () => {
    // Close modal if booking somehow happened through Cal
    setShowCalendar(false);
  },
});
```

## 🎨 UI Layout Changes

### Before

```
┌─ Search Bar ─────────────────┐
│ Destination | Cal Modal      │
│             ├─ Calendar      │
│             ├─ [Cancel]      │
│             └─ [Check Avail] │ ← In modal
└──────────────────────────────┘
```

### After

```
┌─ Search Bar ─────────────────┐
│ Destination                  │
│ │ Select Date & Time         │
│ │  (click to open Cal)       │
│ │                            │
│ │ CONDITIONAL (if selected): │
│ │ ├─ Selected: Feb 14, 2 PM  │
│ │ ├─ [Check Availability] ← Moved out!
│ │ │ or                       │
│ │ ├─ "Checking..." (spinner) │
│ │ │ or                       │
│ │ ├─ ❌ Unavailable          │
│ │ │  [Try Another Time]     │
│ │ │ or                       │
│ │ ├─ ✓ Available             │
│ │ │  [Confirm Booking]      │
│ │                            │
│ │ CAL MODAL (if open):       │
│ │ ├─ Calendar                │
│ │ └─ [Done]                  │
│                              │
│ Search [→]                   │
└──────────────────────────────┘

┌─ Booking Modal ──────────────┐ (appears only after available)
│ Complete Your Booking        │
│ • Time: Feb 14, 2 PM ✓       │
│                              │
│ Full Name: [____________]    │
│ Email: [_________________]   │
│                              │
│ Tour Details:                │
│ • Destination: ...           │
│ • Duration: 30 min           │
│ • Timezone: Asia/Kathmandu   │
│                              │
│ [Cancel] [Confirm Booking]   │
└──────────────────────────────┘
```

## 💻 Code Changes Summary

### Component Structure

**Files Modified:**

- `src/Views/LandingPage/components/search-bar.tsx` - Main refactor

**State Refactored:**

```typescript
// OLD
isCheckingAvailability: boolean;
isSlotAvailable: boolean | null;
showBookingForm: boolean;

// NEW
availabilityStatus: "idle" | "checking" | "available" | "unavailable";
```

**Handlers Refactored:**

```typescript
// Separated concerns

// 1. Date selection only
handleDateTimeSelected()
  → Set selectedDateTime
  → Set availabilityStatus = "idle"
  → Close calendar

// 2. Availability check only
handleCheckAvailability()
  → Set availabilityStatus = "checking"
  → Call API
  → Set availabilityStatus = "available" | "unavailable"

// 3. Show booking form only
handleShowBookingForm()
  → Verify availabilityStatus === "available"
  → Form appears in modal

// 4. Confirm booking only
handleConfirmBooking()
  → Validate form
  → Call booking API
  → Reset all state
```

## 🔒 Security & Validation

- ✅ API keys remain server-side only
- ✅ Availability checked before booking allowed
- ✅ Form validation on both frontend and backend
- ✅ Email validation prevents invalid bookings
- ✅ Timezone handled server-side for accuracy

## 🧪 Testing the New Flow

### Manual Test Checklist

1. **Date Selection**
   - [ ] Click "Select Date & Time"
   - [ ] Cal.com calendar opens
   - [ ] Select a date/time
   - [ ] Calendar closes automatically
   - [ ] Selected datetime displays in search bar
   - [ ] "Check Availability" button visible

2. **Availability Checking**
   - [ ] Click "Check Availability"
   - [ ] Loading spinner shows
   - [ ] See result (available or unavailable)
   - [ ] Toast notification appears

3. **Available Slot**
   - [ ] When available, "✓ Confirm Booking" button shows
   - [ ] Click button
   - [ ] Booking form modal appears
   - [ ] Green checkmark shows availability status

4. **Unavailable Slot**
   - [ ] When unavailable, error message shows
   - [ ] "❌ This slot is already booked"
   - [ ] "Try Another Time" button available
   - [ ] Can select new date/time

5. **Booking Confirmation**
   - [ ] Enter name and email
   - [ ] Click "Confirm Booking"
   - [ ] Loading spinner shows
   - [ ] Success toast appears
   - [ ] Form resets
   - [ ] Check email for confirmation

6. **Error Handling**
   - [ ] Invalid email shows error
   - [ ] Empty name shows error
   - [ ] API errors show friendly messages
   - [ ] Can retry without page refresh

## 🔄 Availability Status Meanings

| Status          | Meaning                                         | User sees                   |
| --------------- | ----------------------------------------------- | --------------------------- |
| `"idle"`        | Date selected, but availability not checked yet | "Check Availability" button |
| `"checking"`    | Availability API call in progress               | Spinner, disabled button    |
| `"available"`   | API confirmed slot is available                 | "✓ Confirm Booking" button  |
| `"unavailable"` | API confirmed slot is booked                    | "❌ Unavailable" message    |

## 📝 Comments in Code

The refactored component includes extensive comments explaining:

- Why Cal.com is picker-only
- State management philosophy
- When each handler is called
- Why availability is tentative after selection
- How the flow differs from previous implementation

```typescript
/**
 * CRITICAL: Cal.com is ONLY used as a date/time picker here
 * - We capture the selected datetime
 * - Close the modal immediately
 * - Reset availability status to "idle" (tentative datetime)
 * - User must click "Check Availability" button to proceed
 */
```

## ✨ User Experience Improvements

**Before:**

- User had to click inside modal footer for "Check Availability"
- Flow felt passive (Cal was deciding)
- Unclear when availability was being checked

**After:**

- Clear flow: Select → Check → Confirm
- User has explicit control over each step
- Availability check is obvious (separate button)
- Booking form only appears when confirmed available
- All states clearly communicated with loading spinners and messages

## 🚀 Next Steps

1. ✅ Refactored component to be UI-driven
2. ✅ Cal.com is now picker-only
3. ✅ Availability controlled by custom button
4. ✅ State management simplified
5. Test the new flow end-to-end
6. Gather user feedback
7. Consider adding:
   - Multiple time slot suggestions
   - Timezone selector
   - Terms & conditions acceptance
   - Guest count input

## 📞 Support

If the flow still doesn't feel right or you need further adjustments:

1. Check the new state transitions in the code
2. Review the booking flow diagram above
3. Test each step manually
4. Verify Cal.com events are firing correctly (check browser console)

---

**Implementation Complete** ✅  
The Cal.com booking flow is now UI-driven, production-ready, and ready for testing.
