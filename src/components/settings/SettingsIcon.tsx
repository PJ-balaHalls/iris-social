import {
  Accessibility,
  Baby,
  BadgeCheck,
  Brain,
  Compass,
  CreditCard,
  Database,
  EyeOff,
  Languages,
  LockKeyhole,
  MonitorSmartphone,
  Palette,
  Plug,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';

type SettingsIconProps = {
  name: string;
  size?: number;
  className?: string;
};

const icons = {
  Accessibility,
  Baby,
  BadgeCheck,
  Brain,
  Compass,
  CreditCard,
  Database,
  EyeOff,
  Languages,
  LockKeyhole,
  MonitorSmartphone,
  Palette,
  Plug,
  ShieldCheck,
  Sparkles,
  UserRound,
};

export function SettingsIcon({
  name,
  size = 18,
  className,
}: SettingsIconProps) {
  const Icon = icons[name as keyof typeof icons] || Settings;

  return <Icon size={size} strokeWidth={1.8} className={className} />;
}