/**
 * Client Provider Component
 * Wraps the application with necessary providers (Toaster)
 *
 * Usage in layout.tsx:
 * import Providers from "@/lib/providers";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Providers>{children}</Providers>
 *       </body>
 *     </html>
 *   );
 * }
 */

"use client";

import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        theme="light"
        richColors
        closeButton
        expand={true}
        duration={4000}
      />
    </>
  );
}
