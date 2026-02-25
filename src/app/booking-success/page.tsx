"use client";

import BookingSuccess from "@/components/ui/booking-success";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingSuccess />
    </Suspense>
  );
}
