"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import type { GalleryImage } from "./ImageGalleryHero";

interface ImageGalleryLightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  labels: {
    photoOf: string;
    close: string;
    previous: string;
    next: string;
  };
  onClose: () => void;
}

export function ImageGalleryLightbox({
  images,
  initialIndex,
  labels,
  onClose,
}: ImageGalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Entrance animation
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsEntering(false), 50);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + images.length) % images.length);
      setTouchDelta(0);
    },
    [images.length],
  );

  const goNext = useCallback(
    () => goTo(currentIndex + 1),
    [currentIndex, goTo],
  );
  const goPrev = useCallback(
    () => goTo(currentIndex - 1),
    [currentIndex, goTo],
  );

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose(), 250);
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          goNext();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        case "Escape":
          handleClose();
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, handleClose]);

  // Touch / swipe handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart === null) return;
      setTouchDelta(e.touches[0].clientX - touchStart);
    },
    [touchStart],
  );

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(touchDelta) > 50) {
      if (touchDelta < 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
    setTouchDelta(0);
  }, [touchDelta, goNext, goPrev]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;
    const activeThumb = container.children[currentIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  const currentImage = images[currentIndex];
  const counterText = labels.photoOf
    .replace("{current}", String(currentIndex + 1))
    .replace("{total}", String(images.length));

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={counterText}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate/95 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: isEntering || isExiting ? 0 : 1,
        }}
        onClick={handleClose}
      />

      {/* Top bar — counter + close */}
      <div
        className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 transition-all duration-300"
        style={{
          opacity: isEntering || isExiting ? 0 : 1,
          transform:
            isEntering || isExiting ? "translateY(-12px)" : "translateY(0)",
        }}
      >
        <span className="text-white/80 text-sm font-body font-medium">
          {counterText}
        </span>
        <button
          type="button"
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white"
          aria-label={labels.close}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Main image area */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-16 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Prev arrow — desktop */}
        <button
          type="button"
          onClick={goPrev}
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white"
          aria-label={labels.previous}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Image */}
        <div
          className="relative w-full max-w-5xl max-h-[70vh] aspect-[4/3] transition-all duration-300 ease-out"
          style={{
            opacity: isEntering || isExiting ? 0 : 1,
            transform:
              isEntering || isExiting
                ? "scale(0.92)"
                : `scale(1) translateX(${touchDelta}px)`,
          }}
        >
          <Image
            key={currentIndex}
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            quality={90}
            sizes="(max-width: 639px) calc(100vw - 2rem), min(calc(100vw - 8rem), 64rem)"
            placeholder={currentImage.lqip ? "blur" : "empty"}
            blurDataURL={currentImage.lqip}
            className="object-contain rounded-lg"
          />
        </div>

        {/* Next arrow — desktop */}
        <button
          type="button"
          onClick={goNext}
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white"
          aria-label={labels.next}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      {/* Bottom thumbnail strip */}
      <div
        className="relative z-10 py-3 px-4 transition-all duration-300"
        style={{
          opacity: isEntering || isExiting ? 0 : 1,
          transform:
            isEntering || isExiting ? "translateY(16px)" : "translateY(0)",
        }}
      >
        <div
          ref={thumbnailContainerRef}
          className="flex gap-2 overflow-x-auto justify-center scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className="relative flex-shrink-0 w-14 h-10 sm:w-16 sm:h-12 rounded-md overflow-hidden transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white"
              style={{
                opacity: i === currentIndex ? 1 : 0.5,
                outline:
                  i === currentIndex
                    ? "2px solid rgba(255,255,255,0.9)"
                    : "none",
                outlineOffset: "2px",
              }}
              aria-label={labels.photoOf
                .replace("{current}", String(i + 1))
                .replace("{total}", String(images.length))}
              aria-current={i === currentIndex ? "true" : undefined}
            >
              <Image
                src={img.url}
                alt=""
                fill
                quality={30}
                sizes="(min-width: 640px) 64px, 56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
