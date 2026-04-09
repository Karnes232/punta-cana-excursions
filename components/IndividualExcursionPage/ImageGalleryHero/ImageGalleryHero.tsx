import { ImageGalleryHeroMain } from "./ImageGalleryHeroMain";
import { ImageGalleryThumbnailStrip } from "./ImageGalleryThumbnailStrip";

// Types matching your Sanity Excursion schema gallery fields
export interface GalleryImage {
  url: string;
  alt: string;
  lqip?: string; // Low-quality image placeholder from Sanity
  width?: number;
  height?: number;
}

interface ImageGalleryHeroProps {
  /** The primary hero image (Sanity heroImage field) */
  heroImage: GalleryImage;
  /** Additional gallery images (Sanity gallery array field) */
  galleryImages: GalleryImage[];
  /** Excursion title — used for breadcrumb context and aria-label */
  excursionTitle: string;
  /** Category badge label (e.g. "Island Tour", "Adventure") */
  categoryBadge?: string;
  /** i18n labels */
  labels: {
    viewAllPhotos: string; // "View all photos" / "Ver todas las fotos"
    photoOf: string; // "Photo {current} of {total}" / "Foto {current} de {total}"
    close: string; // "Close" / "Cerrar"
    previous: string; // "Previous" / "Anterior"
    next: string; // "Next" / "Siguiente"
  };
}

export function ImageGalleryHero({
  heroImage,
  galleryImages,
  excursionTitle,
  categoryBadge,
  labels,
}: ImageGalleryHeroProps) {
  // Combine hero + gallery into a single ordered array for the lightbox
  const allImages = [heroImage, ...galleryImages];

  return (
    <section
      className="relative w-full bg-slate"
      aria-label={`${excursionTitle} photo gallery`}
    >
      {/* Main hero image area — full bleed on mobile, constrained on desktop */}
      <div className="relative w-full max-w-[1440px] mx-auto">
        {/* Desktop: mosaic grid layout | Mobile: single hero + thumbnail strip */}
        <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 md:gap-1.5 md:h-[520px] lg:h-[580px] xl:h-[620px] md:rounded-b-2xl md:overflow-hidden md:mx-4 lg:mx-8 xl:mx-12">
          {/* Primary hero — takes 2 cols × 2 rows */}
          <div className="col-span-2 row-span-2 relative">
            <ImageGalleryHeroMain
              image={heroImage}
              allImages={allImages}
              categoryBadge={categoryBadge}
              labels={labels}
              index={0}
            />
          </div>

          {/* Secondary images — fill the right 2 cols */}
          {galleryImages.slice(0, 4).map((img, i) => (
            <div key={i} className="relative overflow-hidden">
              <ImageGalleryHeroMain
                image={img}
                allImages={allImages}
                labels={labels}
                index={i + 1}
                isSecondary
              />
            </div>
          ))}

          {/* "View all photos" overlay on last visible tile */}
          {galleryImages.length > 4 && (
            <ImageGalleryViewAll
              allImages={allImages}
              remainingCount={allImages.length - 5}
              labels={labels}
            />
          )}
        </div>

        {/* Mobile: single hero + swipeable thumbnail strip */}
        <div className="md:hidden">
          <div className="relative aspect-[4/3] w-full">
            <ImageGalleryHeroMain
              image={heroImage}
              allImages={allImages}
              categoryBadge={categoryBadge}
              labels={labels}
              index={0}
              isMobileHero
            />
          </div>

          {/* Thumbnail strip — horizontal scroll on mobile */}
          {galleryImages.length > 0 && (
            <ImageGalleryThumbnailStrip images={allImages} labels={labels} />
          )}
        </div>
      </div>
    </section>
  );
}

// ─── "View All Photos" overlay for the last tile on desktop ─────────────────
function ImageGalleryViewAll({
  allImages,
  remainingCount,
  labels,
}: {
  allImages: GalleryImage[];
  remainingCount: number;
  labels: ImageGalleryHeroProps["labels"];
}) {
  return (
    <ImageGalleryHeroMain
      image={allImages[4]}
      allImages={allImages}
      labels={labels}
      index={4}
      isSecondary
      viewAllOverlay={{
        count: remainingCount,
        text: labels.viewAllPhotos,
      }}
    />
  );
}
