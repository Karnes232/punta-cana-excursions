"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { ImageGalleryLightbox } from "./ImageGalleryLightbox";
import type { GalleryImage } from "./ImageGalleryHero";

interface ImageGalleryThumbnailStripProps {
  images: GalleryImage[];
  labels: {
    viewAllPhotos: string;
    photoOf: string;
    close: string;
    previous: string;
    next: string;
  };
}

export function ImageGalleryThumbnailStrip({
  images,
  labels,
}: ImageGalleryThumbnailStripProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(true);

  const openAt = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  // Track scroll position to show/hide right fade
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      setShowFade(!atEnd);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="relative bg-white">
        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          className="flex gap-1.5 overflow-x-auto px-3 py-3 scrollbar-hide"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openAt(i)}
              className="relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ocean group"
              style={{ scrollSnapAlign: "start" }}
              aria-label={`${labels.photoOf
                .replace("{current}", String(i + 1))
                .replace("{total}", String(images.length))}`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                quality={50}
                sizes="80px"
                placeholder={img.lqip ? "blur" : "empty"}
                blurDataURL={img.lqip}
                className="object-cover transition-opacity duration-200 group-hover:opacity-80"
              />
            </button>
          ))}

          {/* "View all" pill at the end */}
          {images.length > 4 && (
            <button
              type="button"
              onClick={() => openAt(0)}
              className="flex-shrink-0 w-20 h-16 rounded-lg bg-sand flex flex-col items-center justify-center gap-0.5 text-ocean hover:bg-ocean/5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ocean"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
              <span className="text-[10px] font-heading font-semibold leading-none">
                +{images.length}
              </span>
            </button>
          )}
        </div>

        {/* Right fade indicator — shows there's more to scroll */}
        <div
          className="absolute top-0 right-0 bottom-0 w-10 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: showFade ? 1 : 0,
            background:
              "linear-gradient(to left, rgba(255,255,255,0.95) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageGalleryLightbox
          images={images}
          initialIndex={lightboxIndex}
          labels={labels}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
