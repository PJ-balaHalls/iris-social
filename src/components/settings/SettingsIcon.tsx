import {
  Accessibility,
  Activity,
  BadgeCheck,
  Bell,
  Bot,
  Brain,
  Compass,
  CreditCard,
  Crown,
  Database,
  Gift,
  HeartHandshake,
  Image as ImageIcon,
  Leaf,
  LockKeyhole,
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

const iconMap: Record<string, typeof Settings> = {
  Accessibility,
  Activity,
  BadgeCheck,
  Bell,
  Bot,
  Brain,
  Compass,
  CreditCard,
  Crown,
  Database,
  Gift,
  HeartHandshake,
  Image: ImageIcon,
  Leaf,
  LockKeyhole,
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
  const Icon = iconMap[name] || Settings;

  return <Icon size={size} strokeWidth={1.8} className={className} />;
}
