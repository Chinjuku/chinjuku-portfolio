import React from "react";
import {
  BookOpen,
  ChartNoAxesColumn,
  Clock,
  Compass,
  FlaskConical,
  Infinity as InfinityIcon,
  Layers,
  Search,
  Shuffle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { PersonalityIcon as IconKey } from "../../constants/personality";

// map คีย์จาก constants เป็นไอคอน lucide (constants เป็น .ts จึงเก็บ JSX ไม่ได้)
const ICONS: Record<IconKey, LucideIcon> = {
  search: Search,
  sparkles: Sparkles,
  compass: Compass,
  chart: ChartNoAxesColumn,
  shuffle: Shuffle,
  flask: FlaskConical,
  layers: Layers,
  infinity: InfinityIcon,
  book: BookOpen,
  clock: Clock,
};

export const PersonalityIcon: React.FC<{ name: IconKey; className?: string }> = ({ name, className = "h-4 w-4" }) => {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" className={className} />;
};
