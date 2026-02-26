"use client";

import dynamic from "next/dynamic";

// ssr: false is only valid inside a Client Component
const ScrollProgressBar = dynamic(
  () => import("@/components/common/ScrollProgressBar"),
  { ssr: false },
);

export default function ScrollProgressBarClient() {
  return <ScrollProgressBar />;
}
