"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { ImageGalleryLightbox } from "./ImageGalleryLightbox";
import type { GalleryImage } from "./ImageGalleryHero";

interface ImageGalleryHeroMainProps {
  image: GalleryImage;
  allImages: GalleryImage[];
  labels: {
    viewAllPhotos: string;
    photoOf: string;
    close: string;
    previous: string;
    next: string;
  };
  index: number;
  categoryBadge?: string;
  isSecondary?: boolean;
  isMobileHero?: boolean;
  viewAllOverlay?: {
    count: number;
    text: string;
  };
}

export function ImageGalleryHeroMain({
  image,
  allImages,
  labels,
  index,
  categoryBadge,
  isSecondary = false,
  isMobileHero = false,
  viewAllOverlay,
}: ImageGalleryHeroMainProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openLightbox}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative block h-full w-full cursor-pointer overflow-hidden group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean"
        aria-label={`${image.alt} — ${labels.photoOf
          .replace("{current}", String(index + 1))
          .replace("{total}", String(allImages.length))}`}
      >
        {/* Image with hover zoom */}
        <Image
          src={image.url}
          alt={image.alt}
          fill
          quality={isSecondary ? 75 : 85}
          sizes={
            isMobileHero
              ? "100vw"
              : isSecondary
                ? "(min-width: 1024px) 25vw, 50vw"
                : "(min-width: 1024px) 50vw, 100vw"
          }
          priority={index === 0}
          placeholder={image.lqip ? "blur" : "empty"}
          blurDataURL={image.lqip}
          className="object-cover transition-transform duration-500 ease-out"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        {/* Subtle gradient overlay for depth — stronger on hero, lighter on secondary */}
        {!isSecondary && (
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  to top,
                  rgba(0, 30, 50, 0.45) 0%,
                  rgba(0, 30, 50, 0.08) 40%,
                  transparent 65%
                )
              `,
            }}
          />
        )}

        {/* Category badge — only on hero image */}
        {categoryBadge && index === 0 && (
          <span className="absolute top-4 left-4 sm:top-5 sm:left-5 z-[5] inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/92 backdrop-blur-sm text-ocean text-xs font-heading font-semibold tracking-wide uppercase rounded-full shadow-sm">
            {categoryBadge}
          </span>
        )}

        {/* Photo counter pill — bottom-right on mobile hero */}
        {isMobileHero && allImages.length > 1 && (
          <span className="absolute bottom-4 right-4 z-[5] inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate/75 backdrop-blur-sm text-white text-xs font-body font-medium rounded-full">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            1 / {allImages.length}
          </span>
        )}

        {/* Hover indicator — subtle camera icon appears */}
        {!viewAllOverlay && (
          <div
            className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            </div>
          </div>
        )}

        {/* "View all photos" overlay — only on the last visible desktop tile */}
        {viewAllOverlay && (
          <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center bg-slate/55 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-slate/65">
            <svg
              className="w-7 h-7 text-white mb-2"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
            <span className="text-white font-heading font-semibold text-sm tracking-wide">
              +{viewAllOverlay.count} {viewAllOverlay.text}
            </span>
          </div>
        )}
      </button>

      {/* Lightbox — portaled, only mounts when open */}
      {lightboxOpen && (
        <ImageGalleryLightbox
          images={allImages}
          initialIndex={index}
          labels={labels}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
