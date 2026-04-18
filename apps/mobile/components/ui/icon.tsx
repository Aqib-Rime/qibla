import type { LucideProps } from "lucide-react-native"
import {
  ArrowUpRight,
  BellRing,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Compass,
  Heart,
  LocateFixed,
  LogOut,
  Mail,
  MapPin,
  MoreHorizontal,
  ParkingSquare,
  Route,
  Pencil,
  Phone,
  Search,
  Settings2,
  Share2,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Star,
  User,
  Users,
  Wifi,
  X,
} from "lucide-react-native"

export const iconMap = {
  ac: Snowflake,
  alert: CircleAlert,
  arrow: ArrowUpRight,
  back: ChevronLeft,
  bell: BellRing,
  book: BookOpen,
  calendar: CalendarDays,
  chevron: ChevronRight,
  clock: Clock3,
  compass: Compass,
  directions: Route,
  filter: SlidersHorizontal,
  heart: Heart,
  "log-out": LogOut,
  mail: Mail,
  more: MoreHorizontal,
  mosque: MapPin,
  parking: ParkingSquare,
  pencil: Pencil,
  phone: Phone,
  pin: MapPin,
  recenter: LocateFixed,
  search: Search,
  settings: Settings2,
  share: Share2,
  sparkle: Sparkles,
  star: Star,
  user: User,
  users: Users,
  wifi: Wifi,
  x: X,
} as const

export type IconName = keyof typeof iconMap

export function Icon({
  name,
  size = 20,
  color = "currentColor",
  ...rest
}: LucideProps & { name: IconName }) {
  const Cmp = iconMap[name]
  return <Cmp size={size} color={color} {...rest} />
}
