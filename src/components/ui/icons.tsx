/**
 * Inline icons only — no icon library, to keep the mobile payload small.
 * All are 24×24, currentColor, and decorative unless given a title by the caller.
 */
type IconProps = React.SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      // 1.8, up from 1.6: at the 14-24px these are drawn at, 1.6 read as a wireframe beside
      // semibold type. Heavier strokes sit at the same visual weight as the text they label.
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
    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 3 5.1 1 1 0 0 1 4 4Z" />
  </Icon>
);

export const MailIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
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
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const BedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 18v-7h18v7M3 11V7M21 18v2M3 18v2" />
    <path d="M7 11V8.5h5V11" />
  </Icon>
);

export const BathIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z" />
    <path d="M7 12V6.5A2.5 2.5 0 0 1 12 6" />
    <path d="M7 19v2M17 19v2" />
  </Icon>
);

export const AreaIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <path d="M9 4v3.5M4 9h3.5M15 20v-3.5M20 15h-3.5" />
  </Icon>
);

export const ClockIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const ChevronIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

export const ShieldIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3l7 2.5v5.8c0 4.3-2.9 7.6-7 9.2-4.1-1.6-7-4.9-7-9.2V5.5L12 3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Icon>
);

/*
 * Valuation purposes. One mark per purpose, in the same grammar as the icons above, used where
 * five near-identical text rows otherwise rely on position alone to be told apart: the homepage
 * purpose cards and the valuation matrix. Each is the object the purpose is about, not a
 * metaphor for it, so a lender sees a bank rather than a handshake.
 */
export const LendingIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 9 12 4l8.5 5" />
    <path d="M4.5 9h15M5.5 20h13M3.5 20h17" />
    <path d="M7 12v5M10.3 12v5M13.7 12v5M17 12v5" />
  </Icon>
);

export const ReportingIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 3.5h8.5L18 7v13.5H6Z" />
    <path d="M14 3.5V7h4" />
    <path d="M9 17v-3M12 17v-5.5M15 17v-2" />
  </Icon>
);

export const InsuranceIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 12a8.5 8.5 0 0 1 17 0Z" />
    <path d="M12 12v6.5a2 2 0 0 1-4 0" />
    <path d="M12 3.5V2.5" />
  </Icon>
);

export const LitigationIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 4v16M8 20h8M5 7h14" />
    <path d="M5 7 2.5 13a2.5 2.5 0 0 0 5 0Z" />
    <path d="M19 7l-2.5 6a2.5 2.5 0 0 0 5 0Z" />
  </Icon>
);

/* A plot with a road cut through it: land taken for infrastructure, which is what compensation
 * work is. An earlier plus sign in the middle read as first aid. */
export const CompensationIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 18.5 6 5.5l12.5-1.5 2 14.5Z" />
    <path d="M8.6 5.2 11.4 18.5M13.4 4.6 16 18.5" />
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
