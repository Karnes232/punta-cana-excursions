import { Link } from "@/i18n/navigation";
export default function BookNowButton({
  className = "",
  label,
  href,
}: {
  className?: string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`bg-[#005F86] hover:bg-[#004a6a] text-white text-[13px] font-bold px-5 py-2.5 rounded-full transition-colors duration-150 whitespace-nowrap shadow-sm ${className}`}
    >
      {label}
    </Link>
  );
}
