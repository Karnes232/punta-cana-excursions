import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  function onClick(next: "en" | "es") {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <button
      onClick={() => onClick(locale === "en" ? "es" : "en")}
      className="text-[12px] font-semibold text-[#005F86] border-[1.5px] border-[#005F86] rounded-full px-3 py-1.5 hover:bg-[#E8F4F9] transition-colors duration-150 whitespace-nowrap"
    >
      EN / ES
    </button>
  );
}
