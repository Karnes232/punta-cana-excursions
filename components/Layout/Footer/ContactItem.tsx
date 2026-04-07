export default function ContactItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 mb-3">
      <span className="text-[#0EA5B7] mt-0.5 shrink-0">{icon}</span>
      <span className="text-[13px] text-[#9CA3AF] leading-snug font-[Inter,sans-serif]">
        {children}
      </span>
    </div>
  );
}
