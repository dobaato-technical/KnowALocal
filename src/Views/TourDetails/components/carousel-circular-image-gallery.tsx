"use client";

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useCallback, useEffect, useRef, useState } from "react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin);
}

interface ImageData {
  title: string;
  url: string;
}

const defaultImages: ImageData[] = [
  {
    title: "Mini canine",
    url: "https://images.unsplash.com/photo-1583551536442-0fc55ac443f6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
  },
  {
    title: "Wheely tent",
    url: "https://images.unsplash.com/photo-1583797227225-4233106c5a2a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
  },
  {
    title: "Red food things",
    url: "https://images.unsplash.com/photo-1561626450-730502dba332?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
  },
  {
    title: "Sand boat",
    url: "https://images.unsplash.com/photo-1585221454166-ce690e60465f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
  },
  {
    title: "Screen thing",
    url: "https://images.unsplash.com/photo-1585427795543-33cf23ea2853?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
  },
  {
    title: "Horse tornado",
    url: "https://images.unsplash.com/photo-1507160874687-6fe86a78b22e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
  },
];

// Main component for the Image Gallery
export function ImageGallery() {
  const [opened, setOpened] = useState(0);
  const [inPlace, setInPlace] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const onClick = (index: number) => {
    if (!disabled) setOpened(index);
  };

  const onInPlace = (index: number) => setInPlace(index);

  const next = useCallback(() => {
    setOpened((currentOpened) => {
      let nextIndex = currentOpened + 1;
      if (nextIndex >= defaultImages.length) nextIndex = 0;
      return nextIndex;
    });
  }, []);

  const prev = useCallback(() => {
    setOpened((currentOpened) => {
      let prevIndex = currentOpened - 1;
      if (prevIndex < 0) prevIndex = defaultImages.length - 1;
      return prevIndex;
    });
  }, []);

  // Disable clicks during animation transitions
  useEffect(() => {
    setDisabled(true);
    const timer = setTimeout(() => setDisabled(false), 800);
    return () => clearTimeout(timer);
  }, [opened]);

  // Autoplay and timer reset logic
  useEffect(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }

    autoplayTimer.current = setInterval(next, 5000);

    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };
  }, [opened, next]);

  return (
    <div className="relative flex items-center justify-center py-16 px-4 w-full mx-auto max-w-7xl font-sans overflow-visible">
      <div className="relative h-[75vmin] w-[75vmin] max-h-[600px] max-w-[600px] overflow-hidden rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-neutral-medium/5">
        {defaultImages.map((image, i) => (
          <div
            key={image.url}
            className="absolute left-0 top-0 h-full w-full"
            style={{ zIndex: inPlace === i ? i : defaultImages.length + 1 }}
          >
            <GalleryImage
              total={defaultImages.length}
              id={i}
              url={image.url}
              open={opened === i}
              inPlace={inPlace === i}
              onInPlace={onInPlace}
            />
          </div>
        ))}
        <div className="absolute left-0 top-0 z-50 h-full w-full pointer-events-none">
          <Tabs images={defaultImages} onSelect={onClick} />
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        className="absolute left-[2%] md:left-[-70px] top-1/2 z-[60] flex h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/95 backdrop-blur-md shadow-xl transition-all hover:scale-110 hover:bg-white active:scale-95 disabled:opacity-40"
        onClick={prev}
        disabled={disabled}
        aria-label="Previous Image"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        className="absolute right-[2%] md:right-[-70px] top-1/2 z-[60] flex h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/95 backdrop-blur-md shadow-xl transition-all hover:scale-110 hover:bg-white active:scale-95 disabled:opacity-40"
        onClick={next}
        disabled={disabled}
        aria-label="Next Image"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

interface GalleryImageProps {
  url: string;
  open: boolean;
  inPlace: boolean;
  id: number;
  onInPlace: (id: number) => void;
  total: number;
}

function GalleryImage({
  url,
  open,
  inPlace,
  id,
  onInPlace,
  total,
}: GalleryImageProps) {
  const [firstLoad, setLoaded] = useState(true);
  const clip = useRef<SVGCircleElement>(null);

  // --- Animation Constants ---
  const gap = 10;
  const circleRadius = 7;
  const defaults = { transformOrigin: "center center" };
  const duration = 0.4; // Faster duration for snappiness
  const width = 400;
  const height = 400;
  const scale = 700;

  const bigSize = circleRadius * scale;
  const overlap = 0;

  // --- Position Calculation Functions ---
  const getPosSmall = () => ({
    cx:
      width / 2 -
      (total * (circleRadius * 2 + gap) - gap) / 2 +
      id * (circleRadius * 2 + gap),
    cy: height - 30,
    r: circleRadius,
  });
  const getPosSmallAbove = () => ({
    cx:
      width / 2 -
      (total * (circleRadius * 2 + gap) - gap) / 2 +
      id * (circleRadius * 2 + gap),
    cy: height / 2,
    r: circleRadius * 2,
  });
  const getPosCenter = () => ({
    cx: width / 2,
    cy: height / 2,
    r: circleRadius * 7,
  });
  const getPosEnd = () => ({
    cx: width / 2 - bigSize + overlap,
    cy: height / 2,
    r: bigSize,
  });
  const getPosStart = () => ({
    cx: width / 2 + bigSize - overlap,
    cy: height / 2,
    r: bigSize,
  });

  // --- Animation Logic ---
  useEffect(() => {
    setLoaded(false);
    if (clip.current) {
      const flipDuration = firstLoad ? 0 : duration;
      const upDuration = firstLoad ? 0 : 0.2;
      const bounceDuration = firstLoad ? 0.01 : 0.6;
      const delay = firstLoad ? 0 : flipDuration + upDuration;

      if (open) {
        gsap
          .timeline()
          .set(clip.current, { ...defaults, ...getPosSmall() })
          .to(clip.current, {
            ...defaults,
            ...getPosCenter(),
            duration: upDuration,
            ease: "circ.inOut",
          })
          .to(clip.current, {
            ...defaults,
            ...getPosEnd(),
            duration: flipDuration,
            ease: "expo.in",
            onComplete: () => onInPlace(id),
          });
      } else {
        gsap
          .timeline({ overwrite: "auto" }) // Use auto overwrite for better control
          .set(clip.current, { ...defaults, ...getPosStart() })
          .to(clip.current, {
            ...defaults,
            ...getPosCenter(),
            delay: delay,
            duration: flipDuration,
            ease: "expo.out",
          })
          .to(clip.current, {
            ...defaults,
            motionPath: {
              path: [getPosSmallAbove(), getPosSmall()],
              curviness: 1,
            },
            duration: bounceDuration,
            ease: "back.out(1.2)", // Snappier back ease
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <defs>
        <clipPath id={`${id}_circleClip`}>
          <circle
            className="clip"
            cx="0"
            cy="0"
            r={circleRadius}
            ref={clip}
          ></circle>
        </clipPath>
        <clipPath id={`${id}_squareClip`}>
          <rect className="clip" width={width} height={height}></rect>
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}${inPlace ? "_squareClip" : "_circleClip"})`}>
        <image
          width={width}
          height={height}
          href={url}
          className="pointer-events-none"
        ></image>
      </g>
    </svg>
  );
}

interface TabsProps {
  images: ImageData[];
  onSelect: (index: number) => void;
}

function Tabs({ images, onSelect }: TabsProps) {
  const gap = 10;
  const circleRadius = 7;
  const width = 400;
  const height = 400;

  const getPosX = (i: number) =>
    width / 2 -
    (images.length * (circleRadius * 2 + gap) - gap) / 2 +
    i * (circleRadius * 2 + gap);
  const getPosY = () => height - 30;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      {images.map((_image, i) => (
        <g key={i} className="pointer-events-auto">
          <circle
            onClick={() => onSelect(i)}
            className="cursor-pointer fill-white/10 stroke-white/40 hover:stroke-white/80 transition-all"
            strokeWidth="1.5"
            cx={getPosX(i)}
            cy={getPosY()}
            r={circleRadius + 4}
          />
        </g>
      ))}
    </svg>
  );
}
