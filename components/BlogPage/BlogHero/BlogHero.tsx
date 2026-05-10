import Image from "next/image";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface BlogHeroProps {
  headline: string;
  subheadline: string;
  backgroundImage?: {
    url: string;
    lqip?: string;
  } | null;
}

export function BlogHero({ headline, subheadline, backgroundImage }: BlogHeroProps) {
  const hasImage = !!backgroundImage?.url;

  return (
    <div
      className="relative pt-28 pb-20 overflow-hidden"
      style={
        hasImage
          ? undefined
          : { background: "linear-gradient(135deg, #005F86 0%, #0EA5B7 100%)" }
      }
    >
      {hasImage && (
        <>
          <Image
            src={backgroundImage!.url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            placeholder={backgroundImage!.lqip ? "blur" : undefined}
            blurDataURL={backgroundImage!.lqip}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,95,134,0.85) 0%, rgba(14,165,183,0.75) 100%)",
            }}
          />
        </>
      )}

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -bottom-px left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48V24C360 0 720 48 1080 24C1260 12 1350 30 1440 24V48H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <WordRevealHeading
          as="h1"
          text={headline}
          triggerOnMount
          className="font-heading font-bold text-white text-4xl sm:text-5xl leading-tight mb-5"
        />
        {subheadline && (
          <p className="font-body text-white/80 text-lg leading-relaxed max-w-xl mx-auto">
            {subheadline}
          </p>
        )}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="h-[2px] w-10 bg-white/40 rounded-full" />
          <div className="w-2 h-2 rounded-full bg-sunset" />
          <div className="h-[2px] w-10 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
