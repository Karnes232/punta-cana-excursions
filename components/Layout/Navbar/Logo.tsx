import { Link } from "@/i18n/navigation";
import { Logo as LogoType } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import Image from "next/image";

export default function Logo({
  width,
  height,
  logo,
}: {
  width: number;
  height: number;
  logo: LogoType;
}) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
      {/* Logo mark placeholder — swap with <Image> of actual logo */}
      <Image
        src={logo.asset.url}
        alt={"Punta Cana Excursions"}
        width={width}
        height={height}
        loading="eager"
      />
      {/* <div className="w-10 h-10 rounded-lg bg-[#005F86] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
        <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
          <path
            d="M13 2C7 2 2 7 2 13S7 24 13 24 24 19 24 13 19 2 13 2Z"
            fill="rgba(255,255,255,0.15)"
            stroke="white"
            strokeWidth="1.2"
          />
          <path
            d="M5 16Q9 8 13 10Q17 12 21 8"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="13" cy="10" r="2" fill="#F4A11A" />
        </svg>
      </div>
      <div className="leading-tight">
        <p className="text-[14px] font-bold text-[#005F86] tracking-tight leading-none">
          Punta Cana Excursions
        </p>
        <p className="text-[11px] font-semibold text-[#F4A11A] tracking-wide mt-0.5">
          by Grand Bay
        </p>
      </div> */}
    </Link>
  );
}
