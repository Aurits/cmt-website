/**
 * Inline icons, drawn from Lucide (lucide.dev, ISC licence, lucide-static 1.61.0) and copied in
 * as paths rather than installed, so the payload is only the icons the site uses. They replaced a
 * hand-drawn set in October 2026 whose strokes, corner radii and proportions all differed a little
 * from icon to icon; Lucide is drawn on one grid with one set of rules, so a row of these reads as
 * a set. The brand marks at the bottom are the platforms' own glyphs.
 *
 * All are 24x24, currentColor, and decorative unless given a title by the caller.
 */
type IconProps = React.SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      // 1.8, as the hero design sets them. Lucide is drawn for 2, which looked bolder than the
      // 15px text these label.
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      width={20}
      height={20}
      {...props}
    >
      {children}
    </svg>
  );
}

export const PhoneIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  </Icon>
);

export const MailIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
    <rect x="2" y="4" width="20" height="16" rx="2" />
  </Icon>
);

export const WhatsAppIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    width={20}
    height={20}
    {...props}
  >
    <path d="M12.02 2C6.6 2 2.2 6.4 2.2 11.82c0 1.9.54 3.68 1.48 5.2L2 22l5.1-1.63a9.8 9.8 0 0 0 4.92 1.3c5.42 0 9.82-4.4 9.82-9.82S17.44 2 12.02 2Zm0 17.82c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.03.97.96-2.96-.2-.32a7.98 7.98 0 0 1-1.24-4.3 8 8 0 1 1 8.2 8Zm4.5-5.86c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.8-.77.96-.14.16-.28.18-.52.06a6.5 6.5 0 0 1-1.92-1.19 7.3 7.3 0 0 1-1.33-1.66c-.14-.24-.02-.38.1-.5.12-.12.28-.32.42-.48.11-.13.17-.25.25-.41.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.47-.4-.4-.55-.41h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.68 2.66 4.1 3.63 2.42.96 2.42.64 2.86.6.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
  </svg>
);

export const PinIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 5h16" />
    <path d="M4 12h16" />
    <path d="M4 19h16" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);

export const BedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
    <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
    <path d="M12 4v6" />
    <path d="M2 18h20" />
  </Icon>
);

export const BathIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 4 8 6" />
    <path d="M17 19v2" />
    <path d="M2 12h20" />
    <path d="M7 19v2" />
    <path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
  </Icon>
);

/* A measured length: floor and plot areas are a surveyor's figures, so the mark is a dimension. */
export const AreaIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 15v-3" />
    <path d="M14 15v-3" />
    <path d="M18 15v-3" />
    <path d="M2 8V4" />
    <path d="M22 6H2" />
    <path d="M22 8V4" />
    <path d="M6 15v-3" />
    <rect x="2" y="12" width="20" height="8" rx="2" />
  </Icon>
);

export const ClockIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6h4" />
  </Icon>
);

export const ChevronIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
);

export const ChevronDownIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const ArrowRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Icon>
);

/* The chat bubble the design uses for the WhatsApp button. */
export const ChatIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </Icon>
);

export const CheckCircleIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m9 12 2 2 4-4" />
    <circle cx="12" cy="12" r="10" />
  </Icon>
);

export const ShieldIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

/*
 * Valuation purposes. One mark per purpose, used where five near-identical text rows otherwise
 * rely on position alone to be told apart: the homepage purpose cards and the valuation matrix.
 * Each is the object the purpose is about, not a metaphor for it: a bank for lending, a report
 * with a chart for financial reporting, cover for insurance, the scales for litigation, and a
 * marked plot of land for compensation.
 */
export const LendingIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 18v-7" />
    <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" />
    <path d="M14 18v-7" />
    <path d="M18 18v-7" />
    <path d="M3 22h18" />
    <path d="M6 18v-7" />
  </Icon>
);

export const ReportingIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
    <path d="M14 2v5a1 1 0 0 0 1 1h5" />
    <path d="M8 18v-1" />
    <path d="M12 18v-6" />
    <path d="M16 18v-3" />
  </Icon>
);

export const InsuranceIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 13v7a2 2 0 0 0 4 0" />
    <path d="M12 2v2" />
    <path d="M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z" />
  </Icon>
);

export const LitigationIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3v18" />
    <path d="m19 8 3 8a5 5 0 0 1-6 0zV7" />
    <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" />
    <path d="m5 8 3 8a5 5 0 0 1-6 0zV7" />
    <path d="M7 21h10" />
  </Icon>
);

export const CompensationIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m12 8 6-3-6-3v10" />
    <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12" />
    <path d="m6.49 12.85 11.02 6.3" />
    <path d="M17.51 12.85 6.5 19.15" />
  </Icon>
);

