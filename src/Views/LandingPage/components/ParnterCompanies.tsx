"use client";

import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import styles from "./ClientSection.module.css";

const clients = [
  {
    id: 1,
    name: "Client 1",
    logo: "/partner/partners8.png",
  },
  {
    id: 2,
    name: "Client 2",
    logo: "/partner/partners8.png",
  },
  {
    id: 3,
    name: "Client 3",
    logo: "/partner/partners10.png",
  },
  {
    id: 4,
    name: "Client 4",
    logo: "/partner/partners8.png",
  },
  {
    id: 5,
    name: "Client 5",
    logo: "/partner/partners10.png",
  },
];

// Memoized client logo component
const ClientLogo = memo(({ logo, name }: { logo: string; name: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      className="shrink-0 flex items-center justify-center h-16 md:h-20 lg:h-48 w-24 md:w-28 lg:w-48 transition-shadow cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative w-14 md:w-16 lg:w-40 h-14 md:h-16 lg:h-40 transition-transform duration-300 ${
          isHovered ? "scale-110 -translate-y-3" : "scale-100"
        }`}
      >
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain drop-shadow-2xl"
          loading="lazy"
        />
      </div>
    </div>
  );
});
ClientLogo.displayName = "ClientLogo";

// Memoized header section
const ClientHeader = memo(() => (
  <div className="text-center mb-8 md:mb-12 lg:mb-16">
    <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-text-secondary mb-2 md:mb-4 font-secondary uppercase px-2">
      Trusted by Leading Companies
    </h2>
    <p className="text-accent text-sm md:text-base lg:text-lg px-2">
      Partnering with industry leaders to deliver excellence
    </p>
  </div>
));
ClientHeader.displayName = "ClientHeader";

// Memoized scroll container
const ClientScrollContainer = memo(
  ({ children }: { children: React.ReactNode }) => (
    <div className="relative overflow-hidden">
      <div className={styles["infinite-scroll"]}>{children}</div>
    </div>
  ),
);
ClientScrollContainer.displayName = "ClientScrollContainer";

const ClientSection = memo(function ClientSection() {
  // Memoize the repeated clients array to prevent recreating on every render
  const repeatedClients = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      return clients.map((client) => ({
        ...client,
        id: `${client.id}-${i}`,
      }));
    }).flat();
  }, []);

  return (
    <div className="w-full py-12 md:py-20 lg:py-40 ">
      <div className="max-w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <ClientHeader />

        {/* Infinite Horizontal Scroller */}
        <ClientScrollContainer>
          {repeatedClients.map((client) => {
            const originalClient = clients.find(
              (c) => c.id === parseInt(String(client.id).split("-")[0]),
            );
            return (
              <ClientLogo
                key={client.id}
                logo={originalClient?.logo || client.logo}
                name={originalClient?.name || client.name}
              />
            );
          })}
        </ClientScrollContainer>
      </div>
    </div>
  );
});

export default ClientSection;
