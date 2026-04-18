"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: { url: string; lqip?: string } | null;
}

interface OurTeamProps {
  headline: string;
  subheading: string;
  members: TeamMember[];
}

export function OurTeam({ headline, subheading, members }: OurTeamProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-20 md:py-28 section-sand overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div
          className="text-center mb-14 transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <h2 className="font-heading font-bold text-navy text-3xl sm:text-4xl mb-4">
            {headline}
          </h2>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-16 bg-teal" />
            <div className="w-1.5 h-1.5 rounded-full bg-sunset" />
            <div className="h-px w-16 bg-teal" />
          </div>
          {subheading && (
            <p className="font-body text-gray-500 text-lg max-w-xl mx-auto">{subheading}</p>
          )}
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, i) => (
            <TeamMemberCard key={member.name} member={member} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamMemberCard({
  member,
  index,
  isVisible,
}: {
  member: TeamMember;
  index: number;
  isVisible: boolean;
}) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-sand-dark/20 shadow-sm hover:shadow-md transition-all duration-300 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${100 + index * 100}ms`,
      }}
    >
      {/* Photo area */}
      <div className="relative h-56 bg-gradient-to-br from-ocean to-teal">
        {member.photo?.url ? (
          <Image
            src={member.photo.url}
            alt={member.name}
            fill
            quality={75}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            placeholder={member.photo.lqip ? "blur" : "empty"}
            blurDataURL={member.photo.lqip}
            className="object-cover object-top"
          />
        ) : (
          /* Initials fallback */
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading font-bold text-white/60 text-5xl">{initials}</span>
          </div>
        )}
        {/* Bottom gradient for readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-heading font-bold text-navy text-xl leading-snug mb-1">
          {member.name}
        </h3>
        <p className="font-body font-medium text-teal text-sm mb-4">{member.role}</p>
        <p className="font-body text-gray-500 text-sm leading-relaxed line-clamp-4">{member.bio}</p>
      </div>
    </div>
  );
}
