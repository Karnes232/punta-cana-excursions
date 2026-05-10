import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface ContactInfoProps {
  headline: string;
  email: string;
  phone: string;
  serviceArea: string;
  responseTime: string;
  labels: {
    email: string;
    whatsapp: string;
    location: string;
    responseTime: string;
    emailUs: string;
    chatOnWhatsApp: string;
  };
}

export function ContactInfo({
  headline,
  email,
  phone,
  serviceArea,
  responseTime,
  labels,
}: ContactInfoProps) {
  const whatsappHref = `https://wa.me/${phone.replace(/\D/g, "")}`;
  const mailtoHref = `mailto:${email}`;

  return (
    <div>
      <WordRevealHeading
        as="h2"
        text={headline}
        className="font-heading font-bold text-navy text-2xl mb-8"
      />

      <div className="space-y-5">
        {/* Email */}
        <div className="flex gap-4 p-5 rounded-2xl bg-sand border border-slate-100 group hover:border-teal/30 transition-colors duration-200">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-ocean/10 flex items-center justify-center group-hover:bg-ocean/15 transition-colors duration-200">
            <MailIcon />
          </div>
          <div className="min-w-0">
            <p className="font-body text-xs text-slate/60 uppercase tracking-wider mb-1">
              {labels.email}
            </p>
            <a
              href={mailtoHref}
              className="font-heading font-semibold text-ocean text-sm break-all hover:text-teal transition-colors duration-150"
            >
              {email}
            </a>
            <p className="font-body text-slate/60 text-xs mt-0.5">{labels.emailUs}</p>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex gap-4 p-5 rounded-2xl bg-sand border border-slate-100 group hover:border-teal/30 transition-colors duration-200">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-whatsapp/10 flex items-center justify-center group-hover:bg-whatsapp/15 transition-colors duration-200">
            <WhatsAppIcon />
          </div>
          <div className="min-w-0">
            <p className="font-body text-xs text-slate/60 uppercase tracking-wider mb-1">
              {labels.whatsapp}
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading font-semibold text-whatsapp text-sm hover:opacity-80 transition-opacity duration-150"
            >
              {phone}
            </a>
            <p className="font-body text-slate/60 text-xs mt-0.5">{labels.chatOnWhatsApp}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex gap-4 p-5 rounded-2xl bg-sand border border-slate-100 group hover:border-teal/30 transition-colors duration-200">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-sunset/10 flex items-center justify-center group-hover:bg-sunset/15 transition-colors duration-200">
            <LocationIcon />
          </div>
          <div className="min-w-0">
            <p className="font-body text-xs text-slate/60 uppercase tracking-wider mb-1">
              {labels.location}
            </p>
            <p className="font-body text-navy text-sm leading-relaxed">
              {serviceArea}
            </p>
          </div>
        </div>

        {/* Response time */}
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-teal/20 bg-teal/5">
          <div className="w-2 h-2 rounded-full bg-teal flex-shrink-0 animate-pulse" />
          <p className="font-body text-slate/70 text-sm">
            <span className="font-semibold text-teal">{labels.responseTime}:</span>{" "}
            {responseTime}
          </p>
        </div>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg className="w-5 h-5 text-ocean" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5 text-whatsapp" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.115 1.533 5.84L.057 23.999l6.305-1.654A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.94a9.919 9.919 0 01-5.065-1.383l-.364-.215-3.742.982.999-3.648-.237-.375A9.913 9.913 0 012.06 12C2.06 6.51 6.51 2.06 12 2.06S21.94 6.51 21.94 12 17.49 21.94 12 21.94z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5 text-sunset" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
