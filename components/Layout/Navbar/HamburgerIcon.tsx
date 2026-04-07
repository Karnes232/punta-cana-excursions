export default function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col gap-[5px] w-6 cursor-pointer">
      <span
        className={`block h-[2px] bg-[#005F86] rounded-full transition-all duration-200 origin-center ${
          open ? "rotate-45 translate-y-[7px]" : ""
        }`}
      />
      <span
        className={`block h-[2px] bg-[#005F86] rounded-full transition-all duration-200 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block h-[2px] bg-[#005F86] rounded-full transition-all duration-200 origin-center ${
          open ? "-rotate-45 -translate-y-[7px]" : ""
        }`}
      />
    </div>
  );
}
