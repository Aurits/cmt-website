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
      strokeWidth={1.6}
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