/* Brand marks. Filled, like WhatsAppIcon, because each platform's mark is a solid glyph. */
function BrandIcon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      width={20}
      height={20}
      {...props}
    >
      {children}
    </svg>
  );
}

export const FacebookIcon = (props: IconProps) => (
  <BrandIcon {...props}>
    <path d="M13.5 21.5v-8.2h2.76l.41-3.2H13.5V8.06c0-.93.26-1.56 1.59-1.56h1.7V3.64A22.6 22.6 0 0 0 14.31 3.5c-2.45 0-4.13 1.5-4.13 4.24v2.36H7.4v3.2h2.78v8.2h3.32Z" />
  </BrandIcon>
);

export const XIcon = (props: IconProps) => (
  <BrandIcon {...props}>
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.57l11.1 14.45Z" />
  </BrandIcon>
);

export const InstagramIcon = (props: IconProps) => (
  <BrandIcon {...props}>
    <path d="M12 3c-2.44 0-2.75.01-3.71.05-.96.05-1.61.2-2.18.42a4.4 4.4 0 0 0-1.6 1.04 4.4 4.4 0 0 0-1.04 1.6c-.22.57-.37 1.22-.42 2.18C3.01 9.25 3 9.56 3 12s.01 2.75.05 3.71c.05.96.2 1.61.42 2.18.23.59.54 1.1 1.04 1.6.5.5 1.01.81 1.6 1.04.57.22 1.22.37 2.18.42.96.04 1.27.05 3.71.05s2.75-.01 3.71-.05c.96-.05 1.61-.2 2.18-.42a4.4 4.4 0 0 0 1.6-1.04c.5-.5.81-1.01 1.04-1.6.22-.57.37-1.22.42-2.18.04-.96.05-1.27.05-3.71s-.01-2.75-.05-3.71c-.05-.96-.2-1.61-.42-2.18a4.4 4.4 0 0 0-1.04-1.6 4.4 4.4 0 0 0-1.6-1.04c-.57-.22-1.22-.37-2.18-.42C14.75 3.01 14.44 3 12 3Zm0 1.62c2.4 0 2.69.01 3.64.05.88.04 1.35.19 1.67.31.42.16.72.36 1.03.67.32.32.51.62.68 1.04.12.32.27.8.31 1.67.04.95.05 1.24.05 3.64s-.01 2.69-.05 3.64c-.04.88-.19 1.35-.31 1.67-.17.42-.36.72-.68 1.03-.31.32-.61.51-1.03.68-.32.12-.8.27-1.67.31-.95.04-1.24.05-3.64.05s-2.69-.01-3.64-.05c-.88-.04-1.35-.19-1.67-.31a2.8 2.8 0 0 1-1.03-.68 2.8 2.8 0 0 1-.68-1.03c-.12-.32-.27-.8-.31-1.67-.04-.95-.05-1.24-.05-3.64s.01-2.69.05-3.64c.04-.88.19-1.35.31-1.67.17-.42.36-.72.68-1.04.31-.31.61-.5 1.03-.67.32-.12.8-.27 1.67-.31.95-.04 1.24-.05 3.64-.05Zm0 2.76a4.62 4.62 0 1 0 0 9.24 4.62 4.62 0 0 0 0-9.24ZM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.88-7.8a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0Z" />
  </BrandIcon>
);

export const LinkedInIcon = (props: IconProps) => (
  <BrandIcon {...props}>
    <path d="M19.67 3H4.33C3.6 3 3 3.58 3 4.3v15.4c0 .72.6 1.3 1.33 1.3h15.34c.73 0 1.33-.58 1.33-1.3V4.3C21 3.58 20.4 3 19.67 3ZM8.34 18.34H5.67V9.75h2.67v8.59ZM7 8.58a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Zm11.34 9.76h-2.67v-4.18c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.21v4.25H10V9.75h2.56v1.17h.04c.36-.68 1.23-1.39 2.53-1.39 2.7 0 3.2 1.78 3.2 4.09v4.72Z" />
  </BrandIcon>
);

export const YouTubeIcon = (props: IconProps) => (
  <BrandIcon {...props}>
    <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42a2.5 2.5 0 0 0-1.76 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15V9l5.2 3-5.2 3Z" />
  </BrandIcon>
);

export const TikTokIcon = (props: IconProps) => (
  <BrandIcon {...props}>
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.6 2.6 0 0 1-2.6 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.37-2.49V9.66A5.74 5.74 0 0 0 4.1 15.3a5.74 5.74 0 0 0 5.75 5.7 5.74 5.74 0 0 0 5.74-5.7V9.01a7.3 7.3 0 0 0 4.27 1.37V7.3a4.27 4.27 0 0 1-3.26-1.48Z" />
  </BrandIcon>
);
