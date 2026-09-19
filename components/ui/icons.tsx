import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const Base = ({ children, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {children}
  </svg>
);

export const LeafIcon = (props: IconProps) => <Base {...props}><path d="M19.5 4.5C12 4 6 7.5 5.5 13.5c-.3 3 1.5 5 4.5 5 6 0 9-7 9.5-14Z" /><path d="M4 20c2.5-4 6-7 11-10" /></Base>;
export const SoundIcon = (props: IconProps) => <Base {...props}><path d="M5 9H2v6h3l5 4V5L5 9Z" /><path d="M14 9.5a4 4 0 0 1 0 5M17 7a7.5 7.5 0 0 1 0 10" /></Base>;
export const MuteIcon = (props: IconProps) => <Base {...props}><path d="M5 9H2v6h3l5 4V5L5 9Z" /><path d="m15 9 6 6m0-6-6 6" /></Base>;
export const SettingsIcon = (props: IconProps) => <Base {...props}><circle cx="12" cy="12" r="3" /><path d="M19 14.5l1.5 1-.9 2.2-1.8-.3-1.3 1.3.3 1.8-2.2.9-1-1.5h-2l-1 1.5-2.2-.9.3-1.8-1.3-1.3-1.8.3-.9-2.2 1.5-1v-2l-1.5-1 .9-2.2 1.8.3 1.3-1.3-.3-1.8 2.2-.9 1 1.5h2l1-1.5 2.2.9-.3 1.8 1.3 1.3 1.8-.3.9 2.2-1.5 1v2Z" /></Base>;
export const CloseIcon = (props: IconProps) => <Base {...props}><path d="m6 6 12 12M18 6 6 18" /></Base>;
export const ArrowIcon = (props: IconProps) => <Base {...props}><path d="m9 18 6-6-6-6" /></Base>;
