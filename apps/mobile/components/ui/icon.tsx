import type { LucideProps } from "lucide-react-native"
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Heart,
  Locate,
  LogOut,
  Mail,
  MapPin,
  MoreVertical,
  Navigation,
  Pencil,
  Phone,
  Search,
  Settings,
  Share2,
  Snowflake,
  Star,
  User,
  Users,
  Wifi,
  X,
} from "lucide-react-native"

export const iconMap = {
  ac: Snowflake,
  alert: AlertCircle,
  arrow: ArrowRight,
  back: ChevronLeft,
  bell: Bell,
  book: BookOpen,
  calendar: Calendar,
  chevron: ChevronRight,
  clock: Clock,
  compass: Compass,
  heart: Heart,
  locate: Locate,
  "log-out": LogOut,
  mail: Mail,
  more: MoreVertical,
  mosque: MapPin,
  navigation: Navigation,
  parking: Car,
  pencil: Pencil,
  phone: Phone,
  pin: MapPin,
  search: Search,
  settings: Settings,
  share: Share2,
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
